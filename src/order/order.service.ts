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
  
}
