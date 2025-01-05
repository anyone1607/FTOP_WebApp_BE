import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDetails } from 'src/utils/types';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {

    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

    async validateUser(details: UserDetails) {
        // console.log("AuthService");
        // console.log(details);
        const user = await this.userRepository.findOneBy({ email: details.email });
        // console.log(user);
        if(user) return user;
        // console.log("User not found");
        const newUser = this.userRepository.create(details);
        return this.userRepository.save(newUser);
    }

    async findUser(id: number){
        const user = await this.userRepository.findOneBy({ id });
        return user;
    }
}