import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../order/entities/order.entity';
import { Product } from '../product/entities/product.entity';
import { Store } from './entities/store.entity';
import { StoreService } from './store.service';

describe('StoreService', () => {
  let service: StoreService;
  let storeRepository: Repository<Store>;
  let orderRepository: Repository<Order>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoreService,
        {
          provide: getRepositoryToken(Store),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Product),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Order),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<StoreService>(StoreService);
    storeRepository = module.get<Repository<Store>>(getRepositoryToken(Store));
    orderRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new store', async () => {
      const user = {id: 1, email: "test@example.com", displayName: "Test User", avatar: "png.img", role: "owner", phoneNumber: "123456789"
        ,password: "123", walletBalance: 10000, pin: 111111, created_at: null, update_at: null, isActive: true, order: [], bankTransfers: [],
        refresh_token: null, store: null}
      const storeData = {
        storeName: 'Sample Store',
        storeAddress: '123 Main St',
        storePhone: 1234567890,
        status: true,
        storeImage: ["Img.png"], // Updated to match `string[]` type
      };
  
      const savedStore = {
        storeId: 1,
        ...storeData,
        user: user,
        vouchers: [], // Default value for `vouchers`
        order: [], // Default value for `order`
      };
  
      jest.spyOn(storeRepository, 'save').mockResolvedValue(savedStore);
  
      const result = await service.create(storeData);
      expect(result).toEqual(savedStore);
    });
  });
  

  describe('findAll', () => {
    it('should return all stores with sales data', async () => {
      const mockStores = [
        { storeId: 1, storeName: 'Store 1', vouchers: [], user: null },
        { storeId: 2, storeName: 'Store 2', vouchers: [], user: null },
      ];
      jest.spyOn(storeRepository, 'find').mockResolvedValue(mockStores as Store[]);
      jest.spyOn(service, 'getSalesDataByStore').mockResolvedValue([10, 20, 30]);
      jest.spyOn(service, 'getSalesDataByStore1').mockResolvedValue([100, 200, 300]);

      const result = await service.findAll();
      expect(result).toHaveLength(2);
      expect(result[0].sales.data).toEqual([10, 20, 30]);
      expect(result[0].sales.data1).toEqual([100, 200, 300]);
    });
  });

  describe('findOne', () => {
    it('should return a store by id', async () => {
      const mockStore = { storeId: 1, storeName: 'Sample Store', user: null, vouchers: [] };

      jest.spyOn(storeRepository, 'findOne').mockResolvedValue(mockStore as Store);

      const result = await service.findOne(1);
      expect(result).toEqual(mockStore);
    });

    it('should throw NotFoundException if store is not found', async () => {
      jest.spyOn(storeRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStore', () => {
    it('should update a store', async () => {
      const mockStore = { storeId: 1, storeName: 'Sample Store' };
      const updateData = { storeName: 'Updated Store' };
      const updatedStore = { storeId: 1, storeName: 'Updated Store' };

      jest.spyOn(storeRepository, 'findOne').mockResolvedValue(mockStore as Store);
      jest.spyOn(storeRepository, 'update').mockResolvedValue(null);
      jest.spyOn(storeRepository, 'findOne').mockResolvedValue(updatedStore as Store);

      const result = await service.updateStore(updateData, 1);
      expect(result).toEqual(updatedStore);
    });
  });

  describe('remove', () => {
    it('should delete a store', async () => {
      const mockStore = { storeId: 1, storeName: 'Sample Store' };

      jest.spyOn(storeRepository, 'findOneBy').mockResolvedValue(mockStore as Store);
      jest.spyOn(storeRepository, 'remove').mockResolvedValue(undefined);

      await service.remove(1);
      expect(storeRepository.remove).toHaveBeenCalledWith(mockStore);
    });

    it('should throw NotFoundException if store is not found', async () => {
      jest.spyOn(storeRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getSalesDataByStore', () => {
    it('should return sales data for a store', async () => {
      jest.spyOn(service, 'getLast6Months').mockReturnValue([
        { month: 'Jan', year: 2023 },
        { month: 'Feb', year: 2023 },
      ]);
      jest.spyOn(orderRepository, 'createQueryBuilder').mockImplementation(() => ({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ count: 5 }),
      }) as any);

      const result = await service.getSalesDataByStore(1);
      expect(result).toEqual([5, 5]);
    });
  });
});
