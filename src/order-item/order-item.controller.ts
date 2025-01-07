import { Controller, Get,Query } from '@nestjs/common';
import { OrderItemService } from './order-item.service';
@Controller('order-item')
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  @Get('sales')
async getProductsBySales(
  @Query('userId') userId: string,
  @Query('role') role: string
) {
  return await this.orderItemService.getProductsBySales(userId, role);
}

}
