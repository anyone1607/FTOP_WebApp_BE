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

  // create a new store cu 
  // async create(storeData: Partial<Store>): Promise<Store> {
  //   console.log("Store Data for Create:", storeData); // Log dữ liệu trước khi lưu

  //    // Convert status to boolean if it's a string
  // if (typeof storeData.status === 'string') {
  //   storeData.status = storeData.status === 'true';
  // }
  
  //   const store = this.storeRepository.create(storeData);
  //   const savedStore = await this.storeRepository.save(store);
  
  //   console.log("Saved Store from DB:", savedStore); // Log kết quả sau khi lưu vào database
  //   return savedStore;
  // }

  // create a new store
  async create(storeData: Partial<Store>): Promise<Store> {
    console.log("Store Data for Create:", storeData); // Log dữ liệu trước khi lưu

    // Convert status to boolean if it's a string
    if (typeof storeData.status === 'string') {
      storeData.status = storeData.status === 'true';
    }

    const store = this.storeRepository.create(storeData);
    const savedStore = await this.storeRepository.save(store);

    console.log("Saved Store from DB:", savedStore); // Log kết quả sau khi lưu vào database
    return savedStore;
  }
  
  // Get all stores
  async findAll(): Promise<Store[]> {
    return await this.storeRepository.find({ relations: ['vouchers','owner'] });
  }
  // GET 4 new stores
  async findLatestedStores(): Promise<Store[]> {
    return await this.storeRepository
      .createQueryBuilder('store')
      .leftJoinAndSelect('store.vouchers', 'vouchers')
      .orderBy('store.storeId', 'DESC')
      .take(4)
      .getMany();
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
  // update a store by ID moi
  // async updateStore(storeDto: Partial<Store>, id: number): Promise<Store> {
  //   console.log("Store Data for Update:", storeDto); // Log dữ liệu được gửi tới service
  //   if (typeof storeDto.status === 'string') {
  //     storeDto.status = storeDto.status === 'true';
  //   }
  //   // Chỉ cập nhật các trường có giá trị
  //   const updateData: Partial<Store> = {};
  //   if (storeDto.storeName) updateData.storeName = storeDto.storeName;
  //   if (storeDto.storeAddress) updateData.storeAddress = storeDto.storeAddress;
  //   if (storeDto.storePhone) updateData.storePhone = storeDto.storePhone;
  //   if (storeDto.ownerId) updateData.ownerId = storeDto.ownerId;
  //   if (storeDto.status !== undefined) {
  //     updateData.status = typeof storeDto.status === 'boolean' ? storeDto.status : storeDto.status === '1' || storeDto.status === 1;
  //   }
  //   if (storeDto.storeImage) updateData.storeImage = storeDto.storeImage;
  
  //   console.log("Data to be updated in DB:", updateData); // Log dữ liệu trước khi cập nhật database
  
  //   await this.storeRepository.update(id, updateData);
  
  //   const updatedStore = await this.storeRepository.findOne({ where: { storeId: id } });
  
  //   console.log("Updated Store from DB:", updatedStore); // Log kết quả sau khi lấy từ database
  //   return updatedStore;
  // }

  // update a store by ID
  // async updateStore(storeDto: Partial<Store>, id: number): Promise<Store> {
  //   console.log("Store Data for Update:", storeDto); // Log dữ liệu được gửi tới service
  //   if (typeof storeDto.status === 'string') {
  //     storeDto.status = storeDto.status === 'true';
  //   }
  //   // Chỉ cập nhật các trường có giá trị
  //   const updateData: Partial<Store> = {};
  //   if (storeDto.storeName) updateData.storeName = storeDto.storeName;
  //   if (storeDto.storeAddress) updateData.storeAddress = storeDto.storeAddress;
  //   if (storeDto.storePhone) updateData.storePhone = storeDto.storePhone;
  //   if (storeDto.ownerId) updateData.ownerId = storeDto.ownerId;
  //   if (storeDto.status !== undefined) {
  //     updateData.status = typeof storeDto.status === 'boolean' ? storeDto.status : storeDto.status === '1' || storeDto.status === 1;
  //   }
  //   if (storeDto.storeImage) {
  //     // Ensure only relative paths are saved
  //     updateData.storeImage = storeDto.storeImage.map(image => {
  //       if (image.startsWith('http://localhost:8000')) {
  //         return image.replace('http://localhost:8000', '');
  //       }
  //       return image;
  //     });
  //   }

  //   console.log("Data to be updated in DB:", updateData); // Log dữ liệu trước khi cập nhật database

  //   await this.storeRepository.update(id, updateData);

  //   const updatedStore = await this.storeRepository.findOne({ where: { storeId: id } });

  //   console.log("Updated Store from DB:", updatedStore); // Log kết quả sau khi lấy từ database
  //   return updatedStore;
  // }
  async updateStore(storeDto: Partial<Store>, id: number): Promise<Store> {
    console.log("Store Data for Update:", storeDto); // Log dữ liệu được gửi tới service
    if (typeof storeDto.status === 'string') {
      storeDto.status = storeDto.status === 'true';
    }
    // Chỉ cập nhật các trường có giá trị
    const updateData: Partial<Store> = {};
    if (storeDto.storeName) updateData.storeName = storeDto.storeName;
    if (storeDto.storeAddress) updateData.storeAddress = storeDto.storeAddress;
    if (storeDto.storePhone) updateData.storePhone = storeDto.storePhone;
    if (storeDto.ownerId) updateData.ownerId = storeDto.ownerId;
    if (storeDto.status !== undefined) {
      updateData.status = typeof storeDto.status === 'boolean' ? storeDto.status : storeDto.status === '1' || storeDto.status === 1;
    }
    if (storeDto.storeImage) {
      // Ensure only relative paths are saved
      updateData.storeImage = storeDto.storeImage.map(image => {
        if (image.startsWith('http://localhost:8000')) {
          return image.replace('http://localhost:8000', '');
        }
        return image;
      });
    }
  
    console.log("Data to be updated in DB:", updateData); // Log dữ liệu trước khi cập nhật database
  
    await this.storeRepository.update(id, updateData);
  
    const updatedStore = await this.storeRepository.findOne({ where: { storeId: id } });
  
    console.log("Updated Store from DB:", updatedStore); // Log kết quả sau khi lấy từ database
    return updatedStore;
  }

  async updateMainImage(id: number, storeImage: string[]): Promise<Store> {
    console.log(`Updating main image for store ID: ${id}`);
    const store = await this.storeRepository.findOne({ where: { storeId: id } });
    if (!store) {
      throw new NotFoundException(`Store with id ${id} not found`);
    }

    store.storeImage = storeImage;
    await this.storeRepository.save(store);

    console.log("Updated Store from DB:", store);
    return store;
  }

  // delete a store by id
  async remove(id: number): Promise<void> {
    const store = await this.storeRepository.findOneBy({ storeId: id });
    if (!store) {
      throw new NotFoundException(`Store with id ${id} not found`);
    }
    await this.storeRepository.remove(store);
  }

  async getOrderCountByStore(
    filterType?: 'day' | 'month' | 'year',
    filterValue?: string,
  ): Promise<any> {
    const queryBuilder = this.storeRepository
      .createQueryBuilder('store')
      .select('store.storeId', 'storeId')
      .addSelect('store.storeName', 'storeName')
      .addSelect('COUNT(order.orderId)', 'orderCount')
      .leftJoin('store.order', 'order');

    if (filterType === 'day') {
      queryBuilder.where('DATE(order.orderDate) = :filterValue', {
        filterValue,
      });
    } else if (filterType === 'month') {
      queryBuilder.where(
        'MONTH(order.orderDate) = :month AND YEAR(order.orderDate) = :year',
        {
          month: filterValue.split('-')[1],
          year: filterValue.split('-')[0],
        },
      );
    } else if (filterType === 'year') {
      queryBuilder.where('YEAR(order.orderDate) = :filterValue', {
        filterValue,
      });
    }

    queryBuilder.groupBy('store.storeId').addGroupBy('store.storeName');

    return await queryBuilder.getRawMany();
  }
}
