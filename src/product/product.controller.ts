import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  ValidationPipe,
  UseGuards,
  Query
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { Product } from './entities/product.entity';
import { ProductDto } from 'src/dto/product.dto';
import { UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { RolesGuard } from 'src/auth/utils/role.guard';
import { Roles } from 'src/auth/utils/roles.decorator';

@UseGuards(RolesGuard)
@Roles('admin', 'manager') // Chỉ cho phép admin và manager truy cập
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getProducts(
    @Query('userId') userId: number,
    @Query('role') role: string,
  ): Promise<ResponseData<Product[]>> {
    try {
      const products = await this.productService.getProducts(userId, role);
      const responseProducts = products.map(product => ({
        ...product,
        categoryName: product.category?.categoryName,
        storeName: product.store?.storeName,
      }));
      return new ResponseData<Product[]>(
        responseProducts,
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

  // @Get('filter')
  // async filterProducts(
  //   @Query('filter') filter: string,
  //   @Query('categoryName') categoryName: string,
  //   @Query('storeName') storeName: string,
  // ): Promise<ResponseData<Product[]>> {
  //   try {
  //     const products = await this.productService.filterProducts(filter, categoryName, storeName);
  //     return new ResponseData<Product[]>(products, HttpStatus.OK, HttpMessage.OK);
  //   } catch (error) {
  //     console.error(error);
  //     return new ResponseData<Product[]>(null, HttpStatus.INTERNAL_SERVER_ERROR, HttpMessage.INTERNAL_SERVER_ERROR);
  //   }
  // }
  @Get('filter')
  async filterProducts(
    @Query('filter') filter: string,
    @Query('categoryName') categoryName: string,
    @Query('storeName') storeName: string,
    @Query('userId') userId: number,
    @Query('role') role: string,
  ): Promise<ResponseData<Product[]>> {
    try {
      const products = await this.productService.filterProducts(filter, categoryName, storeName, userId, role);
      return new ResponseData<Product[]>(products, HttpStatus.OK, HttpMessage.OK);
    } catch (error) {
      console.error(error);
      return new ResponseData<Product[]>(null, HttpStatus.INTERNAL_SERVER_ERROR, HttpMessage.INTERNAL_SERVER_ERROR);
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
