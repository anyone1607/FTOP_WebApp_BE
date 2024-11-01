import { Controller, Get } from '@nestjs/common';

@Controller('user')
export class UserController {
    @Get()
    getAllUsers() {
    return [
      { id: 1, name: 'User 1' },
      { id: 2, name: 'User 2' },
    ];
  }
}
