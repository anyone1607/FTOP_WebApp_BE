import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { Product } from './entities/product.entity';
import { ProductDto } from 'src/dto/product.dto';
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getProducts(): Promise<ResponseData<Product[]>> {
    try {
      const products = await this.productService.getProducts();
      return new ResponseData<Product[]>(
        products,
        HttpStatus.OK,
        HttpMessage.OK,
      );
    } catch (error) {
      console.log(error);
      return new ResponseData<Product[]>(
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpMessage.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  async createProduct(
    @Body(new ValidationPipe()) productDto: ProductDto,
  ): Promise<ResponseData<ProductDto>> {
    try {
      const createdProduct =
        await this.productService.createProduct(productDto);
      return new ResponseData<Product>(
        createdProduct,
        HttpStatus.OK,
        HttpMessage.OK,
      );
    } catch (error) {
      console.error(error);
      return new ResponseData<Product>(
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpMessage.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/:id')
  async detailProduct(@Param('id') id: number): Promise<ResponseData<Product>> {
    try {
      const product = await this.productService.detailProduct(id);
      return new ResponseData<Product>(product, HttpStatus.OK, HttpMessage.OK);
    } catch (error) {
      console.error(error);
      return new ResponseData<Product>(
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpMessage.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('/:id')
  async updateProduct(
    @Body() productDto: ProductDto,
    @Param('id') id: number,
  ): Promise<ResponseData<Product>> {
    try {
      const updatedProduct = await this.productService.updateProduct(
        productDto,
        id,
      );
      return new ResponseData<Product>(
        updatedProduct,
        HttpStatus.OK,
        HttpMessage.OK,
      );
    } catch (error) {
      console.error(error);
      return new ResponseData<Product>(
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpMessage.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('/:id')
  async deleteProduct(@Param('id') id: number): Promise<ResponseData<boolean>> {
    try {
      const isDeleted = await this.productService.deleteProduct(id);
      return new ResponseData<boolean>(
        isDeleted,
        HttpStatus.OK,
        HttpMessage.OK,
      );
    } catch (error) {
      console.error(error);
      return new ResponseData<boolean>(
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpMessage.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
