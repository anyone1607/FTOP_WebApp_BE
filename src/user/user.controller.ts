import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from '../dto/register-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
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
  register(@Body() createUserDto: CreateUserDto):void {
     this.usersService.registerUser(createUserDto);
  }

  @Post('loginUser')
  async login(@Body() loginUserDto: LoginUserDto): Promise<any> {
    return this.usersService.loginUser(loginUserDto);
  }

  @Post('refreshToken') 
  refreshToken(@Body() {refresh_token}): Promise<any> {
    console.log(refresh_token);
    return this.usersService.refreshToken(refresh_token);
  }
  
}
