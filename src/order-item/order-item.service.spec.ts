import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../order/entities/order.entity';
import { Product } from '../product/entities/product.entity';
import { OrderItem } from './entities/orderItem.entity';
import { OrderItemService } from './order-item.service';

describe('OrderItemService', () => {
  let service: OrderItemService;
  let repository: Repository<OrderItem>;

  const mockOrderItemRepository = {
    createQueryBuilder: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    innerJoin: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getRawMany: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockOrder = new Order();
  mockOrder.orderId = 1;

  const mockProduct = new Product();
  mockProduct.productId = 1;
  mockProduct.productName = 'Test Product';

  const mockOrderItem = new OrderItem();
  mockOrderItem.orderItemId = 1;
  mockOrderItem.orderId = 1;
  mockOrderItem.productId = 1;
  mockOrderItem.quantity = 5;
  mockOrderItem.unitPrice = 10;
  mockOrderItem.order = mockOrder;
  mockOrderItem.product = mockProduct;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderItemService,
        {
          provide: getRepositoryToken(OrderItem),
          useValue: mockOrderItemRepository,
        },
      ],
    }).compile();

    service = module.get<OrderItemService>(OrderItemService);
    repository = module.get<Repository<OrderItem>>(getRepositoryToken(OrderItem));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProductsBySales', () => {
    it('should return products by sales when role is owner', async () => {
      const mockSalesData = [
        { productId: 1, totalSold: 10 },
      ];

      mockOrderItemRepository.getRawMany.mockResolvedValue(mockSalesData);
      mockOrderItemRepository.findOne.mockResolvedValue(mockOrderItem);

      const result = await service.getProductsBySales('1', 'owner');
      expect(result).toEqual([
        {
          product: mockProduct,
          totalSold: 10,
        },
      ]);
      expect(mockOrderItemRepository.getRawMany).toHaveBeenCalled();
      expect(mockOrderItemRepository.findOne).toHaveBeenCalledWith({
        where: { productId: 1 },
      });
    });

    it('should return products by sales when role is not owner', async () => {
      const mockSalesData = [
        { productId: 1, totalSold: 10 },
      ];

      mockOrderItemRepository.getRawMany.mockResolvedValue(mockSalesData);
      mockOrderItemRepository.findOne.mockResolvedValue(mockOrderItem);

      const result = await service.getProductsBySales('1', 'customer');
      expect(result).toEqual([
        {
          product: mockProduct,
          totalSold: 10,
        },
      ]);
      expect(mockOrderItemRepository.getRawMany).toHaveBeenCalled();
      expect(mockOrderItemRepository.findOne).toHaveBeenCalledWith({
        where: { productId: 1 },
      });
    });
  });

  describe('createOrderItems', () => {
    it('should create and save order items successfully', async () => {
      const products = [
        { productId: 1, quantity: 5, price: 10 },
      ];

      mockOrderItemRepository.create.mockReturnValue(mockOrderItem);
      mockOrderItemRepository.save.mockResolvedValue(mockOrderItem);

      const result = await service.createOrderItems(1, products);
      expect(result).toEqual([mockOrderItem]);
      expect(mockOrderItemRepository.create).toHaveBeenCalledWith({
        orderId: 1,
        productId: 1,
        quantity: 5,
        unitPrice: 10,
      });
      expect(mockOrderItemRepository.save).toHaveBeenCalledWith(mockOrderItem);
    });
  });
});
