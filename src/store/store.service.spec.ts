import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './entities/store.entity';
import { StoreService } from './store.service';

describe('StoreService', () => {
  let storeService: StoreService;
  let storeRepository: Repository<Store>;

  const mockStoreRepository = {
    create: jest.fn((storeData) => ({ storeId: 1, ...storeData })),
    save: jest.fn((store) => Promise.resolve(store)),
    find: jest.fn().mockResolvedValue([{ storeId: 1, storeName: 'Test Store' }]),
    findOne: jest.fn((options) =>
      Promise.resolve(
        options.where.storeId === 1
          ? { storeId: 1, storeName: 'Test Store' }
          : null
      )
    ),
    preload: jest.fn((storeData) =>
      storeData.storeId === 1
        ? Promise.resolve({ ...storeData })
        : null
    ),
    remove: jest.fn(() => Promise.resolve()),
    createQueryBuilder: jest.fn(() => {
      return {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        addGroupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([
          { storeId: 1, storeName: 'Test Store', orderCount: 5 }
        ])
      };
    })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoreService,
        {
          provide: getRepositoryToken(Store),
          useValue: mockStoreRepository
        }
      ]
    }).compile();

    storeService = module.get<StoreService>(StoreService);
    storeRepository = module.get<Repository<Store>>(getRepositoryToken(Store));
  });

  it('should be defined', () => {
    expect(storeService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new store', async () => {
      const storeData = { storeName: 'New Store' };
      expect(await storeService.create(storeData)).toEqual({
        storeId: 1,
        ...storeData
      });
      expect(storeRepository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all stores', async () => {
      expect(await storeService.findAll()).toEqual([
        { storeId: 1, storeName: 'Test Store' }
      ]);
      expect(storeRepository.find).toHaveBeenCalledWith({ relations: ['vouchers'] });
    });
  });

  describe('findOne', () => {
    it('should return a store by id', async () => {
      const storeId = 1;
      expect(await storeService.findOne(storeId)).toEqual({
        storeId,
        storeName: 'Test Store'
      });
      expect(storeRepository.findOne).toHaveBeenCalledWith({
        where: { storeId },
        relations: ['vouchers']
      });
    });

    it('should throw an error if store not found', async () => {
      const storeId = 2;
      await expect(storeService.findOne(storeId)).rejects.toThrow(
        `Store with id ${storeId} not found`
      );
    });
  });

  describe('update', () => {
    it('should update a store by id', async () => {
      const storeId = 1;
      const storeData = { storeName: 'Updated Store' };
      expect(await storeService.update(storeId, storeData)).toEqual({
        storeId,
        ...storeData
      });
      expect(storeRepository.save).toHaveBeenCalled();
    });
  });
});