import { Controller, Get } from '@nestjs/common';

@Controller('voucher')
export class VoucherController {

    @Get('listVouchers')
    findAll() {
        return 'This action returns all vouchers';
    }
}
