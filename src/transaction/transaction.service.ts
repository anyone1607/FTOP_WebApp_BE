import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, EntityManager } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Store } from '../store/entities/store.entity';
import { Voucher } from '../voucher/entities/voucher.entity';
import { Product } from '../product/entities/product.entity';
import { Order } from '../order/entities/order.entity';
import { OrderItem } from '../order-item/entities/orderItem.entity';
import { Transaction } from './entities/transaction.entity';
@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,

    @InjectRepository(Voucher)
    private readonly voucherRepository: Repository<Voucher>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,

    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async countTotalTransactions(userId: string, role: string): Promise<number> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
  
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
  
    const queryBuilder = this.transactionRepository.createQueryBuilder('transaction')
      .where('transaction.status = :status', { status: true })
      .andWhere('transaction.transactionDate BETWEEN :startOfDay AND :endOfDay', { startOfDay, endOfDay });
  
    if (role === 'owner') {
      const ownerId = parseInt(userId, 10);
      queryBuilder.innerJoin('transaction.order', 'order')
        .innerJoin('order.store', 'store')
        .andWhere('store.userId = :userId', {  userId: ownerId });
    }
  
    return await queryBuilder.getCount();
  }

  // list transaction userby receiveUserid
  async findTransactionsByReceiveUserId(
    receiveUserId: number,
  ): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: {
        receiveUserId,
        status: true,
        order: { orderStatus: true },
      },
      relations: ['order', 'receiveUser', 'transferUser'],
    });
  }

  // list transaction userby transferUserid (android)
  async findTransactionsByTransferUserId(
    transferUserId: number,
  ): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: {
        transferUserId,
        status: true,
        order: { orderStatus: true },
      },
      relations: ['order', 'receiveUser', 'transferUser'],
    });
  }

  // async findAllTransactionsForUser(userId: number): Promise<Transaction[]> {
  //   return this.transactionRepository.find({
  //     where: [
  //       { transferUserId: userId, status: true }, // Giao dịch do user gửi
  //       { receiveUserId: userId, status: true }, // Giao dịch do user nhận
  //       { order: { orderStatus: true } }, // Kiểm tra trạng thái đơn hàng
  //     ],
  //     relations: ['order', 'receiveUser', 'transferUser'], // Lấy quan hệ liên kết
  //   });
  // }

  async getTransactionSummary(
    userId: number,
  ): Promise<{ income: number; expense: number; balance: number }> {
    const transactions = await this.transactionRepository
  .createQueryBuilder('transaction')
  .where('(transaction.transferUserId = :userId AND transaction.status = true)', { userId })
  .orWhere('(transaction.receiveUserId = :userId AND transaction.status = true)', { userId })
  .getMany();

let income = 0;
let expense = 0;

transactions.forEach(transaction => {
  if (transaction.receiveUserId === Number(userId)) {
    income += Number(transaction.transactionAmount || 0);
  } else if (transaction.transferUserId === Number(userId)) {
    expense += Number(transaction.transactionAmount || 0);
  }
});

const balance = income - expense;

return { income, expense, balance };

  }

  // api thong ke doanh thu theo ngay thang nam
  async getRevenueByOrder(
    filterType?: 'day' | 'month' | 'year',
    filterValue?: string,
  ) {
    const query = this.transactionRepository
      .createQueryBuilder('transaction')
      .select('transaction.orderId', 'orderId')
      .addSelect('SUM(transaction.transactionAmount)', 'totalRevenue');

    if (filterType === 'day') {
      query.where('DATE(transaction.transactionDate) = :filterValue', {
        filterValue,
      });
    } else if (filterType === 'month') {
      query.where(
        'MONTH(transaction.transactionDate) = :month AND YEAR(transaction.transactionDate) = :year',
        {
          month: parseInt(filterValue.split('-')[1]),
          year: parseInt(filterValue.split('-')[0]),
        },
      );
    } else if (filterType === 'year') {
      query.where('YEAR(transaction.transactionDate) = :filterValue', {
        filterValue,
      });
    }

    const result = await query
      .groupBy('transaction.orderId')
      .orderBy('transaction.orderId', 'ASC')
      .getRawMany();
    if (!result.length) {
      return {
        message: `No revenue data found for ${filterType} ${filterValue}`,
        data: [],
      };
    }

    return result;
  }

  // api chuyen tien giua cac user voi nhau (android)
  async transferMoney(
    transferUserId: number,
    receiveUserId: number,
    amount: number,
    description: string,
  ): Promise<Transaction> {
    const transferUser = await this.userRepository.findOne({
      where: { id: transferUserId },
    });
    const receiveUser = await this.userRepository.findOne({
      where: { id: receiveUserId },
    });

    if (!transferUser) throw new NotFoundException('Transfer user not found');
    if (!receiveUser) throw new NotFoundException('Receive user not found');

    // if (transferUser.walletBalance - amount < 0) {
    //   throw new BadRequestException('Balance cannot be negative after transaction');
    // }

    if (transferUser.walletBalance < amount) {
      throw new BadRequestException({
        message: 'Insufficient balance',
        currentBalance: transferUser.walletBalance,
        requiredAmount: amount,
      });
    }

    transferUser.walletBalance -= amount;
    receiveUser.walletBalance += amount;

    console.log('Transfer User Balance:', transferUser.walletBalance);
    console.log('Receive User Balance:', receiveUser.walletBalance);

    await this.userRepository.save(transferUser);
    await this.userRepository.save(receiveUser);

    const updatedTransferUser = await this.userRepository.findOne({
      where: { id: transferUserId },
    });
    const updatedReceiveUser = await this.userRepository.findOne({
      where: { id: receiveUserId },
    });

    console.log('Updated Transfer User:', updatedTransferUser.walletBalance);
    console.log('Updated Receive User:', updatedReceiveUser.walletBalance);

    const transaction = this.transactionRepository.create({
      transferUserId,
      receiveUserId,
      transactionAmount: amount,
      transactionDate: new Date(),
      transactionDescription: description,
      status: true,
    });
    return this.transactionRepository.save(transaction);
  }

  async findAllTransactionsForUser(userId: number): Promise<Transaction[]> {
    return this.transactionRepository.createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.order', 'order')
      .leftJoinAndSelect('transaction.receiveUser', 'receiveUser')
      .leftJoinAndSelect('transaction.transferUser', 'transferUser')
      .where('transaction.transferUserId = :userId', { userId })
      .orWhere('transaction.receiveUserId = :userId', { userId })
      .getMany();
  }

  // Add data lên cho order,orderitem và transaction khi đặt hàng

  async placeOrderWithTransaction(
    userId: number,
    storeId: number,
    voucherId: number | null,
    items: { productId: number; quantity: number; unitPrice: number }[],
    note: string,
    totalPrice: number,
  ): Promise<any> {
    return await this.orderRepository.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        // 1. Kiểm tra User
        const user = await transactionalEntityManager.findOne(User, {
          where: { id: userId },
        });
        if (!user) {
          console.error(`User with ID ${userId} not found`);
          throw new NotFoundException(`User with ID ${userId} not found`);
        }

        // 2. Kiểm tra Store

        const store = await transactionalEntityManager.findOne(Store, {
          where: { storeId },
          relations: ['user'],
        });
        if (!store) {
          console.error(`Store not found with ID: ${storeId}`);
          throw new NotFoundException(`Store with ID ${storeId} not found`);
        }

        // 3. Lấy ownerId từ Store
        if (!store.user) {
          console.error(`Store with ID ${storeId} does not have an owner`);
          throw new NotFoundException(
            `Store with ID ${storeId} does not have an owner`,
          );
        }
        const receiveUserId = store.user.id;

        // 4. Kiểm tra Voucher (nếu có)
        let voucher = null;
        if (voucherId !== null) {
          voucher = await transactionalEntityManager.findOne(Voucher, {
            where: { voucherId },
          });
          if (!voucher) {
            throw new NotFoundException(
              `Voucher with ID ${voucherId} not found`,
            );
          }
        }

        // 5. Tạo Order
        const order = this.orderRepository.create({
          user,
          store,
          voucher: voucher || null,
          orderStatus: true,
          orderDate: new Date(),
          note,
          totalPrice,
          isDeleted: false,
        });
        const savedOrder = await transactionalEntityManager.save(order);

        // 6. Tạo OrderItems

        if (!Product) {
          throw new Error('Product entity is null or undefined');
        }
        for (const item of items) {
          const product = await transactionalEntityManager.findOne(Product, {
            where: { productId: item.productId },
          });
          if (!product) {
            throw new NotFoundException(
              `Product with ID ${item.productId} not found`,
            );
          }

          const orderItem = this.orderItemRepository.create({
            order: savedOrder,
            product,
            quantity: item.quantity,
            unitPrice: item.unitPrice || 0,
          });

          await transactionalEntityManager.save(orderItem);
        }

        // 7. Tạo Transaction
        const transactionDescription = `Transfer for order ${savedOrder.orderId} at store ${store.storeId}`;
        const transaction = this.transactionRepository.create({
          transferUserId: userId,
          receiveUserId,
          transactionDate: new Date(),
          transactionAmount: totalPrice,
          transactionDescription,
          status: true,
          order: savedOrder,
        });
        await transactionalEntityManager.save(transaction);

        // 8. Cập nhật số dư ví của transferUser và receiveUser
        // user.walletBalance = user.walletBalance - totalPrice;
        // store.user.walletBalance = store.user.walletBalance + totalPrice;

        user.walletBalance =
          Number(user.walletBalance) - Number(order.totalPrice);
        store.user.walletBalance =
          Number(store.user.walletBalance) + Number(order.totalPrice);

        await transactionalEntityManager.save(user);
        await transactionalEntityManager.save(store.user);

        // 9. Trả về kết quả
        return {
          message: 'Order and transaction processed successfully',
          order: savedOrder,
          transaction,
        };
      },
    );
  }
}
