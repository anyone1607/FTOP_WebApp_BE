import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Patch,
  Delete,
  Query,
  UploadedFile,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Store } from './entities/store.entity';
@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) { }

  @Post()
  @UseInterceptors(
    FilesInterceptor('storeImage', 10, {
      storage: diskStorage({
        destination: './uploads/store',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async create(
    @Body() storeData: Partial<Store>,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<Store> {
    try {
      console.log('Received files:', files);
      if (files && files.length > 0) {
        storeData.storeImage = files.map(file => `/uploads/store/${file.filename}`);
      }
      console.log('Store data:', storeData);
      return await this.storeService.create(storeData);
    } catch (error) {
      console.error(error);
      throw new Error('Error creating store');
    }
  }

  @Get('order-count')
async getOrderCountByStore(
  @Query('filterType') filterType?: 'day' | 'month' | 'year',
  @Query('filterValue') filterValue?: string,
  @Query('userId') userId?: string,
  @Query('role') role?: string
) {
  return await this.storeService.getOrderCountByStore(
    filterType,
    filterValue,
    userId,
    role
  );
}
  // get all stores
  @Get()
  findAll(): Promise<Store[]> {
    return this.storeService.findAll();
  }

  // get 4 new stores
  @Get('new')
  findNewStores(): Promise<Store[]> {
    return this.storeService.findLatestedStores();
  }
  // get a store by id
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Store> {
    return this.storeService.findOne(id);
  }

@Patch(':id')
@UseInterceptors(
  FilesInterceptor('newImages', 10, {
    storage: diskStorage({
      destination: './uploads/store',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      },
    }),
  }),
)
async update(
  @Param('id') id: number,
  @Body() storeData: Partial<Store>,
  @UploadedFiles() files: Express.Multer.File[],
  @Body('existingImages') existingImages: string[],
): Promise<Store> {
  try {
    console.log(`Received update request for store ID: ${id}`);
    if (files && files.length > 0) {
      const newImages = files.map(file => `/uploads/store/${file.filename}`);
      storeData.storeImage = [...(storeData.storeImage || []), ...newImages];
    }
    if (existingImages) {
      storeData.storeImage = [...(storeData.storeImage || []), ...existingImages];
    }
    return await this.storeService.updateStore(storeData, id);
  } catch (error) {
    console.error('Error updating store:', error);
    throw new Error('Error updating store');
  }
}
  @Patch(':id/main-image')
  async updateMainImage(
    @Param('id') id: number,
    @Body('storeImage') storeImage: string[],
  ): Promise<Store> {
    try {
      console.log(`Received request to update main image for store ID: ${id}`);
      return await this.storeService.updateMainImage(id, storeImage);
    } catch (error) {
      console.error('Error updating main image:', error);
      throw new Error('Error updating main image');
    }
  }
  // delete a store by id
  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.storeService.remove(id);
  }
}
