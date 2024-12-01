import { Test, TestingModule } from '@nestjs/testing';
import { ProductDto } from 'src/dto/product.dto';
import { ResponseData } from '../global/globalClass';
import { HttpMessage, HttpStatus } from '../global/globalEnum';
import { Product } from './entities/product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

describe('ProductController', () => {
  let productController: ProductController;
  let productService: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            getProducts: jest.fn(),
            createProduct: jest.fn(),
            detailProduct: jest.fn(),
            updateProduct: jest.fn(),
            deleteProduct: jest.fn(),
          },
        },
      ],
    }).compile();

    productController = module.get<ProductController>(ProductController);
    productService = module.get<ProductService>(ProductService);
  });

  it('should return all products', async () => {
    const products: Product[] = [{
      productId: 1,
      productName: 'Test Product',
      productPrice: 100.0,
      categoryId: 1,
      status: true,
      productImage: 'image.jpg',
      storeId: 1,
    }];

    jest.spyOn(productService, 'getProducts').mockResolvedValue(products);

    expect(await productController.getProducts()).toEqual(
      new ResponseData(products, HttpStatus.OK, HttpMessage.OK),
    );
  });

  it('should create a product', async () => {
    const productDto: ProductDto = {
      productName: 'New Product',
      productPrice: 200.0,
      categoryId: 2,
      status: true,
      productImage: 'new_image.jpg',
      storeId: 1,
    };

    const createdProduct: Product = {
      productId: 2,
      ...productDto,
    };

    jest.spyOn(productService, 'createProduct').mockResolvedValue(createdProduct);

    expect(await productController.createProduct(productDto)).toEqual(
      new ResponseData(createdProduct, HttpStatus.OK, HttpMessage.OK),
    );
  });
});