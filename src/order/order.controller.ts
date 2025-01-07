import { Controller, Get, Delete, Param, Query, Post, Body } from '@nestjs/common';
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

  @Get('findDeleted')
  async getDeletedOrders(): Promise<Order[]> {
    return this.orderService.findDeleted();
  }

  @Get('/store/:storeId')
  async findByStoreId(@Param('storeId') storeId: number): Promise<Order[]> {
    return await this.orderService.findByStoreId(storeId);
  }

  @Delete('soft-delete/:id')
  async softDeleteOrder(@Param('id') orderId: number): Promise<string> {
    return this.orderService.softDelete(orderId);
  }

  @Get('stats/:storeId')
  async getStoreStats(
    @Param('storeId') storeId: number,
    @Query('month') month: number,
    @Query('year') year: number,
  ): Promise<{ totalOrders: number; totalRevenue: number }> {
    return this.orderService.getStoreStats(storeId, month, year);
  }

  @Post('cashout-month')
  async cashOutMonth(@Body() body: { storeId: number; month: number; year: number }) {
    const { storeId, month, year } = body;
    const result = await this.orderService.cashOutMonth(storeId, month, year);
    return result;
  }
}
