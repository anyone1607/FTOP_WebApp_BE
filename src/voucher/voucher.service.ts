import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Voucher } from "../voucher/entities/voucher.entity";
import { Repository } from "typeorm";
import { VoucherDetails } from 'src/utils/types';
@Injectable()
export class VoucherService {

    constructor(@InjectRepository(Voucher) private readonly voucherRepository: Repository<Voucher>) {}

    async validateVoucher(details: VoucherDetails) {
        // console.log(details);
        const voucher = await this.voucherRepository.findOneBy({ voucherName: details.voucherName });
        // console.log(voucher);
        if(voucher) return voucher;
        console.log("Voucher not found");
        const newVoucher = this.voucherRepository.create(details);
        return this.voucherRepository.save(newVoucher);
    }

    async findAll() {
        const vouchers = await this.voucherRepository.find();
        return vouchers;
    }
}
