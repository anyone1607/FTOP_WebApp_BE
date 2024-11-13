import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BankTransfer } from './entities/banktransfer.entity';
@Injectable()
export class BanktransferService {
  constructor(
    @InjectRepository(BankTransfer)
    private bankTransferRepository: Repository<BankTransfer>,
  ) {}

  async getBankTransferInfo(walletUserId: number) {
    return this.bankTransferRepository.findOne({
      where: { walletUserId },
      relations: ['user'],
    });
  }

  async findTransfersByUserId(walletUserId: number) {
    return this.bankTransferRepository.find({
      where: { walletUserId },
    });
  }

}
