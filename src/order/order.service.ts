import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { User } from '../user/entities/user.entity';
import { Store } from '../store/entities/store.entity';
@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Store)
    private readonly storeRepo: Repository<Store>,
  ) {}

  async countTotalOrders(): Promise<number> {
    return await this.orderRepository.count({
      where: { orderStatus: true },
    });
  }

  async countTotalPriceOrder(): Promise<number> {
    const result = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.totalPrice)', 'totalPrice')
      .where('order.orderStatus = :orderStatus', { orderStatus: true })
      .getRawOne();

    return parseFloat(result.totalPrice || '0');
  }

  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find({
      where: { isDeleted: false },
      relations: ['user', 'store', 'voucher'],
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { orderId: id },
      relations: ['user', 'store', 'voucher'],
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

  async getStoreStats(
    storeId: number,
    month: number | null,
    year: number,
  ): Promise<{
    totalOrders: number;
    totalRevenue: number;
    totalDiscount: number;
  }> {
    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .select('COUNT(order.orderId)', 'totalOrders')
      .addSelect('SUM(order.totalPrice)', 'totalRevenue')
      .where('order.storeId = :storeId', { storeId })
      .andWhere('YEAR(order.orderDate) = :year', { year })
      .andWhere('order.orderStatus = :orderStatus', { orderStatus: true })
      .andWhere('order.isCashedOut = :isCashedOut', { isCashedOut: false });

    if (month !== null) {
      queryBuilder.andWhere('MONTH(order.orderDate) = :month', { month });
    }

    const result = await queryBuilder.getRawOne();
    const totalOrders = Number(result.totalOrders) || 0;
    const totalRevenue = parseFloat(result.totalRevenue) || 0;
    const totalDiscount = totalRevenue * 0.1;

    return {
      totalOrders,
      totalRevenue,
      totalDiscount,
    };
  }

  async cashOutMonth(storeId: number, month: number, year: number) {
    const { totalRevenue, totalDiscount } = await this.getStoreStats(
      storeId,
      month,
      year,
    );
    const store = await this.storeRepo.findOne({
      where: { storeId },
      relations: ['user'],
    });
    if (!store || !store.user) {
      throw new NotFoundException('Store hoặc User (chủ store) không tồn tại');
    }
    const user68 = await this.userRepo.findOne({ where: { id: 68 } });
    if (!user68) {
      throw new NotFoundException('User #68 không tồn tại');
    }
    if (store.user.walletBalance < totalDiscount) {
      throw new Error('Chủ store không đủ tiền để chuyển');
    }
    store.user.walletBalance -= totalDiscount;
    user68.walletBalance += totalDiscount;
    await this.userRepo.save([store.user, user68]);
    await this.orderRepository
      .createQueryBuilder()
      .update(Order)
      .set({ isCashedOut: true })
      .where('storeId = :storeId', { storeId })
      .andWhere('MONTH(orderDate) = :month', { month })
      .andWhere('YEAR(orderDate) = :year', { year })
      .andWhere('isCashedOut = :cashedOut', { cashedOut: false })
      .andWhere('orderStatus = :status', { status: true })
      .execute();

    return {
      message: 'Cash out success',
      totalRevenue,
      discount: totalDiscount,
      walletBalanceStoreOwner: store.user.walletBalance,
      walletBalanceUser68: user68.walletBalance,
    };
  }
}
