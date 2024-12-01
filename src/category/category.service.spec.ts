import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';

const mockCategoryData: Category[] = [
  { categoryId: 1, categoryName: 'Electronics' },
  { categoryId: 2, categoryName: 'Books' },
];

const mockRepository = {
  find: jest.fn().mockResolvedValue(mockCategoryData),
};

describe('CategoryService', () => {
  let service: CategoryService;
  let repository: Repository<Category>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getRepositoryToken(Category),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    repository = module.get<Repository<Category>>(getRepositoryToken(Category));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all categories', async () => {
    const result = await service.findAll();
    expect(result).toEqual(mockCategoryData);
    expect(repository.find).toHaveBeenCalled();
  });
});