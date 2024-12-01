import { Test, TestingModule } from '@nestjs/testing';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';

describe('StoreController', () => {
  let storeController: StoreController;
  let storeService: StoreService;

  const mockStoreService = {
    create: jest.fn((storeData) => Promise.resolve({ storeId: 1, ...storeData })),
    findAll: jest.fn().mockResolvedValue([{ storeId: 1, storeName: 'Test Store' }]),
    findOne: jest.fn((id) =>
      Promise.resolve({ storeId: id, storeName: 'Test Store' }),
    ),
    update: jest.fn((id, storeData) =>
      Promise.resolve({ storeId: id, ...storeData }),
    ),
    remove: jest.fn((id) => Promise.resolve()),
    getOrderCountByStore: jest.fn().mockResolvedValue([
      { storeId: 1, storeName: 'Test Store', orderCount: 5 },
    ]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoreController],
      providers: [
        {
          provide: StoreService,
          useValue: mockStoreService,
        },
      ],
    }).compile();

    storeController = module.get<StoreController>(StoreController);
    storeService = module.get<StoreService>(StoreService);
  });

  it('should be defined', () => {
    expect(storeController).toBeDefined();
  });

  describe('create', () => {
    it('should create a new store', async () => {
      const storeData = { storeName: 'New Store' };
      expect(await storeController.create(storeData)).toEqual({
        storeId: 1,
        ...storeData,
      });
      expect(storeService.create).toHaveBeenCalledWith(storeData);
    });
  });

  describe('findAll', () => {
    it('should return all stores', async () => {
      expect(await storeController.findAll()).toEqual([
        { storeId: 1, storeName: 'Test Store' },
      ]);
      expect(storeService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a store by id', async () => {
      const storeId = 1;
      expect(await storeController.findOne(storeId)).toEqual({
        storeId,
        storeName: 'Test Store',
      });
      expect(storeService.findOne).toHaveBeenCalledWith(storeId);
    });
  });

  describe('update', () => {
    it('should update a store by id', async () => {
      const storeId = 1;
      const storeData = { storeName: 'Updated Store' };
      expect(await storeController.update(storeId, storeData)).toEqual({
        storeId,
        ...storeData,
      });
      expect(storeService.update).toHaveBeenCalledWith(storeId, storeData);
    });
  });

  describe('remove', () => {
    it('should delete a store by id', async () => {
      const storeId = 1;
      expect(await storeController.remove(storeId)).toBeUndefined();
      expect(storeService.remove).toHaveBeenCalledWith(storeId);
    });
  });

  describe('getOrderCountByStore', () => {
    it('should return order count by store', async () => {
      const filterType = 'day';
      const filterValue = '2024-12-01';
      expect(
        await storeController.getOrderCountByStore(filterType, filterValue),
      ).toEqual([
        { storeId: 1, storeName: 'Test Store', orderCount: 5 },
      ]);
      expect(storeService.getOrderCountByStore).toHaveBeenCalledWith(
        filterType,
        filterValue,
      );
    });
  });
});