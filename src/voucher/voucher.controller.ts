import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { Voucher } from './entities/voucher.entity';
@Controller('voucher')
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  @Post()
  create(@Body() voucherData: Partial<Voucher>) {
    return this.voucherService.create(voucherData);
  }

  // @Get()
  // findAll(): Promise<Voucher[]> {
  //     return this.voucherService.findAll();
  // }

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

  // @Delete(':id')
  // remove(@Param('id') id: number): Promise<void> {
  //     return this.voucherService.remove(id);
  // }

  @Delete(':id')
  softDelete(@Param('id') id: number): Promise<void> {
    return this.voucherService.softDelete(id);
  }

  @Get('trash')
  getDeletedVouchers() {
    return this.voucherService.getDeletedVoucher();
  }

  @Get('restore/:id')
  restore(@Param('id') id: number): Promise<void> {
    return this.voucherService.restore(id);
  }

  @Delete('permanently/:id')
  permanentlyDelete(@Param('id') id: number): Promise<void> {
    return this.voucherService.permanentlyDelete(id);
  }

  @Get()
  findAll(): Promise<Voucher[]> {
    return this.voucherService.findAll();
  }
}
