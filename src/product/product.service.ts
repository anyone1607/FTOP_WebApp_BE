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

    
    // async updateProduct(productDto: ProductDto, id: number): Promise<Product> {
    //   await this.productRepository.update(id, productDto);
    //   return await this.productRepository.findOne({ where: { productId: id } });
    // }
    async updateProduct(productDto: ProductDto, id: number): Promise<Product> {
      console.log("Product Data for Update:", productDto); // Log dữ liệu được gửi tới service
    
      // Chỉ cập nhật các trường có giá trị
      const updateData: Partial<ProductDto> = {};
      if (productDto.productName) updateData.productName = productDto.productName;
      if (productDto.productPrice) updateData.productPrice = productDto.productPrice;
      if (productDto.categoryId) updateData.categoryId = productDto.categoryId;
      if (productDto.storeId) updateData.storeId = productDto.storeId;
      if (productDto.productImage) updateData.productImage = productDto.productImage;
    
      console.log("Data to be updated in DB:", updateData); // Log dữ liệu trước khi cập nhật database
    
      await this.productRepository.update(id, updateData);
    
      const updatedProduct = await this.productRepository.findOne({ where: { productId: id } });
    
      console.log("Updated Product from DB:", updatedProduct); // Log kết quả sau khi lấy từ database
      return updatedProduct;
    }
    
    async deleteProduct(id: number): Promise<boolean> {
      const result = await this.productRepository.delete(id);
      return result.affected > 0;
    }
}
