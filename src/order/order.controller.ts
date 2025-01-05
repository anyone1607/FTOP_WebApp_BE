import { Controller, Get, Delete, Param, Query, Post, Body } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from './entities/order.entity';
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

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

  @Post('create-with-items')
  async createOrderWithItems(
    @Body('userId') userId: number,
    @Body('storeId') storeId: number,
    @Body('voucherId') voucherId: number | null,
    @Body('note') note: string,
    @Body('totalPrice') totalPrice: number,
    @Body('items') items: { productId: number; quantity: number; unitPrice: number }[],
    @Body('transferUserId') transferUserId: number,
    @Body('receiveUserId') receiveUserId: number,
    @Body('transactionAmount') transactionAmount: number,
  ): Promise<Order> {
    return this.orderService.createOrderWithItems(
      userId,
      storeId,
      voucherId,
      note,
      totalPrice,
      items,
      transferUserId,
      receiveUserId,
      transactionAmount,
    );
  }

  @Get('stats/:storeId')
  async getStoreStats(
    @Param('storeId') storeId: number,
    @Query('month') month: number,
    @Query('year') year: number,
  ): Promise<{ totalOrders: number; totalRevenue: number }> {
    return this.orderService.getStoreStats(storeId, month, year);
  }

  @Get()
  async findAll(
    @Query('userId') userId: string,
    @Query('role') role: string,
  ): Promise<Order[]> {
    return await this.orderService.findAll(userId, role);
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


  // @Get('count-by-store')
  // async getOrderCountByStore(
  //   @Query('filterType') filterType: 'day' | 'month' | 'year',
  //   @Query('filterValue') filterValue: string,
  // ) {
  //   return await this.orderService.getOrderCountByStore(
  //     filterType,
  //     filterValue,
  //   );
  // }

}
