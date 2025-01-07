import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItem } from './entities/orderItem.entity';

@Injectable()
export class OrderItemService {

    constructor(
        @InjectRepository(OrderItem)
        private readonly orderItemRepository: Repository<OrderItem>,
    ){}

    // Cau lenh SQL
//     SELECT 
//     "orderItem"."productId", 
//     SUM("orderItem"."quantity") AS "totalSold"
// FROM 
//     "order_item" "orderItem"
// GROUP BY 
//     "orderItem"."productId"
// ORDER BY 
//     "totalSold" DESC;

async getProductsBySales(userId: string, role: string): Promise<any[]> {
  const queryBuilder = this.orderItemRepository.createQueryBuilder('orderItem')
    .select('orderItem.productId', 'productId')
    .addSelect('SUM(orderItem.quantity)', 'totalSold')
    .groupBy('orderItem.productId')
    .orderBy('totalSold', 'DESC');

  if (role === 'owner') {
    const ownerId = parseInt(userId, 10);
    queryBuilder.innerJoin('orderItem.order', 'order')
      .innerJoin('order.store', 'store')
      .where('store.ownerId = :ownerId', { ownerId });
  }

  const salesData = await queryBuilder.getRawMany();

  const result = await Promise.all(
    salesData.map(async (item) => {
      const product = await this.orderItemRepository.findOne({
        where: { productId: item.productId },
      });
      return {
        product,
        totalSold: item.totalSold,
      };
    }),
  );

  return result;
}

}
