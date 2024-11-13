import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

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
}
