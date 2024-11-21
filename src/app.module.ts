import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/data-source';
import { UserModule } from './user/user.module';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { BanktransferModule } from './banktransfer/banktransfer.module';
// import { CategoryController } from './category/category.controller';
import { CategoryModule } from './category/category.module';
import { OrderModule } from './order/order.module';
import { OrderItemModule } from './order-item/order-item.module';
import { ProductModule } from './product/product.module';
import { ReviewController } from './review/review.controller';
import { ReviewModule } from './review/review.module';
import { StoreModule } from './store/store.module';
import { TransactionModule } from './transaction/transaction.module';
import { VoucherModule } from './voucher/voucher.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    UserModule,
    AuthModule,
    OrderModule,
    PassportModule.register({ session: true }),
    BanktransferModule,
    CategoryModule,
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
    ReviewController,
  ],
  providers: [AppService],
})
export class AppModule {}
