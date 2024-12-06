import { Controller, Get, UseGuards, Req, Post } from '@nestjs/common';
import { GoogleAuthGuard } from './utils/Guards';
import { Request } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';
import * as CryptoJS from 'crypto-js';

@Controller('auth')
export class AuthController {

    @Get('google/login')
    @UseGuards(GoogleAuthGuard)
    handleLogin() {
       return { msg: 'Google Authentication' };
    }

    // api/auth/google/redirect
    @Get('google/redirect')
    @UseGuards(GoogleAuthGuard)
    handleRedirect() {
        return { msg: 'OK' };
    }

    @Get('status')
    user(@Req() request: Request) {
        console.log(request.user);
        if(request.user) {
            return { msg: 'Authenticated' }
        }else{
            return { msg: 'Not Authenticated' }
        }
    }

  @Post('deposit')
  @UseGuards(JwtAuthGuard)
  async deposit(@Req() req) {
    const userId = req.user.userId; // Lấy user_id từ request

    const deposit = {
      app_id: 'YOUR_APP_ID',
      app_trans_id: `${new Date().toISOString()}_${userId}`,
      app_user: userId,
      app_time: Date.now(),
      amount: 50000, // Số tiền nạp
      description: `Top-up by user #${userId}`,
      mac: '', // Sẽ được tính toán sau
    };

    const data =
      deposit.app_id +
      '|' +
      deposit.app_trans_id +
      '|' +
      deposit.app_user +
      '|' +
      deposit.amount +
      '|' +
      deposit.app_time;

    deposit.mac = CryptoJS.HmacSHA256(data, 'YOUR_SECRET_KEY').toString();

    // Trả về thông tin nạp tiền
    return deposit;
  }
}