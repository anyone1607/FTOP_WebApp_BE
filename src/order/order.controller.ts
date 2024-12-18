import { Controller, Get, Delete, Param,Query } from '@nestjs/common';
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
