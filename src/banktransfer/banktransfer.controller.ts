import { Controller, Get, Param, Post, UseGuards, Req } from '@nestjs/common';
import { BanktransferService } from './banktransfer.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import * as CryptoJS from 'crypto-js';

@Controller('banktransfer')
export class BanktransferController {
  constructor(private readonly bankTransferService: BanktransferService) {}

  @Get(':walletUserId')
  async getBankTransferInfo(@Param('walletUserId') walletUserId: number) {
    return this.bankTransferService.getBankTransferInfo(walletUserId);
  }

  @Get(':walletUserId')
  async getBankTransfersByUserId(@Param('walletUserId') walletUserId: number) {
    return this.bankTransferService.findTransfersByUserId(walletUserId);
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
