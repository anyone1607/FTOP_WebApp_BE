import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from '../dto/user.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
    const { email, password, ...rest } = createUserDto;
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      ...rest,
      role: 'user',
      walletBalance: 0,
      isActive: true,
    });
    return await this.userRepository.save(user);
  }

}
