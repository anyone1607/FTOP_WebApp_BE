import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async countTotalOrders(): Promise<number> {
    return await this.orderRepository.count({
      where: { orderStatus: true },
    });
  }

  async countTotalPriceOrder(): Promise<number> {
    const result = await this.orderRepository.createQueryBuilder('order')
      .select('SUM(order.totalPrice)', 'totalPrice')
      .where('order.orderStatus = :orderStatus', { orderStatus: true })
      .getRawOne();
  
    return parseFloat(result.totalPrice || '0');
  }

  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find({
      where: { isDeleted: false },
      relations: ['user', 'store', 'voucher','orderItems'],
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { orderId: id },
      relations: ['user', 'store', 'voucher','orderItems','orderItems.product'],
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
  
}
