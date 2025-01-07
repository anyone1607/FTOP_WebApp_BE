import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from '../order-item/entities/orderItem.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { User } from '../user/entities/user.entity';
import { Store } from '../store/entities/store.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Order,OrderItem,Transaction, User, Store])],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
