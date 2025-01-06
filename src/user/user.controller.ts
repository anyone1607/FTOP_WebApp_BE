import {
  Controller,
  Get,
  Param,
  Post,
  Body,Query,Patch,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from '../dto/register-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get('owners-without-store')
  async getOwnersWithoutStore() {
    return this.usersService.findOwnersWithoutStore();
  }

  @Get('countUser')
  async getTotalUsers(): Promise<{ totalUsers: number }> {
    const totalUsers = await this.usersService.countTotalUsers();
    return { totalUsers };
  }

  @Get('findUser/:id')
  async findUser(@Param('id') id: number): Promise<User> {
    return await this.usersService.findUser(id);
  }

  @Patch(':id/status')
  async updateUserStatus(
    @Param('id') id: number,
    @Body('isActive') isActive: boolean,
  ): Promise<User> {
    return this.usersService.updateUserStatus(id, isActive);
  }

  @Get('findUser')
  async findUsers(): Promise<User[]> {
    return await this.usersService.findAllUsers();
  }

  @Post('registerUser')
  async register(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto,
  ): Promise<User> {
    return this.usersService.registerUser(createUserDto);
  }

  @Post('loginUser')
  async login(@Body(new ValidationPipe()) loginUserDto: LoginUserDto): Promise<User> {
    return this.usersService.loginUser(loginUserDto);
  }

  @Post('refreshToken')
  refreshToken(@Body() { refresh_token }): Promise<any> {
    console.log(refresh_token);
    return this.usersService.refreshToken(refresh_token);
  }

  @Get('search')
  async searchUsers(
    @Query('query') query: string,
    @Query('role') role: string,
  ): Promise<User[]> {
    return await this.usersService.searchUsers(query, role);
  }

  @Get('email/:email')
  async findByEmail(@Param('email') email: string): Promise<User> {
    return await this.usersService.findByEmail(email);
  }



}
