import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { GoogleAuthGuard } from './utils/Guards';
import { RolesGuard } from './utils/role.guard';
import { Roles } from './utils/roles.decorator';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { UserDetails } from 'src/utils/types';


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
  constructor(
    private readonly jwtService: JwtService
  ) {}


  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  handleLogin() {
    return { msg: 'Google Authentication' };
  }

  @Get('google/redirect')
@UseGuards(GoogleAuthGuard)
async googleRedirect(@Req() req: Request, @Res() res: Response) {
  const user = req.user as UserDetails;
  const payload = { email: user.email, role: user.role };
  const token = this.jwtService.sign(payload);

  // Chuyển hướng đến frontend với token và thông tin người dùng
  const redirectUrl = `http://localhost:3000/auth/system/e-wallet?token=${token}&email=${user.email}&role=${user.role}&name=${user.displayName}`;
  return res.redirect(redirectUrl);
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

  // @UseGuards(GoogleAuthGuard)
  // @Get("google/login")
  // googleLogin(){

  // }


  // @UseGuards(GoogleAuthGuard)
  // @Get("google/callback")
  // googleCallback(@Req() req){


  // }
}