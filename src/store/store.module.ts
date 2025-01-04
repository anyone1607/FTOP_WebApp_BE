import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { Product } from '../product/entities/product.entity';
import { Order } from '../order/entities/order.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Store, Product, Order])],
  providers: [StoreService],
  controllers: [StoreController],
})
export class StoreModule {}
