import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from '../dto/user.dto';
@Controller('user')
export class UserController {

  constructor(private readonly usersService: UserService) {}

  @Get('countUser')
  async getTotalUsers(): Promise<{ totalUsers: number }> {
    const totalUsers = await this.usersService.countTotalUsers();
    return { totalUsers };
  }

  @Get('findUser/:id')
  async findUser(@Param('id') id: number): Promise<User> {
    return await this.usersService.findUser(id);
  }

  @Get('findUser')
  async findUsers(): Promise<User[]> {
    return await this.usersService.findAllUsers();
  }

  @Post('registerUser')
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.registerUser(createUserDto);
  }
  
}
