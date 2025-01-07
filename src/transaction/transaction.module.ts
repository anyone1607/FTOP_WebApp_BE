import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { Transaction } from './entities/transaction.entity';
import { Order } from '../order/entities/order.entity';
import { OrderItem } from '../order-item/entities/orderItem.entity';
import { Product } from '../product/entities/product.entity';
import { User } from '../user/entities/user.entity';
import { Store } from '../store/entities/store.entity';
import { Voucher } from '../voucher/entities/voucher.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Transaction,
      Order,
      OrderItem,
      Product,
      User,
      Store, // Import StoreRepository qua Store entity
      Voucher,
    ]),
  ],
  providers: [TransactionService],
  controllers: [TransactionController],
  exports: [TransactionService],
})
export class TransactionModule {}
