import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/data-source';
import { UserModule } from './user/user.module';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { BanktransferController } from './banktransfer/banktransfer.controller';
import { BanktransferModule } from './banktransfer/banktransfer.module';
import { CategoryController } from './category/category.controller';
import { CategoryModule } from './category/category.module';
import { OrderController } from './order/order.controller';
import { OrderModule } from './order/order.module';
import { OrderItemController } from './order-item/order-item.controller';
import { OrderItemModule } from './order-item/order-item.module';
import { ProductController } from './product/product.controller';
import { ProductModule } from './product/product.module';
import { ReviewController } from './review/review.controller';
import { ReviewModule } from './review/review.module';
import { StoreController } from './store/store.controller';
import { StoreModule } from './store/store.module';
import { TransactionController } from './transaction/transaction.controller';
import { TransactionModule } from './transaction/transaction.module';
import { VoucherController } from './voucher/voucher.controller';
import { VoucherModule } from './voucher/voucher.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    UserModule,
    AuthModule,
    PassportModule.register({ session: true }),
    BanktransferModule,
    CategoryModule,
    OrderModule,
    OrderItemModule,
    ProductModule,
    ReviewModule,
    StoreModule,
    TransactionModule,
    VoucherModule,
  ],
  controllers: [
    AppController,
    AuthController,
    BanktransferController,
    CategoryController,
    OrderController,
    OrderItemController,
    ProductController,
    ReviewController,
    StoreController,
    TransactionController,
    VoucherController,
  ],
  providers: [AppService],
})
export class AppModule {}
