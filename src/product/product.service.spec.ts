import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductDto } from '../dto/product.dto';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';

const mockProduct = {
  productId: 1,
  productName: 'Sample Product',
  productPrice: 100,
  categoryId: 1,
  storeId: 1,
  status: true,
  productImage: 'sample.jpg',
  isDeleted: false,
  deletedAt: null,
  category: { categoryName: 'Sample Category' },
  store: { storeName: 'Sample Store' },
};

const mockProductRepository = {
  find: jest.fn(() => Promise.resolve([mockProduct])),
  findOne: jest.fn((criteria) => {
    if (criteria.where?.productId === mockProduct.productId) {
      return Promise.resolve(mockProduct);
    }
    return Promise.resolve(null);
  }),
  create: jest.fn((productDto) => ({ ...productDto })),
  save: jest.fn((product) => Promise.resolve({ ...product, productId: 2 })),
  update: jest.fn(() => Promise.resolve()),
  delete: jest.fn(() => Promise.resolve({ affected: 1 })),
  createQueryBuilder: jest.fn()
};

describe('ProductService', () => {
  let service: ProductService;
  let repository: Repository<Product>;

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

    service = module.get<ProductService>(ProductService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProducts', () => {
    it('should return products for a store owner', async () => {
      const products = await service.getProducts(1, 'owner');
      expect(mockProductRepository.find).toHaveBeenCalledWith({
        where: { isDeleted: false, store: { user: { id: 1 } } },
        relations: ['category', 'store'],
      });
      expect(products).toEqual([mockProduct]);
    });

    it('should return products for a non-owner', async () => {
      const products = await service.getProducts(1, 'customer');
      expect(mockProductRepository.find).toHaveBeenCalledWith({
        where: { isDeleted: false },
        relations: ['category', 'store'],
      });
      expect(products).toEqual([mockProduct]);
    });
  });

  describe('createProduct', () => {
    it('should create and return a new product', async () => {
      const productDto: ProductDto = {
        productName: 'New Product',
        productPrice: 200,
        categoryId: 2,
        storeId: 1,
        productImage: 'new.jpg',
      };

      const newProduct = await service.createProduct(productDto);
      expect(mockProductRepository.create).toHaveBeenCalledWith(productDto);
      expect(mockProductRepository.save).toHaveBeenCalledWith({ ...productDto });
      expect(newProduct).toEqual({ ...productDto, productId: 2 });
    });

    it('should create and return a new product null name', async () => {
      const productDto: ProductDto = {
        productName: null,
        productPrice: null,
        categoryId: null,
        storeId: null,
        productImage: null,
      };

      const newProduct = await service.createProduct(productDto);
      expect(mockProductRepository.create).toHaveBeenCalledWith(productDto);
      expect(mockProductRepository.save).toHaveBeenCalledWith({ ...productDto });
      expect(newProduct).toEqual({ ...productDto, productId: 2 });
    });
  });

  describe('detailProduct', () => {
    it('should return product details', async () => {
      const product = await service.detailProduct(1);
      expect(mockProductRepository.findOne).toHaveBeenCalledWith({
        where: { productId: 1 },
        relations: ['category', 'store'],
      });
      expect(product).toEqual(mockProduct);
    });
  });

  describe('updateProduct', () => {
    it('should update and return the updated product', async () => {
      const productDto: ProductDto = { productName: 'Updated Product' };
      const updatedProduct = await service.updateProduct(productDto, 1);

      expect(mockProductRepository.update).toHaveBeenCalledWith(1, productDto);
      expect(mockProductRepository.findOne).toHaveBeenCalledWith({ where: { productId: 1 } });
      expect(updatedProduct).toEqual(mockProduct);
    });

  });

  describe('deleteProduct', () => {
    it('should delete the product and return true if successful', async () => {
      const result = await service.deleteProduct(1);
      expect(mockProductRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toBe(true);
    });

    it('should return false if no product was deleted', async () => {
      mockProductRepository.delete.mockResolvedValueOnce({ affected: 0 });
      const result = await service.deleteProduct(1);
      expect(mockProductRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toBe(false);
    });
  });

  describe('softDelete', () => {
    it('should soft delete a product', async () => {
      await service.softDelete(1);
      expect(mockProductRepository.findOne).toHaveBeenCalledWith({
        where: { productId: 1 },
        relations: ['store'],
      });
      expect(mockProductRepository.save).toHaveBeenCalledWith({
        ...mockProduct,
        isDeleted: true,
        deletedAt: expect.any(Date),
      });
    });
  });

  describe('getProductsByStoreId', () => {
    it('should return products by store ID', async () => {
      const products = await service.getProductsByStoreId(1);
      expect(mockProductRepository.find).toHaveBeenCalledWith({ where: { storeId: 1 } });
      expect(products).toEqual([mockProduct]);
    });
  });

  describe('filterProducts', () => {
    it('should filter products based on criteria', async () => {
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([
          {
            productName: 'Test Product',
            category: { categoryName: 'Test Category' },
            store: { storeName: 'Test Store' },
          },
        ]),
      };

      mockProductRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const filter = 'Test';
      const categoryName = 'Test Category';
      const storeName = 'Test Store';
      const userId = 1;
      const role = 'store-owner';

      const result = await service.filterProducts(filter, categoryName, storeName, userId, role);

      expect(mockProductRepository.createQueryBuilder).toHaveBeenCalledWith('product');
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledTimes(2);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('product.productName LIKE :filter', { filter: `%${filter}%` });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('category.categoryName = :categoryName', { categoryName });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('store.storeName = :storeName', { storeName });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('store.userId = :userId', { userId });
      expect(mockQueryBuilder.getMany).toHaveBeenCalled();
      expect(result).toEqual([
        {
          productName: 'Test Product',
          categoryName: 'Test Category',
          storeName: 'Test Store',
          category: { categoryName: 'Test Category' },
          store: { storeName: 'Test Store' },
        },
      ]);
    });
  });
});