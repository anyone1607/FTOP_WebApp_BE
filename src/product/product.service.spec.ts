import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';

const mockProductRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('ProductService', () => {
  let productService: ProductService;
  let productRepository: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    productService = module.get<ProductService>(ProductService);
    productRepository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('should return all products', async () => {
    const products: Product[] = [
      {
        productId: 1,
        productName: 'Test Product',
        productPrice: 100.0,
        categoryId: 1,
        status: true,
        productImage: 'image.jpg',
        storeId: 1,
      },
    ];

    jest.spyOn(productRepository, 'find').mockResolvedValue(products);

    expect(await productService.getProducts()).toEqual(products);
  });

  it('should create a product', async () => {
    const productDto: Product = {
      productId: 0,
      productName: 'New Product',
      productPrice: 200.0,
      categoryId: 2,
      status: true,
      productImage: 'new_image.jpg',
      storeId: 1,
    };

    const savedProduct: Product = { productId: 1, ...productDto };

    jest.spyOn(productRepository, 'create').mockReturnValue(productDto);
    jest.spyOn(productRepository, 'save').mockResolvedValue(savedProduct);

    expect(await productService.createProduct(productDto)).toEqual(savedProduct);
  });
});