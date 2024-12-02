import { Controller, Get, Param,Query } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
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

  @Get('search')
  async searchUsers(
    @Query('query') query: string,
    @Query('role') role: string,
  ): Promise<User[]> {
    return await this.usersService.searchUsers(query, role);
  }

}
