import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItem } from '../order-item/entities/orderItem.entity';
import { Order } from '../order/entities/order.entity';
import { Product } from '../product/entities/product.entity';
import { Store } from '../store/entities/store.entity';
import { User } from '../user/entities/user.entity';
import { Voucher } from '../voucher/entities/voucher.entity';
import { Transaction } from './entities/transaction.entity';
import { TransactionService } from './transaction.service';

describe('TransactionService', () => {
  let service: TransactionService;
  let transactionRepository: Repository<Transaction>;
  let userRepository: Repository<User>;
  let storeRepository: Repository<Store>;
  let orderRepository: Repository<Order>;
  let orderItemRepository: Repository<OrderItem>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
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
          provide: getRepositoryToken(Order),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(OrderItem),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Voucher),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Product),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    transactionRepository = module.get<Repository<Transaction>>(getRepositoryToken(Transaction));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    storeRepository = module.get<Repository<Store>>(getRepositoryToken(Store));
    orderRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
    orderItemRepository = module.get<Repository<OrderItem>>(getRepositoryToken(OrderItem));
  });

  describe('getTransactionSummary', () => {
    it('should return transaction summary for a user', async () => {
      const userId = 1;
      const transactions = [
        { receiveUserId: 1, transactionAmount: 100, transferUserId: 2 },
        { transferUserId: 1, transactionAmount: 50, receiveUserId: 2 },
      ];

      jest.spyOn(transactionRepository, 'createQueryBuilder').mockReturnValueOnce({
        where: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(transactions),
      } as any);

      const result = await service.getTransactionSummary(userId);

      expect(result).toEqual({
        income: 100,
        expense: 50,
        balance: 50,
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      const userId = 999;
      jest.spyOn(transactionRepository, 'createQueryBuilder').mockReturnValueOnce({
        where: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      } as any);

      await expect(service.getTransactionSummary(userId)).rejects.toThrowError(NotFoundException);
    });
  });

  describe('transferMoney', () => {
    it('should transfer money successfully', async () => {
      const transferUserId = 1;
      const receiveUserId = 2;
      const amount = 50;
      const description = 'Payment for order';

      const transferUser = { id: 1, walletBalance: 100 } as User;
      const receiveUser = { id: 2, walletBalance: 50 } as User;

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(transferUser).mockResolvedValueOnce(receiveUser);
      jest.spyOn(userRepository, 'save').mockResolvedValue(transferUser);

      const transaction = { transactionId: 1, transactionAmount: amount } as Transaction;

      jest.spyOn(transactionRepository, 'create').mockReturnValue(transaction);
      jest.spyOn(transactionRepository, 'save').mockResolvedValue(transaction);

      const result = await service.transferMoney(transferUserId, receiveUserId, amount, description);

      expect(result.transactionAmount).toBe(amount);
      expect(result.transactionDescription).toBe(description);
      expect(result.transferUserId).toBe(transferUserId);
      expect(result.receiveUserId).toBe(receiveUserId);
    });

    it('should throw BadRequestException if transferUser has insufficient balance', async () => {
      const transferUserId = 1;
      const receiveUserId = 2;
      const amount = 200;
      const description = 'Payment for order';

      const transferUser = { id: 1, walletBalance: 100 } as User;
      const receiveUser = { id: 2, walletBalance: 50 } as User;

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(transferUser).mockResolvedValueOnce(receiveUser);

      await expect(service.transferMoney(transferUserId, receiveUserId, amount, description))
        .rejects
        .toThrowError(BadRequestException);
    });

    it('should throw NotFoundException if transferUser is not found', async () => {
      const transferUserId = 1;
      const receiveUserId = 2;
      const amount = 50;
      const description = 'Payment for order';

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.transferMoney(transferUserId, receiveUserId, amount, description))
        .rejects
        .toThrowError(NotFoundException);
    });
  });

  /*
  describe('placeOrderWithTransaction', () => {
    it('should place order with transaction successfully', async () => {
      const userId = 1;
      const storeId = 1;
      const voucherId = null;
      const items = [{ productId: 1, quantity: 2, unitPrice: 50 }];
      const note = 'Test order';
      const totalPrice = 100;

      const user = { id: 1, walletBalance: 200 };
      const store = { storeId: 1, user: { id: 1, walletBalance: 500 } };
      const product = { productId: 1, name: 'Product 1' };

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(user);
      jest.spyOn(storeRepository, 'findOne').mockResolvedValueOnce(store);
      jest.spyOn(orderRepository, 'create').mockReturnValueOnce({});
      jest.spyOn(orderRepository, 'save').mockResolvedValueOnce({});
      jest.spyOn(orderItemRepository, 'create').mockReturnValueOnce({});
      jest.spyOn(orderItemRepository, 'save').mockResolvedValueOnce({});
      jest.spyOn(transactionRepository, 'create').mockReturnValueOnce({});
      jest.spyOn(transactionRepository, 'save').mockResolvedValueOnce({});

      const result = await service.placeOrderWithTransaction(userId, storeId, voucherId, items, note, totalPrice);

      expect(result.message).toBe('Order and transaction processed successfully');
    });
*/
    it('should throw NotFoundException if user or store not found', async () => {
      const userId = 1;
      const storeId = 999;
      const voucherId = null;
      const items = [{ productId: 1, quantity: 2, unitPrice: 50 }];
      const note = 'Test order';
      const totalPrice = 100;

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.placeOrderWithTransaction(userId, storeId, voucherId, items, note, totalPrice))
        .rejects
        .toThrowError(NotFoundException);
    });
  });

