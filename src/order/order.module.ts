import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from '../order-item/entities/orderItem.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Order,OrderItem,Transaction])],
  controllers: [OrderController],
  providers: [OrderService]
})
export class OrderModule {}
