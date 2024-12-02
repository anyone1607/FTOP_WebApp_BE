import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Voucher } from '../voucher/entities/voucher.entity';
import { Repository } from 'typeorm';
import { VoucherDetails } from 'src/utils/types';
@Injectable()
export class VoucherService {
  constructor(
    @InjectRepository(Voucher)
    private readonly voucherRepository: Repository<Voucher>,
  ) {}

  async validateVoucher(details: VoucherDetails) {
    const voucher = await this.voucherRepository.findOneBy({
      voucherName: details.voucherName,
    });
    if (voucher) return voucher;
    console.log('Voucher not found');
    const newVoucher = this.voucherRepository.create(details);
    return this.voucherRepository.save(newVoucher);
  }

  async create(voucherData: Partial<Voucher>): Promise<Voucher> {
    const voucher = this.voucherRepository.create(voucherData);
    return await this.voucherRepository.save(voucher);
  }

  async findOne(id: number): Promise<Voucher> {
    const voucher = await this.voucherRepository.findOne({
      where: { voucherId: id },
      relations: ['store'],
    });
    if (!voucher) {
      throw new NotFoundException(`Voucher with ID ${id} not found`);
    }
    return voucher;
  }

  async update(id: number, voucherData: Partial<Voucher>): Promise<Voucher> {
    const voucher = await this.voucherRepository.preload({
      voucherId: id,
      ...voucherData,
    });
    if (!voucher) {
      throw new NotFoundException(`Voucher with ID ${id} not found`);
    }
    return this.voucherRepository.save(voucher);
  }

  // soft delete voucher (done)
  async softDelete(id: number): Promise<void> {
    const voucher = await this.voucherRepository.findOne({ where: { voucherId: id }, relations: ['store'] });
    if (voucher) {
      voucher.isDeleted = true;
      voucher.deletedAt = new Date();
      await this.voucherRepository.save(voucher);
    }
  }
  

  // list deleted voucher in trash
  async getDeletedVouchers(): Promise<Voucher[]> {
    return await this.voucherRepository.find({
      where: { isDeleted: true },
      relations: ['store'],
    });
  }

  // restore deleted voucher
  async restore(id: number): Promise<void> {
    const voucher = await this.voucherRepository.findOne({
      where: { voucherId: id, isDeleted: true },
    });
    if (!voucher) {
      throw new NotFoundException(`Voucher with ID ${id} not found or not deleted`);
    }
    voucher.isDeleted = false;
    voucher.deletedAt = null;
    await this.voucherRepository.save(voucher);
  }

  // permanently delete
  async permanentlyDelete(id: number): Promise<void> {
    const voucher = await this.voucherRepository.findOne({
      where: { voucherId: id, isDeleted: true },
    });
    if (!voucher) {
      throw new NotFoundException(`Voucher with ID ${id} not found or not marked for deletion`);
    }
    await this.voucherRepository.delete(id);
  }

  // Fetch only non-deleted vouchers
  async findAll(): Promise<Voucher[]> {
    return this.voucherRepository.find({ where: { isDeleted: false }
    ,relations: ['store'], 
  });
  }
}
