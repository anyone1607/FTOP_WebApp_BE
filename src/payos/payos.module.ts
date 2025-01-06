import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayosService } from './payos.service';
import { PayosController } from './payos.controller';
import { BankTransfer } from '../banktransfer/entities/banktransfer.entity';
import { User } from '../user/entities/user.entity';
@Module({
  imports: [TypeOrmModule.forFeature([BankTransfer, User])],
  controllers: [PayosController],
  providers: [PayosService]
})
export class PayosModule {}
