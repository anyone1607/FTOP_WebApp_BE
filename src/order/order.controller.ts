import { Controller, Get, Param } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from './entities/order.entity';
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('countOrder')
  async countTotalOrders(): Promise<{ totalOrders: number }> {
    const totalOrders = await this.orderService.countTotalOrders();
    return { totalOrders };
  }

  @Get('countPrice')
  async countTotalPriceOrder(): Promise<{ totalPrice: number }> {
    const totalPrice = await this.orderService.countTotalPriceOrder();
    return { totalPrice };
  }

  @Get()
  async findAll(): Promise<Order[]> {
    return await this.orderService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Order> {
    return await this.orderService.findOne(id);
  }

  @Get('/store/:storeId')
  async findByStoreId(@Param('storeId') storeId: number): Promise<Order[]> {
    return await this.orderService.findByStoreId(storeId);
  }
}
