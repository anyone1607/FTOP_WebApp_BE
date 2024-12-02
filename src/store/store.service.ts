import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './entities/store.entity';
@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  // create a new store
  async create(storeData: Partial<Store>): Promise<Store> {
    const store = this.storeRepository.create(storeData);
    return await this.storeRepository.save(store);
  }
  // Get all stores
  async findAll(): Promise<Store[]> {
    return await this.storeRepository.find({ relations: ['vouchers','owner'] });
  }
  // Get one store by id
  async findOne(id: number): Promise<Store> {
    const store = await this.storeRepository.findOne({
      where: { storeId: id },
      relations: ['vouchers'],
    });
    if (!store) {
      throw new NotFoundException(`Store with id ${id} not found`);
    }
    return store;
  }
  // update a store by ID
  async update(id: number, storeData: Partial<Store>): Promise<Store> {
    const store = await this.storeRepository.preload({
      storeId: id,
      ...storeData,
    });
    if (!store) {
      throw new NotFoundException(`Store with ID ${id} not found`);
    }
    return this.storeRepository.save(store);
  }
  // delete a store by id
  async remove(id: number): Promise<void> {
    const store = await this.storeRepository.findOneBy({ storeId: id });
    if (!store) {
      throw new NotFoundException(`Store with id ${id} not found`);
    }
    await this.storeRepository.remove(store);
  }

  async getOrderCountByStore(filterType?: 'day' | 'month' | 'year', filterValue?: string): Promise<any> {
    const queryBuilder = this.storeRepository
      .createQueryBuilder('store')
      .select('store.storeId', 'storeId')
      .addSelect('store.storeName', 'storeName')
      .addSelect('COUNT(order.orderId)', 'orderCount')
      .leftJoin('store.order', 'order');
  
    if (filterType === 'day') {
      queryBuilder.where('DATE(order.orderDate) = :filterValue', { filterValue });
    } else if (filterType === 'month') {
      queryBuilder.where('MONTH(order.orderDate) = :month AND YEAR(order.orderDate) = :year', {
        month: filterValue.split('-')[1], 
        year: filterValue.split('-')[0],
      });
    } else if (filterType === 'year') {
      queryBuilder.where('YEAR(order.orderDate) = :filterValue', { filterValue });
    }
  
    queryBuilder.groupBy('store.storeId').addGroupBy('store.storeName');
  
    return await queryBuilder.getRawMany();
  }
  

}
