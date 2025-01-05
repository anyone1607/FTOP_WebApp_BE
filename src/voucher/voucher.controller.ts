import {
  Controller,
  Get,
  Body,
  Post,
  Patch,
  Param,
  Delete,
  Query
} from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { Voucher } from './entities/voucher.entity';

@Controller('voucher')
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) { }

  // android
  // @Get()
  // async findAll(@Query('userId') userId: number, @Query('role') role: string): Promise<Voucher[]> {
  //   return this.voucherService.findAll(userId, role);
  // }

  @Get()
  async findAll(@Query('userId') userId: number, @Query('role') role: string): Promise<Voucher[]> {
    return this.voucherService.findAll(userId, role);
  }

  // tim delete da bi xoa mem
  @Get('deleted')
  async getDeletedVouchers(): Promise<Voucher[]> {
    return this.voucherService.getDeletedVouchers();
  }


  @Post()
  create(@Body() voucherData: Partial<Voucher>) {
    return this.voucherService.create(voucherData);
  }

  @Get('filter')
  async filter(
    @Query('filter') filter: string,
    @Query('minDiscount') minDiscount: string,
    @Query('maxDiscount') maxDiscount: string,
    @Query('userId') userId: number,
    @Query('role') role: string,
  ): Promise<Voucher[]> {
    return this.voucherService.filter(filter, minDiscount, maxDiscount, userId, role);
  }

  
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Voucher> {
    return this.voucherService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() voucherData: Partial<Voucher>,
  ): Promise<Voucher> {
    return this.voucherService.update(id, voucherData);
  }

  @Patch(':id/delete')
  async softDelete(@Param('id') id: number): Promise<void> {
    return this.voucherService.softDelete(id);
  }

  // khoi phuc lai voucher da bi xoa mem
  @Patch(':id/restore')
  async restoreVoucher(
    @Param('id') voucherId: number,
    @Body('expiredDate') expiredDate: string,
    @Body('createDate') createDate: string,
  ): Promise<Voucher> {
    return this.voucherService.restore(voucherId, expiredDate, createDate);
  }

  // xoa that sự

  @Delete(':id')
  async permanentlyDelete(@Param('id') id: number): Promise<void> {
    return this.voucherService.permanentlyDelete(id);
  }

  // http://localhost:8000/api/voucher/store/{storeId}
  @Get('store/:storeId')
  async getVouchersByStoreId(@Param('storeId') storeId: number): Promise<Voucher[]> {
    return await this.voucherService.findByStoreId(+storeId);
  }

}
