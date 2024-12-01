import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderService } from './order.service';

describe('OrderService', () => {
  let service: OrderService;
  let repository: Repository<Order>;

  const mockOrder: Order = {
    orderId: 1,
    user: null,
    store: null,
    orderStatus: true,
    orderDate: new Date(),
    voucher: null,
    note: 'Sample Note',
    totalPrice: 100,
    isDeleted: false,
  };

  const mockRepository = {
    count: jest.fn().mockResolvedValue(10),
    createQueryBuilder: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getRawOne: jest.fn().mockResolvedValue({ totalPrice: '1000' }),
      getRawMany: jest.fn().mockResolvedValue([]),
    }),
    find: jest.fn().mockResolvedValue([mockOrder]),
    findOne: jest.fn().mockResolvedValue(mockOrder),
    save: jest.fn().mockResolvedValue(mockOrder),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    repository = module.get<Repository<Order>>(getRepositoryToken(Order));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should count total orders', async () => {
    const result = await service.countTotalOrders();
    expect(result).toBe(10);
    expect(repository.count).toHaveBeenCalledWith({ where: { orderStatus: true } });
  });

  it('should calculate total price of orders', async () => {
    const result = await service.countTotalPriceOrder();
    expect(result).toBe(1000);
    expect(repository.createQueryBuilder).toHaveBeenCalled();
  });

  it('should find all orders', async () => {
    const result = await service.findAll();
    expect(result).toEqual([mockOrder]);
    expect(repository.find).toHaveBeenCalledWith({
      where: { isDeleted: false },
      relations: ['user', 'store', 'voucher'],
    });
  });

  it('should find one order by ID', async () => {
    const result = await service.findOne(1);
    expect(result).toEqual(mockOrder);
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { orderId: 1 },
      relations: ['user', 'store', 'voucher'],
    });
  });

  it('should soft delete an order', async () => {
    const result = await service.softDelete(1);
    expect(result).toEqual('Order with ID 1 has been soft deleted');
    expect(repository.save).toHaveBeenCalledWith({ ...mockOrder, isDeleted: true });
  });
});
