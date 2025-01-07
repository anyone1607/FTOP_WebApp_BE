import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './entities/store.entity';
import { Product } from '../product/entities/product.entity';
import { Order } from '../order/entities/order.entity';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}


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
  // async findAll(): Promise<Store[]> {
  //   return await this.storeRepository.find({ relations: ['vouchers','owner'] });
  // }

  async findAll(): Promise<any> {
    const stores = await this.storeRepository.find({
      relations: ['vouchers','owner'], // Lấy thông tin owner
    });
    const labels = this.getLast6Months();

    const result = await Promise.all(
      stores.map(async (store) => ({
        ...store,
        sales: {
          labels: labels,
          data: await this.getSalesDataByStore(store.storeId),
          data1: await this.getSalesDataByStore1(store.storeId),
        },
      })),
    );

    return result;
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
  // store details
  async getStoreWithProducts(storeId: number) {
    const store = await this.storeRepository.findOne({ where: { storeId } });
    if (!store) {
      throw new Error('Store not found');
    }
    const products = await this.productRepository.find({
      where: { storeId, status: true },
    });
    return { store, products };
  }


  // Get one store by id
  async findOne(id: number): Promise<Store> {
    const store = await this.storeRepository.findOne({
      where: { storeId: id },
      relations: ['vouchers', 'user'],
    });
    if (!store) {
      throw new NotFoundException(`Store with id ${id} not found`);
    }
    console.log(store);
    return store;
  }
 
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
    userId?: string,
    role?: string
  ): Promise<any> {
    const queryBuilder = this.storeRepository.createQueryBuilder('store')
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
  
    if (role === 'owner') {
      const ownerId = parseInt(userId, 10);
      queryBuilder.andWhere('store.ownerId = :ownerId', { ownerId });
    }

    queryBuilder.groupBy('store.storeId').addGroupBy('store.storeName');

    return await queryBuilder.getRawMany();
  }

  // hàm tính toán 6 tháng gần nhất
  // private getLast6Months(): string[] {
  //   const months = [
  //     'Jan',
  //     'Feb',
  //     'Mar',
  //     'Apr',
  //     'May',
  //     'Jun',
  //     'Jul',
  //     'Aug',
  //     'Sep',
  //     'Oct',
  //     'Nov',
  //     'Dec',
  //   ];
  //   const currentMonth = new Date().getMonth();
  //   const last6Months = [];
  //   for (let i = 5; i >= 0; i--) {
  //     const monthIndex = (currentMonth - i + 12) % 12;
  //     last6Months.push(months[monthIndex]);
  //   }
  //   return last6Months;
  // }

  private getLast6Months(): { month: string; year: number }[] {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const currentDate = new Date();
    const last6Months = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1,
      );
      last6Months.push({
        month: months[date.getMonth()],
        year: date.getFullYear(),
      });
    }

    return last6Months;
  }

  private async getSalesDataByStore(storeId: number): Promise<number[]> {
    const labels = this.getLast6Months();
    const salesData = [];

    for (const { month, year } of labels) {
      const monthIndex = new Date(`${month} 1, ${year}`).getMonth() + 1;

      const totalProducts = await this.orderRepository
        .createQueryBuilder('order')
        .where('order.storeId = :storeId', { storeId })
        .andWhere('order.orderStatus = :status', { status: true })
        .andWhere('MONTH(order.orderDate) = :month', { month: monthIndex })
        .andWhere('YEAR(order.orderDate) = :year', { year })
        .select('COUNT(order.orderId)', 'count')
        .getRawOne();

      salesData.push(Number(totalProducts.count) || 0);
    }

    return salesData;
  }

  private async getSalesDataByStore1(storeId: number): Promise<number[]> {
    const labels = this.getLast6Months();
    const salesData = [];

    for (const { month, year } of labels) {
      const monthIndex = new Date(`${month} 1, ${year}`).getMonth() + 1;

      const totalSales = await this.orderRepository
        .createQueryBuilder('order')
        .where('order.storeId = :storeId', { storeId })
        .andWhere('order.orderStatus = :status', { status: true })
        .andWhere('MONTH(order.orderDate) = :month', { month: monthIndex })
        .andWhere('YEAR(order.orderDate) = :year', { year })
        .select('SUM(order.totalPrice)', 'total')
        .getRawOne();

      salesData.push(Number(totalSales.total) || 0);
    }

    return salesData;
  }
}
