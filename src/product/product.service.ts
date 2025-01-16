import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductDto } from '../dto/product.dto';
import { Product } from './entities/product.entity';
@Injectable()
export class ProductService {
    
    constructor(
      @InjectRepository(Product)
      private readonly productRepository: Repository<Product>
    ) {}
    async getProducts(userId: number, role: string): Promise<Product[]> {
      if (role === 'owner') {
        return this.productRepository.find({
          where: { isDeleted: false, store: { user: { id: userId } } },
          relations: ['category', 'store'],
        });
      } else {
        return this.productRepository.find({
          where: { isDeleted: false },
          relations: ['category', 'store'],
        });
      }
    }

    
    async createProduct(productDto: ProductDto): Promise<Product> {
      const product = this.productRepository.create(productDto);
      return await this.productRepository.save(product);
    }

    
    async detailProduct(id: number): Promise<Product> {
      return await this.productRepository.findOne({ where: { productId: id },
        relations: ['category', 'store'], });
    }


    async updateProduct(productDto: ProductDto, id: number): Promise<Product> {

      console.log("Product Data for Update:", productDto); // Log dữ liệu được gửi tới service
    
      //Chỉ cập nhật các trường có giá trị
      const updateData: Partial<ProductDto> = {};
      if (productDto.productName) updateData.productName = productDto.productName;
      if (productDto.productPrice) updateData.productPrice = productDto.productPrice;
      if (productDto.categoryId) updateData.categoryId = productDto.categoryId;
      if (productDto.storeId) updateData.storeId = productDto.storeId;
      if (productDto.productImage) updateData.productImage = productDto.productImage;
    
      console.log("Data to be updated in DB:", productDto); // Log dữ liệu trước khi cập nhật database
    
      await this.productRepository.update(id, productDto);
    
      const updatedProduct = await this.productRepository.findOne({ where: { productId: id } });
    
      console.log("Updated Product from DB:", updatedProduct); // Log kết quả sau khi lấy từ database
      return updatedProduct;
    }

    
    async deleteProduct(id: number): Promise<boolean> {
      const result = await this.productRepository.delete(id);
      return result.affected > 0;
    }
    async softDelete(id: number): Promise<void> {
      const product = await this.productRepository.findOne({ where: { productId: id }, relations: ['store'] });
      if (product) {
        product.isDeleted = true;
        product.deletedAt = new Date();
        await this.productRepository.save(product);
      }
    }

    // Get products by storeId (android)
    async getProductsByStoreId(storeId: number): Promise<Product[]> {
      return this.productRepository.find({
        where: { storeId },
      });
    }

    async filterProducts(filter?: string, categoryName?: string, storeName?: string, userId?: number, role?: string): Promise<Product[]> {
      const queryBuilder = this.productRepository.createQueryBuilder('product')
        .leftJoinAndSelect('product.category', 'category')
        .leftJoinAndSelect('product.store', 'store');
  
      if (filter) {
        queryBuilder.andWhere('product.productName LIKE :filter', { filter: `%${filter}%` });
      }
  
      if (categoryName) {
        queryBuilder.andWhere('category.categoryName = :categoryName', { categoryName });
      }
  
      if (storeName) {
        queryBuilder.andWhere('store.storeName = :storeName', { storeName });
      }
  
      if (role === 'store-owner') {
        queryBuilder.andWhere('store.userId = :userId', { userId });
      }
  
      const products = await queryBuilder.getMany();
      return products.map(product => ({
        ...product,
        categoryName: product.category?.categoryName,
        storeName: product.store?.storeName,
      }));
    }

    // // Get products by storeId (android)
    // async getProductsByStoreId(storeId: number): Promise<Product[]> {
    //   return this.productRepository.find({
    //     where: { storeId },
    //   });
    // }

}
