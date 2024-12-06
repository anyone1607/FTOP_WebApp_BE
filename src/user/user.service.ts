import { HttpException, Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from '../dto/register-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import * as bcrypt from 'bcrypt';
// import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { HttpStatus } from 'src/global/globalEnum';
// import { MailerService } from '@nestjs-modules/mailer';
import { DepositDto } from '../dto/deposit.dto';
import { BankTransfer } from '../banktransfer/entities/banktransfer.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    // private readonly mailerService: MailerService,
    @InjectRepository(BankTransfer)
    private bankTransferRepository: Repository<BankTransfer>,
  ) {}

  async countTotalUsers(): Promise<number> {
    return await this.userRepository.count();
  }

  async findUser(id: number): Promise<User> {
    return await this.userRepository.findOneBy({ id });
  }

  async findAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  // register user with email and password (android)
  async registerUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, displayName, password, ...rest } = createUserDto;
    const existingUser = await this.userRepository.findOne({
      where: [
        { email }
      ],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new ConflictException('Email already exists');
      }
    }
    const hashedPassword = await this.hashPassword(password);

    const newUser = this.userRepository.create({
      email,
      displayName,
      password: hashedPassword,
      role: 'student',
      ...rest,
    });

    return this.userRepository.save(newUser);
  }

  // login user with email and password (android)
  async loginUser(loginUserDto: LoginUserDto): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email: loginUserDto.emailOrPhone } });
    if(!user) {
      throw new HttpException('Email is not exist', HttpStatus.BAD_REQUEST);
    }
    const checkPass = bcrypt.compareSync(loginUserDto.password, user.password);
    if(!checkPass) {
      throw new HttpException('Password is not correct', HttpStatus.BAD_REQUEST);
    }
    // generate access_token and refresh_token
    const payload = { id: user.id, email: user.email };
    return this.generateToken(payload);
  }

  async refreshToken(refresh_token: string): Promise<any> {
    try {
      const verify = await this.jwtService.verify(refresh_token, { secret: 'refresh_token_secret' });
      const checkExistToken = await this.userRepository.findOneBy( { email: verify.email, refresh_token } );
      if(checkExistToken) {
        return this.generateToken({ id: verify.id, email: verify.email });
      }else {
        throw new HttpException('Refresh token is not valid', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      console.log(error);
      throw new HttpException('Refresh token is not valid', HttpStatus.BAD_REQUEST);
    }
  }

  private async generateToken (payload: {id: number, email: string}) {
    const access_token = await this.jwtService.signAsync(payload);
    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: 'refresh_token_secret',
      expiresIn: '1d'
    });
    await this.userRepository.update(
      { email: payload.email },
      { refresh_token: refresh_token }
    ); 
    return { access_token, refresh_token };
  }

  private async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    const salt = await bcrypt.genSalt(saltOrRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  // fogotPassword with email (android)
  // async handleForgotPassword(email: string) {
  //   const user = await this.userRepository.findOne({ where: { email } });
  //   if (!user) {
  //     throw new BadRequestException('User with this email does not exist');
  //   }

  //   // Generate reset token
  //   const resetToken = crypto.randomBytes(32).toString('hex');
  //   const hashedToken = await bcrypt.hash(resetToken, 10);

  //   // Save token in the database
  //   user.refresh_token = hashedToken;
  //   await this.userRepository.save(user);

  //   // Send email with reset link
  //   const resetLink = `http://yourfrontend.com/reset-password?token=${resetToken}`;
  //   await this.mailerService.sendMail({
  //     to: user.email,
  //     subject: 'Reset Your Password',
  //     template: './reset-password',
  //     context: {
  //       name: user.displayName,
  //       resetLink,
  //     },
  //   });

  //   return { message: 'Reset password email sent' };
  // }

  // async handleResetPassword(token: string, newPassword: string) {
  //   const users = await this.userRepository.find();
  //   const user = users.find((user) =>
  //     bcrypt.compareSync(token, user.refresh_token),
  //   );

  //   if (!user) {
  //     throw new BadRequestException('Invalid or expired token');
  //   }

  //   // Update user password
  //   const hashedPassword = await bcrypt.hash(newPassword, 10);
  //   user.password = hashedPassword;
  //   user.refresh_token = null; // Clear the token
  //   await this.userRepository.save(user);

  //   return { message: 'Password reset successfully' };
  // }
  

  // api nạp tiền vào ví (android) nạp chay
  async deposit(depositDto: DepositDto): Promise<User> {
    const { walletUserId, transferAmount, accountNumber, bankName, transferDescription } = depositDto;

    const user = await this.userRepository.findOne({ where: { id: walletUserId } });
    if (!user) {
      throw new Error('User not found');
    }

    const bankTransfer = new BankTransfer();
    bankTransfer.walletUserId = walletUserId;
    bankTransfer.transferAmount = transferAmount;
    bankTransfer.accountNumber = accountNumber;
    bankTransfer.bankName = bankName;
    bankTransfer.transferType = true;
    bankTransfer.transferDescription = transferDescription;
    bankTransfer.transferDate = new Date();
    bankTransfer.status = true;

    await this.bankTransferRepository.save(bankTransfer);

    user.walletBalance += transferAmount;
    await this.userRepository.save(user);

    return user;
  } 


  // updateBalance
  async updateBalance(userId: number, amount: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (user) {
      user.walletBalance += amount;
      return this.userRepository.save(user);
    }
    throw new Error('User not found');
  }

}
