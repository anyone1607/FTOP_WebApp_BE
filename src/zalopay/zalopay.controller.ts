import { Controller, Post, Body } from '@nestjs/common';
import { ZalopayService } from './zalopay.service';

@Controller('zalopay')
export class ZalopayController {
  constructor(private readonly zaloPayService: ZalopayService) {}

  @Post()
  async createOrder() {
    return this.zaloPayService.createPayment();
  }

  @Post('callback')
  async handleCallback(@Body() body: any) {
    return this.zaloPayService.handleCallback(body);
  }

  @Post('check-status-order/:app_trans_id')
  async checkStatus(@Body('app_trans_id') app_trans_id: string) {
    return this.zaloPayService.checkStatus(app_trans_id);
  }

}
