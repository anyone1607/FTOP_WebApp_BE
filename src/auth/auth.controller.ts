import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { GoogleAuthGuard } from './utils/Guards';
import { Request } from 'express';
import { RolesGuard } from './utils/role.guard';
import { Roles } from './utils/roles.decorator';

// @Controller('auth')
// export class AuthController {

//     @Get('google/login')
//     @UseGuards(GoogleAuthGuard)
//     handleLogin() {
//        return { msg: 'Google Authentication' };
//     }

//     // api/auth/google/redirect
//     @Get('google/redirect')
//     @UseGuards(GoogleAuthGuard)
//     handleRedirect() {
//         return { msg: 'OK' };
//     }

//     @Get('status')
//     user(@Req() request: Request) {
//         console.log(request.user);
//         if(request.user) {
//             return { msg: 'Authenticated' }
//         }else{
//             return { msg: 'Not Authenticated' }
//         }
//     }
// }

@Controller('auth')
export class AuthController {
  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  handleLogin() {
    return { msg: 'Google Authentication' };
  }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  handleRedirect() {
    return { msg: 'OK' };
  }

  @Get('status')
  user(@Req() request: Request) {
    console.log(request.user);
    if (request.user) {
      return { msg: 'Authenticated', user: request.user };
    } else {
      return { msg: 'Not Authenticated' };
    }
  }

  // Bảo vệ route chỉ cho phép admin truy cập
  @Get('admin')
  @UseGuards(GoogleAuthGuard, RolesGuard)
  @Roles('admin')
  adminEndpoint() {
    return { msg: 'Welcome Admin' };
  }

  // Bảo vệ route chỉ cho phép manager truy cập
  @Get('manager')
  @UseGuards(GoogleAuthGuard, RolesGuard)
  @Roles('manager')
  managerEndpoint() {
    return { msg: 'Welcome Manager' };
  }
}
