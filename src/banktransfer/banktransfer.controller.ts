import { Controller, Get, Param } from '@nestjs/common';
import { BanktransferService } from './banktransfer.service';

@Controller('banktransfer')
export class BanktransferController {
  constructor(private readonly bankTransferService: BanktransferService) {}

  @Get('info/:walletUserId')
  async getBankTransferInfo(@Param('walletUserId') walletUserId: number) {
    return this.bankTransferService.getBankTransferInfo(walletUserId);
  }

  @Get('transfers/:walletUserId')
  async getBankTransfersByUserId(@Param('walletUserId') walletUserId: number) {
    return this.bankTransferService.findTransfersByUserId(walletUserId);
  } 
  
}
