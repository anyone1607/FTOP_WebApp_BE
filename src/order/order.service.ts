import { Injectable, NotFoundException,Body,Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository ,EntityManager  } from 'typeorm';
import { Order } from './entities/order.entity';
import { User } from '../user/entities/user.entity';
import { Store } from '../store/entities/store.entity';
import { Voucher } from '../voucher/entities/voucher.entity';
import { OrderItem } from '../order-item/entities/orderItem.entity';
import { Product } from '../product/entities/product.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) { }

  async countTotalOrders(userId: string, role: string): Promise<number> {
    if (role === 'owner') {
      const ownerId = parseInt(userId, 10);
      return await this.orderRepository.createQueryBuilder('order')
        .innerJoin('order.store', 'store')
        .where('store.ownerId = :ownerId', { ownerId })
        .andWhere('order.orderStatus = :orderStatus', { orderStatus: true })
        .getCount();
    }
    return await this.orderRepository.count({
      where: { orderStatus: true },
    });
  }
  async getStoreStats(storeId: number, month: number | null, year: number): Promise<{ totalOrders: number; totalRevenue: number }> {
    const queryBuilder = this.orderRepository.createQueryBuilder('order')
      .select('COUNT(order.orderId)', 'totalOrders')
      .addSelect('SUM(order.totalPrice)', 'totalRevenue')
      .where('order.storeId = :storeId', { storeId })
      .andWhere('YEAR(order.orderDate) = :year', { year })
      .andWhere('order.orderStatus = :orderStatus', { orderStatus: true });

    if (month !== null) {
      queryBuilder.andWhere('MONTH(order.orderDate) = :month', { month });
    } else {
      queryBuilder.andWhere(':month IS NULL');
    }

    const result = await queryBuilder.getRawOne();
    return {
      totalOrders: parseInt(result.totalOrders, 10) || 0,
      totalRevenue: parseFloat(result.totalRevenue) || 0,
    };
  }
  async countTotalPriceOrder(userId: string, role: string): Promise<number> {
    const queryBuilder = this.orderRepository.createQueryBuilder('order')
      .select('SUM(order.totalPrice)', 'totalPrice')
      .where('order.orderStatus = :orderStatus', { orderStatus: true });
  
    if (role === 'owner') {
      const ownerId = parseInt(userId, 10);
      queryBuilder.innerJoin('order.store', 'store')
        .andWhere('store.ownerId = :ownerId', { ownerId });
    }
  
    const result = await queryBuilder.getRawOne();
    return parseFloat(result.totalPrice || '0');
  }



  // async findAll(): Promise<Order[]> {
  //   return await this.orderRepository.find({
  //     where: { isDeleted: false },
  //     relations: ['user', 'store', 'voucher', 'orderItems'],
  //   });
  // }
  async findAll(userId: string, role: string): Promise<Order[]> {
    if (role === 'owner') {
      const ownerId = parseInt(userId, 10); // Chuyển đổi userId từ string sang number
      return await this.orderRepository.find({
        where: { store: { ownerId: ownerId }, isDeleted: false },
        relations: ['user', 'store', 'voucher', 'orderItems'],
      });
    }
    return await this.orderRepository.find({
      where: { isDeleted: false },
      relations: ['user', 'store', 'voucher', 'orderItems'],
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { orderId: id },
      relations: ['user', 'store', 'voucher', 'orderItems', 'orderItems.product'],
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async findByStoreId(storeId: number): Promise<Order[]> {
    return await this.orderRepository.find({
      where: { store: { storeId: storeId } },
    });
  }

  async softDelete(orderId: number): Promise<string> {
    const order = await this.orderRepository.findOne({ where: { orderId } });

    if (!order) {
      throw new Error(`Order with ID ${orderId} not found`);
    }

    if (order.isDeleted) {
      throw new Error(`Order with ID ${orderId} is already deleted`);
    }

    order.isDeleted = true;
    await this.orderRepository.save(order);

    return `Order with ID ${orderId} has been soft deleted`;
  }

  async findDeleted(): Promise<Order[]> {
    return await this.orderRepository.find({
      where: { isDeleted: true },
      relations: ['user', 'store', 'voucher'],
    });
  }

  // api so luong don hang ban duoc cua tung store theo ngay thang nam
  // async getOrderCountByStore(filterType: 'day' | 'month' | 'year', filterValue: string): Promise<any> {
  //   const queryBuilder = this.orderRepository
  //   .createQueryBuilder('order')
  //   .select('store.storeId', 'storeId')
  //   .addSelect('store.storeName', 'storeName')
  //   .addSelect('COUNT(order.orderId)', 'orderCount')
  //   .innerJoin('order.store', 'store')
  //   .groupBy('store.storeId')
  //   .addGroupBy('store.storeName');
  //   console.log(queryBuilder);

  //   if(filterType === 'day') {
  //     queryBuilder.where('DATE(order.orderDate) = :filterValue', {filterValue});
  //   }else if(filterType === 'month'){
  //     queryBuilder.where('MONTH(order.orderDate) = :month AND YEAR(order.orderDate) = :year', {
  //       month: filterValue.split('-')[1],
  //       year: filterValue.split('-')[0],
  //     });
  //   }else if(filterType === 'year') {
  //     queryBuilder.where('YEAR(order.orderDate) = :filterValue', { filterValue });
  //   }
  //   return await queryBuilder.getRawMany();
  // }

  async createOrder(
    userId: number,
    storeId: number,
    voucherId: number | null,
    note: string,
    totalPrice: number,
  ): Promise<Order> {
    const user = await this.orderRepository.manager.findOne(User, { where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const store = await this.orderRepository.manager.findOne(Store, { where: { storeId: storeId } });
    if (!store) {
      throw new NotFoundException(`Store with ID ${storeId} not found`);
    }

    let voucher = null;
    if (voucherId !== null) {
      voucher = await this.orderRepository.manager.findOne(Voucher, { where: { voucherId: voucherId } });
      if (!voucher) {
        throw new NotFoundException(`Voucher with ID ${voucherId} not found`);
      }
    }

    const order = this.orderRepository.create({
      user,
      store,
      voucher,
      orderStatus: true,
      orderDate: new Date(),
      note,
      totalPrice,
      isDeleted: false,
    });

    return await this.orderRepository.save(order);
  }


  //api tao don hang (android)
  async createOrderWithItems(
    userId: number,
    storeId: number,
    voucherId: number | null,
    note: string,
    totalPrice: number,
    items: { productId: number; quantity: number; unitPrice: number }[],
    transferUserId: number,
    receiveUserId: number,
    transactionAmount: number,
  ): Promise<Order> {
    return await this.orderRepository.manager.transaction(async (transactionalEntityManager: EntityManager) => {
      const user = await transactionalEntityManager.findOne(User, { where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
  
      const store = await transactionalEntityManager.findOne(Store, { where: { storeId } });
      if (!store) {
        throw new NotFoundException(`Store with ID ${storeId} not found`);
      }
  
      let voucher = null;
      if (voucherId !== null) {
        voucher = await transactionalEntityManager.findOne(Voucher, { where: { voucherId } });
        if (!voucher) {
          throw new NotFoundException(`Voucher with ID ${voucherId} not found`);
        }
      }
  
      const order = this.orderRepository.create({
        user,
        store,
        voucher,
        orderStatus: true,
        orderDate: new Date(),
        note,
        totalPrice,
        isDeleted: false,
      });
  
      const savedOrder = await transactionalEntityManager.save(order);
  
      for (const item of items) {
        const product = await transactionalEntityManager.findOne(Product, { where: { productId: item.productId } });
        if (!product) {
          throw new NotFoundException(`Product with ID ${item.productId} not found`);
        }
  
        const orderItem = this.orderItemRepository.create({
          order: savedOrder,
          product,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        });
  
        await transactionalEntityManager.save(orderItem);
      }
  
      const transactionDescription = `Transfer for order ${savedOrder.orderId} at store ${store.storeId}`;
  
      const transaction = this.transactionRepository.create({
        transferUserId,
        receiveUserId,
        transactionDate: new Date(),
        transactionAmount,
        transactionDescription,
        status: true,
        order: savedOrder,
      });
  
      await transactionalEntityManager.save(transaction);
  
      return savedOrder;
    });
  }
}

