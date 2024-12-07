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


}
