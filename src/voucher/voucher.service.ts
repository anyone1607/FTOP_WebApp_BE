import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Voucher } from '../voucher/entities/voucher.entity';

import { Repository, Like, Between } from 'typeorm';
import { VoucherDetails } from 'src/utils/types';


@Injectable()
export class VoucherService {
  constructor(
    @InjectRepository(Voucher)
    private readonly voucherRepository: Repository<Voucher>,
  ) { }


  
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

  async restore(id: number, expiredDate: string, createDate: string): Promise<Voucher> {
    const voucher = await this.voucherRepository.findOne({
      where: { voucherId: id, isDeleted: true },
      relations: ['store'],
    });
    if (!voucher) {
      throw new NotFoundException(`Voucher with ID ${id} not found or not deleted`);
    }
    voucher.isDeleted = false;
    voucher.deletedAt = null;
    voucher.expiredDate = new Date(expiredDate);
    voucher.createdDate = new Date(createDate);
    await this.voucherRepository.save(voucher);
    return voucher;
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


  async findAll(userId: number, role: string): Promise<Voucher[]> {
    if (role === 'owner') {
      return this.voucherRepository.find({
        where: { isDeleted: false, store: { user: { id: userId } } },
        relations: ['store'],
      });
    } else {
      return this.voucherRepository.find({
        where: { isDeleted: false },
        relations: ['store'],
      });
    }
  }

  async filter(filter?: string, minDiscount?: string, maxDiscount?: string, userId?: number, role?: string): Promise<Voucher[]> {
    const queryBuilder = this.voucherRepository.createQueryBuilder('voucher')
      .leftJoinAndSelect('voucher.store', 'store')
      .where('voucher.isDeleted = :isDeleted', { isDeleted: false });

    if (filter) {
      queryBuilder.andWhere('voucher.voucherName LIKE :filter', { filter: `%${filter}%` });
    }

    if (minDiscount && maxDiscount) {
      queryBuilder.andWhere('voucher.voucherDiscount BETWEEN :minDiscount AND :maxDiscount', { minDiscount: parseInt(minDiscount), maxDiscount: parseInt(maxDiscount) });
    }

    if (role === 'owner') {
      queryBuilder.andWhere('store.ownerId = :userId', { userId });
    }

    const vouchers = await queryBuilder.getMany();
    return vouchers;
  }

  // Get voucher by storeId (android)
  async findByStoreId(storeId: number): Promise<Voucher[]> {
    return await this.voucherRepository.find({
      where: { store: { storeId }, isDeleted: false },
      relations: ['store'],
    });
  }



}
