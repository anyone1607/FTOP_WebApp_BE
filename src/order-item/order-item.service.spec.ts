import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItem } from './entities/orderItem.entity';
import { OrderItemService } from './order-item.service';

describe('OrderItemService', () => {
  let service: OrderItemService;
  let repository: Repository<OrderItem>;

  const mockSalesData = [
    { productId: 1, totalSold: 100 },
    { productId: 2, totalSold: 50 },
  ];

  const mockRepository = {
    createQueryBuilder: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue(mockSalesData),
    }),
    findOne: jest.fn().mockImplementation(({ where: { productId } }) => {
      return { productId, name: `Product ${productId}` };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderItemService,
        {
          provide: getRepositoryToken(OrderItem),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<OrderItemService>(OrderItemService);
    repository = module.get<Repository<OrderItem>>(getRepositoryToken(OrderItem));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return products by sales', async () => {
    const result = await service.getProductsBySales();

    expect(result).toEqual(
      mockSalesData.map((item) => ({
        product: { productId: item.productId, name: `Product ${item.productId}` },
        totalSold: item.totalSold,
      }))
    );

    expect(repository.createQueryBuilder).toHaveBeenCalled();
    expect(repository.findOne).toHaveBeenCalledTimes(mockSalesData.length);
  });
});