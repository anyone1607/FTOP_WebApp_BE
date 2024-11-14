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
    return await this.storeRepository.find({ relations: ['vouchers'] });
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
    // Load the entity by `id`
    const store = await this.storeRepository.findOne({ where: { storeId: id } });
  
    if (!store) {
      throw new NotFoundException(`Store with ID ${id} not found`);
    }
  
    // Merge the new data
    Object.assign(store, storeData);
  
    // Save the updated entity
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
}
