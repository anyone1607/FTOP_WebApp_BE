import { Module } from '@nestjs/common';
import { BanktransferService } from './banktransfer.service';

@Module({
  providers: [BanktransferService]
})
export class BanktransferModule {}
