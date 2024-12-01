import { Test, TestingModule } from '@nestjs/testing';
import { Order } from './entities/order.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

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

const mockOrderService = {
  countTotalOrders: jest.fn().mockResolvedValue(10),
  countTotalPriceOrder: jest.fn().mockResolvedValue(1000),
  findAll: jest.fn().mockResolvedValue([mockOrder]),
  findOne: jest.fn().mockResolvedValue(mockOrder),
  findDeleted: jest.fn().mockResolvedValue([mockOrder]),
  findByStoreId: jest.fn().mockResolvedValue([mockOrder]),
  softDelete: jest.fn().mockResolvedValue('Order with ID 1 has been soft deleted'),
};

describe('OrderController', () => {
  let controller: OrderController;
  let service: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return total orders count', async () => {
    const result = await controller.countTotalOrders();
    expect(result).toEqual({ totalOrders: 10 });
    expect(service.countTotalOrders).toHaveBeenCalled();
  });

  it('should return total price of orders', async () => {
    const result = await controller.countTotalPriceOrder();
    expect(result).toEqual({ totalPrice: 1000 });
    expect(service.countTotalPriceOrder).toHaveBeenCalled();
  });

  it('should return all orders', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([mockOrder]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a single order by ID', async () => {
    const result = await controller.findOne(1);
    expect(result).toEqual(mockOrder);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('should return soft-deleted orders', async () => {
    const result = await controller.getDeletedOrders();
    expect(result).toEqual([mockOrder]);
    expect(service.findDeleted).toHaveBeenCalled();
  });

  it('should soft delete an order', async () => {
    const result = await controller.softDeleteOrder(1);
    expect(result).toEqual('Order with ID 1 has been soft deleted');
    expect(service.softDelete).toHaveBeenCalledWith(1);
  });
});