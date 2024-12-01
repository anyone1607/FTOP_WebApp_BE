import { Test, TestingModule } from '@nestjs/testing';
import { OrderItemController } from './order-item.controller';
import { OrderItemService } from './order-item.service';

const mockSalesData = [
  { productId: 1, totalSold: 100 },
  { productId: 2, totalSold: 50 },
];

const mockProduct = { productId: 1, name: 'Sample Product' };

const mockOrderItemService = {
  getProductsBySales: jest.fn().mockResolvedValue(
    mockSalesData.map((item) => ({
      product: { productId: item.productId, name: `Product ${item.productId}` },
      totalSold: item.totalSold,
    }))
  ),
};

describe('OrderItemController', () => {
  let controller: OrderItemController;
  let service: OrderItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderItemController],
      providers: [
        {
          provide: OrderItemService,
          useValue: mockOrderItemService,
        },
      ],
    }).compile();

    controller = module.get<OrderItemController>(OrderItemController);
    service = module.get<OrderItemService>(OrderItemService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return products by sales', async () => {
    const result = await controller.getProductsBySales();
    expect(result).toEqual(
      mockSalesData.map((item) => ({
        product: { productId: item.productId, name: `Product ${item.productId}` },
        totalSold: item.totalSold,
      }))
    );
    expect(service.getProductsBySales).toHaveBeenCalled();
  });
});