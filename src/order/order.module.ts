import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { User } from '../user/entities/user.entity';
import { Store } from '../store/entities/store.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Order, User, Store])],
  controllers: [OrderController],
  providers: [OrderService]
})
export class OrderModule {}
