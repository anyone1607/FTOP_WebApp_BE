import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Patch,
  Delete,
  Query
} from '@nestjs/common';
import { StoreService } from './store.service';
import { Store } from './entities/store.entity';
@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}
  // create a new store
  @Post()
  create(@Body() storeData: Partial<Store>): Promise<Store> {
    return this.storeService.create(storeData);
  }
  
  @Get('order-count')
  async getOrderCountByStore(
    @Query('filterType') filterType?: 'day' | 'month' | 'year',
    @Query('filterValue') filterValue?: string,
  ) {
    return await this.storeService.getOrderCountByStore(
      filterType,
      filterValue,
    );
  }
  // get all stores
  @Get()
  findAll(): Promise<Store[]> {
    return this.storeService.findAll();
  }
  // get a store by id
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Store> {
    return this.storeService.findOne(id);
  }
  //update a store by id
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() storeData: Partial<Store>,
  ): Promise<Store> {
    return this.storeService.update(id, storeData);
  }
  // delete a store by id
  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.storeService.remove(id);
  }

}
