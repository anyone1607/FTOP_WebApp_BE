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

  @Get('check-duplicate')
async checkDuplicate(@Query('email') email: string, @Query('phone') phone: string) {
  const exists = await this.usersService.isEmailOrPhoneExists(email, phone);
  return { exists };
}

@Get('searchapp')
    async searchUsersApp(@Query('query') query: string): Promise<User[]> {
        return this.usersService.searchUsersApp(query);
    }

  @Get('countUser')
async getTotalUsers(
  @Query('userId') userId: string,
  @Query('role') role: string
): Promise<{ totalUsers: number }> {
  const totalUsers = await this.usersService.countTotalUsers(userId, role);
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
  async login(@Body() loginUserDto: LoginUserDto): Promise<any> {
    return this.usersService.loginUser(loginUserDto);
  }

  @Post('refreshToken')
  refreshToken(@Body() { refresh_token }): Promise<any> {
    console.log(refresh_token);
    return this.usersService.refreshToken(refresh_token);
  }

  // @Post('forgot-password')
  // async forgotPassword(@Body('email') email: string) {
  //   if (!email) {
  //     throw new BadRequestException('Email is required');
  //   }
  //   return this.usersService.handleForgotPassword(email);
  // }

  // @Post('reset-password')
  // async resetPassword(
  //   @Body('token') token: string,
  //   @Body('newPassword') newPassword: string,
  // ) {
  //   if (!token || !newPassword) {
  //     throw new BadRequestException('Token and new password are required');
  //   }
  //   return this.usersService.handleResetPassword(token, newPassword);
  // }

  // @Post('deposit')
  // async deposit(@Body() depositDto: DepositDto): Promise<User> {
  //   return this.usersService.deposit(depositDto);
  // }

  // @Post('callback')
  // async handleCallback(@Body() body: any) {
  //   const { userId, amount } = body;

  //   await this.usersService.updateBalance(userId, amount);

  //   return { message: 'Balance updated successfully' };
  // }
  

  // @Post('registerUser')
  // async register(
  //   @Body(new ValidationPipe()) createUserDto: CreateUserDto,
  // ): Promise<User> {
  //   return this.usersService.registerUser(createUserDto);
  // }

  // @Post('loginUser')
  // async login(@Body(new ValidationPipe()) loginUserDto: LoginUserDto): Promise<User> {
  //   return this.usersService.loginUser(loginUserDto);
  // }

  // @Post('refreshToken')
  // refreshToken(@Body() { refresh_token }): Promise<any> {
  //   console.log(refresh_token);
  //   return this.usersService.refreshToken(refresh_token);
  // }

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
