import { Module } from '@nestjs/common';
import { BanktransferService } from './banktransfer.service';
import { BanktransferController } from './banktransfer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankTransfer } from './entities/banktransfer.entity';
@Module({
  imports: [TypeOrmModule.forFeature([BankTransfer])],
  controllers: [BanktransferController],
  providers: [BanktransferService],
})
export class BanktransferModule {}
