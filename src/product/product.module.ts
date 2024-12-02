import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [TypeOrmModule.forFeature([Product]),
  JwtModule.register({
    secret: 'your-secret-key',
    signOptions: { expiresIn: '60s' },
  }),],
  controllers: [ProductController],
  providers: [ProductService]
})
export class ProductModule {}
