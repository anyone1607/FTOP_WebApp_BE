import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItem } from '../order-item/entities/orderItem.entity';
import { Store } from '../store/entities/store.entity';
import { Transaction } from '../transaction/entities/transaction.entity';
import { User } from '../user/entities/user.entity';
import { Voucher } from '../voucher/entities/voucher.entity';
import { Order } from './entities/order.entity';
import { OrderService } from './order.service';

describe('OrderService', () => {
  let service: OrderService;
  let orderRepository: Repository<Order>;
  let orderItemRepository: Repository<OrderItem>;
  let transactionRepository: Repository<Transaction>;
  let userRepository: Repository<User>;
  let storeRepository: Repository<Store>;
  let voucherRepository: Repository<Voucher>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(Order),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(OrderItem),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Transaction),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Store),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Voucher),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    orderRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
    orderItemRepository = module.get<Repository<OrderItem>>(getRepositoryToken(OrderItem));
    transactionRepository = module.get<Repository<Transaction>>(getRepositoryToken(Transaction));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    storeRepository = module.get<Repository<Store>>(getRepositoryToken(Store));
    voucherRepository = module.get<Repository<Voucher>>(getRepositoryToken(Voucher));
  });

  describe('createOrder', () => {
    it('should successfully create an order', async () => {
      const userId = 1;
      const storeId = 1;
      const voucherId = null;
      const note = 'Test Order';
      const totalPrice = 100;

      const user = { id: 1, displayName: 'John Doe' } as User;
      const store = { storeId: 1, storeName: 'Test Store' } as Store;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(storeRepository, 'findOne').mockResolvedValue(store);
      jest.spyOn(orderRepository, 'create').mockReturnValue({} as Order);
      jest.spyOn(orderRepository, 'save').mockResolvedValue({} as Order);

      const order = await service.createOrder(userId, storeId, voucherId, note, totalPrice);

      expect(order).toBeDefined();
      expect(order).toHaveProperty('user');
      expect(order).toHaveProperty('store');
      expect(order).toHaveProperty('orderStatus', true);
      expect(order).toHaveProperty('totalPrice', totalPrice);
    });

    it('should throw NotFoundException if user is not found', async () => {
      const userId = 1;
      const storeId = 1;
      const voucherId = null;
      const note = 'Test Order';
      const totalPrice = 100;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.createOrder(userId, storeId, voucherId, note, totalPrice))
        .rejects
        .toThrow(new NotFoundException(`User with ID ${userId} not found`));
    });

    it('should throw NotFoundException if store is not found', async () => {
      const userId = 1;
      const storeId = 1;
      const voucherId = null;
      const note = 'Test Order';
      const totalPrice = 100;

      const user = { id: 1, displayName: 'John Doe' } as User;
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(storeRepository, 'findOne').mockResolvedValue(null);

      await expect(service.createOrder(userId, storeId, voucherId, note, totalPrice))
        .rejects
        .toThrow(new NotFoundException(`Store with ID ${storeId} not found`));
    });
  });

  describe('findOne', () => {
    it('should return an order if found', async () => {
      const orderId = 1;
      const order = { orderId, totalPrice: 100, orderStatus: true } as Order;

      jest.spyOn(orderRepository, 'findOne').mockResolvedValue(order);

      const result = await service.findOne(orderId);
      expect(result).toEqual(order);
    });

    it('should throw NotFoundException if order is not found', async () => {
      const orderId = 1;

      jest.spyOn(orderRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(orderId))
        .rejects
        .toThrow(new NotFoundException(`Order with ID ${orderId} not found`));
    });
  });

  // Additional tests can be added for other methods like countTotalOrders, findAll, etc.
});
