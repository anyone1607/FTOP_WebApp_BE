import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductDto } from 'src/dto/product.dto';
@Injectable()
export class ProductService {
    
    constructor(
      @InjectRepository(Product)
      private readonly productRepository: Repository<Product>
    ) {}
    async getProducts(): Promise<Product[]> {
        return await this.productRepository.find();
    }

    
    async createProduct(productDto: ProductDto): Promise<Product> {
      const product = this.productRepository.create(productDto);
      return await this.productRepository.save(product);
    }

    
    async detailProduct(id: number): Promise<Product> {
      return await this.productRepository.findOne({ where: { productId: id } });
    }

    
    async updateProduct(productDto: ProductDto, id: number): Promise<Product> {
      await this.productRepository.update(id, productDto);
      return await this.productRepository.findOne({ where: { productId: id } });
    }

    
    async deleteProduct(id: number): Promise<boolean> {
      const result = await this.productRepository.delete(id);
      return result.affected > 0;
    }

    // Get products by storeId (android)
    async getProductsByStoreId(storeId: number): Promise<Product[]> {
      return this.productRepository.find({
        where: { storeId },
      });
    }

}
