import { ConflictException, HttpException, Injectable,NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from '../dto/register-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { HttpStatus } from 'src/global/globalEnum';
import { ConfigService } from '@nestjs/config';
import { BankTransfer } from '../banktransfer/entities/banktransfer.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(BankTransfer)
    private bankTransferRepository: Repository<BankTransfer>,
  ) {}

  async countTotalUsers(userId: string, role: string): Promise<number> {
    if (role === 'owner') {
      const ownerId = parseInt(userId, 10);
      return await this.userRepository.createQueryBuilder('user')
        .innerJoin('user.store', 'store')
        .where('store.ownerId = :ownerId', { ownerId })
        .getCount();
    }
    return await this.userRepository.count();
  }

  async findUser(id: number): Promise<User> {
    return await this.userRepository.findOneBy({ id });
  }

  // async findAllUsers(): Promise<User[]> {
  //   return await this.userRepository.find();
  // }

      async findByEmail(email :string){
        return await this.userRepository.findOne({
          where:{
            email,
          },
        });
      }

      async searchUsers(query: string, role: string): Promise<User[]> {
        const queryBuilder = this.userRepository.createQueryBuilder('user');
    
        if (query) {
          queryBuilder.andWhere('user.email LIKE :query OR user.displayName LIKE :query', { query: `%${query}%` });
        }
    
        if (role) {
          queryBuilder.andWhere('user.role = :role', { role });
        }
    
        return await queryBuilder.getMany();
      }



  // // register user with email and password (android)
  // async registerUser(createUserDto: CreateUserDto): Promise<User> {
  //   const { email, displayName, password, phoneNumber, ...rest } =
  //     createUserDto;

  //   const existingUser = await this.userRepository.findOne({
  //     where: [{ email }, { phoneNumber }],
  //   });

  //   if (existingUser) {
  //     const errors = [];
    
  //     if (existingUser.email === email) {
  //       errors.push('Email already exists');
  //     }
    
  //     if (existingUser.phoneNumber === phoneNumber) {
  //       errors.push('Phone number already exists');
  //     }
    
  //     if (errors.length > 0) {
  //       throw new ConflictException(errors);
  //     }
  //   }

  //   const hashedPassword = await this.hashPassword(password);

  //   const newUser = this.userRepository.create({
  //     email,
  //     displayName,
  //     password: hashedPassword,
  //     phoneNumber,
  //     role: 'student',
  //     ...rest,
  //   });

  //   return this.userRepository.save(newUser);
  // }

  // login user with email and password (android)
  async loginUser(loginUserDto: LoginUserDto): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email: loginUserDto.emailOrPhone },
    });
    if (!user) {
      throw new HttpException('Email is not exist', HttpStatus.BAD_REQUEST);
    }
    const checkPass = await bcrypt.compare(loginUserDto.password, user.password);
    if (!checkPass) {
      throw new HttpException(
        'Password is not correct',
        HttpStatus.BAD_REQUEST,
      );
    }
    const payload = { id: user.id, email: user.email };
    return this.generateToken(payload);
  }
  
  
  
  // async refreshToken(refresh_token: string): Promise<any> {
  //   try {
  //     const verify = await this.jwtService.verify(refresh_token, {
  //       secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
  //     });
  //     const checkExistToken = await this.userRepository.findOneBy({
  //       email: verify.email,
  //       refresh_token,
  //     });
  //     if (checkExistToken) {
  //       return this.generateToken({ id: verify.id, email: verify.email });
  //     } else {
  //       throw new HttpException(
  //         'Refresh token is not valid',
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     throw new HttpException(
  //       'Refresh token is not valid',
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  // }

  // private async generateToken(payload: { id: number; email: string }) {
  //   const access_token = await this.jwtService.signAsync(payload);
  //   const refresh_token = await this.jwtService.signAsync(payload, {
  //     secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
  //     expiresIn: this.configService.get<string>('TOKEN_EXPIRES_IN'),
  //   });
  //   await this.userRepository.update(
  //     { email: payload.email },
  //     { refresh_token: refresh_token },
  //   );
  //   return { access_token, refresh_token };
  // }
  

  // private async hashPassword(password: string): Promise<string> {
  //   const saltOrRounds = 10;
  //   const salt = await bcrypt.genSalt(saltOrRounds);
  //   const hash = await bcrypt.hash(password, salt);
  //   return hash;
  // }
  // async updateUserStatus(id: number, isActive: boolean): Promise<User> {
  //   const user = await this.userRepository.findOne({ where: { id } });
  //   if (!user) {
  //     throw new NotFoundException(`User with ID ${id} not found`);
  //   }
  //   user.isActive = isActive;
  //   return this.userRepository.save(user);
  // }
  // async findOwnersWithoutStore(): Promise<User[]> {
  //   return this.userRepository.createQueryBuilder('user')
  //     .leftJoinAndSelect('user.store', 'store')
  //     .where('user.role = :role', { role: 'owner' })
  //     .andWhere('store.storeId IS NULL')
  //     .getMany();
  // }
  async findAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  // register user with email and password (android)
  async registerUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, displayName, password, phoneNumber, ...rest } =
      createUserDto;

    const existingUser = await this.userRepository.findOne({
      where: [{ email }, { phoneNumber }],
    });

    if (existingUser) {
      const errors = [];

      if (existingUser.email === email) {
        errors.push('Email already exists');
      }

      if (existingUser.phoneNumber === phoneNumber) {
        errors.push('Phone number already exists');
      }

      if (errors.length > 0) {
        throw new ConflictException(errors);
      }
    }

    const hashedPassword = await this.hashPassword(password);

    const newUser = this.userRepository.create({
      email,
      displayName,
      password: hashedPassword,
      phoneNumber,
      role: 'student',
      ...rest,
    });

    return this.userRepository.save(newUser);
  }

  // login user with email and password (android)
  // async loginUser(loginUserDto: LoginUserDto): Promise<any> {
  //   const user = await this.userRepository.findOne({
  //     where: { email: loginUserDto.emailOrPhone },
  //   });
  //   if (!user) {
  //     throw new HttpException('Email is not exist', HttpStatus.BAD_REQUEST);
  //   }
  //   const checkPass = await bcrypt.compare(loginUserDto.password, user.password);
  //   if (!checkPass) {
  //     throw new HttpException(
  //       'Password is not correct',
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  //   const payload = { id: user.id, email: user.email };
  //   return this.generateToken(payload);
  // }
  
  
  
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
  // async deposit(depositDto: DepositDto): Promise<User> {
  //   const { walletUserId, transferAmount, accountNumber, bankName, transferDescription } = depositDto;

  //   const user = await this.userRepository.findOne({ where: { id: walletUserId } });
  //   if (!user) {
  //     throw new Error('User not found');
  //   }

  //   const bankTransfer = new BankTransfer();
  //   bankTransfer.walletUserId = walletUserId;
  //   bankTransfer.transferAmount = transferAmount;
  //   bankTransfer.accountNumber = accountNumber;
  //   bankTransfer.bankName = bankName;
  //   bankTransfer.transferType = true;
  //   bankTransfer.transferDescription = transferDescription;
  //   bankTransfer.transferDate = new Date();
  //   bankTransfer.status = true;

  //   await this.bankTransferRepository.save(bankTransfer);

  //   user.walletBalance += transferAmount;
  //   await this.userRepository.save(user);

  //   return user;
  // } 


  // updateBalance
  async updateBalance(userId: number, amount: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (user) {
      user.walletBalance += amount;
      return this.userRepository.save(user);
    }
    throw new Error('User not found');
  }
  async findOwnersWithoutStore(): Promise<User[]> {
    return this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.store', 'store')
      .where('user.role = :role', { role: 'owner' })
      .andWhere('store.storeId IS NULL')
      .getMany();
  }
  async updateUserStatus(id: number, isActive: boolean): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    user.isActive = isActive;
    return this.userRepository.save(user);
  }

}
