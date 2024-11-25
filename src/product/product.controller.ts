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
import { UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as admin from 'firebase-admin';
import { extname } from 'path';
import { Readable } from 'stream';


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
@UseInterceptors(
  FileInterceptor('productImage', {
    storage: diskStorage({
      destination: './uploads/products',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      },
    }),
  }),
)
async createProduct(
  @Body(new ValidationPipe({ transform: true })) productDto: ProductDto,
  @UploadedFile() file: Express.Multer.File,
): Promise<ResponseData<Product>> {
    // Log dữ liệu từ body
    console.log("Request Body:", productDto);

    // Log file nhận được
    console.log("Uploaded File:", file);
  try {
    if (file) {
      productDto.productImage = `/uploads/products/${file.filename}`;
    }
    const createdProduct = await this.productService.createProduct(productDto);
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

  // @Put('/:id')
  // async updateProduct(
  //   @Body() productDto: ProductDto,
  //   @Param('id') id: number,
  // ): Promise<ResponseData<Product>> {
  //   try {
  //     const updatedProduct = await this.productService.updateProduct(
  //       productDto,
  //       id,
  //     );
  //     return new ResponseData<Product>(
  //       updatedProduct,
  //       HttpStatus.OK,
  //       HttpMessage.OK,
  //     );
  //   } catch (error) {
  //     console.error(error);
  //     return new ResponseData<Product>(
  //       null,
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //       HttpMessage.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }
  @Put('/:id')
@UseInterceptors(
  FileInterceptor('productImage', {
    storage: diskStorage({
      destination: './uploads/products',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      },
    }),
  }),
)
async updateProduct(
  @UploadedFile() file: Express.Multer.File,
  @Body(new ValidationPipe({ transform: true })) productDto: ProductDto,
  @Param('id') id: number,
): Promise<ResponseData<Product>> {
  // Log dữ liệu nhận được từ client
  console.log("Request Body:", productDto);
  console.log("Uploaded File:", file);

  try {
    if (file) {
      productDto.productImage = `/uploads/products/${file.filename}`;
    }

    const updatedProduct = await this.productService.updateProduct(productDto, id);

    console.log("Updated Product:", updatedProduct); // Log kết quả sau khi update

    return new ResponseData<Product>(
      updatedProduct,
      HttpStatus.OK,
      HttpMessage.OK,
    );
  } catch (error) {
    console.error("Error while updating product:", error);
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
