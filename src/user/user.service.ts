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

  async countTotalUsers(): Promise<number> {
    return await this.userRepository.count();
  }

  async findUser(id: number): Promise<User> {
    return await this.userRepository.findOneBy({ id });
  }

  async findAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

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
  
  
  
  async refreshToken(refresh_token: string): Promise<any> {
    try {
      const verify = await this.jwtService.verify(refresh_token, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      });
      const checkExistToken = await this.userRepository.findOneBy({
        email: verify.email,
        refresh_token,
      });
      if (checkExistToken) {
        return this.generateToken({ id: verify.id, email: verify.email });
      } else {
        throw new HttpException(
          'Refresh token is not valid',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Refresh token is not valid',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async generateToken(payload: { id: number; email: string }) {
    const access_token = await this.jwtService.signAsync(payload);
    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('TOKEN_EXPIRES_IN'),
    });
    await this.userRepository.update(
      { email: payload.email },
      { refresh_token: refresh_token },
    );
    return { access_token, refresh_token };
  }
  

  private async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    const salt = await bcrypt.genSalt(saltOrRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }
  async updateUserStatus(id: number, isActive: boolean): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    user.isActive = isActive;
    return this.userRepository.save(user);
  }
  async findOwnersWithoutStore(): Promise<User[]> {
    return this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.store', 'store')
      .where('user.role = :role', { role: 'owner' })
      .andWhere('store.storeId IS NULL')
      .getMany();
  }
}
