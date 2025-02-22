import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { BankTransfer } from '../banktransfer/entities/banktransfer.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([User, BankTransfer]),
    JwtModule.register({
      global: true,
      secret: 'refresh_token_secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}