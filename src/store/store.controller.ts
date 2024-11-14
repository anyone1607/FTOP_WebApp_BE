import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put
} from '@nestjs/common';
import { Store } from './entities/store.entity';
import { StoreService } from './store.service';
@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}
  // create a new store
  @Post()
  create(@Body() storeData: Partial<Store>): Promise<Store> {
    return this.storeService.create(storeData);
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
  @Put('/:id')
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
