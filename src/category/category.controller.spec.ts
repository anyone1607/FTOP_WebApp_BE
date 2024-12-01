import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';

const mockCategoryData: Category[] = [
  { categoryId: 1, categoryName: 'Electronics' },
  { categoryId: 2, categoryName: 'Books' },
];

const mockCategoryService = {
  findAll: jest.fn().mockResolvedValue(mockCategoryData),
};

describe('CategoryController', () => {
  let controller: CategoryController;
  let service: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CategoryService,
          useValue: mockCategoryService,
        },
      ],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
    service = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all categories', async () => {
    const result = await controller.findAll();
    expect(result).toEqual(mockCategoryData);
    expect(service.findAll).toHaveBeenCalled();
  });
});