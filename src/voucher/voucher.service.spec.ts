import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Voucher } from './entities/voucher.entity';
import { VoucherService } from './voucher.service';

describe('VoucherService', () => {
  let service: VoucherService;
  let repository: Repository<Voucher>;

  const mockVouchers = [
    {
      voucherId: 1,
      voucherName: 'Discount10',
      voucherDiscount: 10,
      isDeleted: false,
      deletedAt: null,
      expiredDate: new Date('2024-12-31'),
      createdDate: new Date('2024-01-01'),
      store: null,
      order: [],
    },
    {
      voucherId: 2,
      voucherName: 'Discount20',
      voucherDiscount: 20,
      isDeleted: true,
      deletedAt: new Date('2024-06-01'),
      expiredDate: new Date('2024-11-30'),
      createdDate: new Date('2024-01-01'),
      store: null,
      order: [],
    },
  ];

  const mockRepository = {
    find: jest.fn((options) =>
      Promise.resolve(
        options.where.isDeleted
          ? mockVouchers.filter((v) => v.isDeleted)
          : mockVouchers.filter((v) => !v.isDeleted),
      ),
    ),
    findOne: jest.fn((options) =>
      Promise.resolve(
        mockVouchers.find((v) => v.voucherId === options.where.voucherId),
      ),
    ),
    create: jest.fn((voucherData) => ({ ...voucherData })),
    save: jest.fn((voucher) => Promise.resolve(voucher)),
    delete: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VoucherService,
        {
          provide: getRepositoryToken(Voucher),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<VoucherService>(VoucherService);
    repository = module.get<Repository<Voucher>>(getRepositoryToken(Voucher));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fetch non-deleted vouchers', async () => {
    const result = await service.findAll();
    expect(result).toEqual(mockVouchers.filter((v) => !v.isDeleted));
  });

  it('should fetch deleted vouchers', async () => {
    const result = await service.getDeletedVouchers();
    expect(result).toEqual(mockVouchers.filter((v) => v.isDeleted));
  });

  it('should find a voucher by ID', async () => {
    const result = await service.findOne(1);
    expect(result).toEqual(mockVouchers[0]);
  });

  it('should create a new voucher', async () => {
    const newVoucherData = {
      voucherName: 'Discount30',
      voucherDiscount: 30,
      expiredDate: new Date('2025-12-31'),
      createdDate: new Date(),
      store: null, // Set to null or an appropriate mock if needed.
      isDeleted: false,
      deletedAt: null,
      order: [], // Use an empty array or a valid mock structure for orders.
    };
    expect(await service.create(newVoucherData)).toEqual({
      voucherId: undefined,
      ...newVoucherData,
    });
    expect(repository.save).toHaveBeenCalled();
  });

  it('should soft delete a voucher', async () => {
    await service.softDelete(1);
    expect(mockRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ isDeleted: true }),
    );
  });

  it('should restore a deleted voucher', async () => {
    await service.restore(2);
    expect(mockRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ isDeleted: false, deletedAt: null }),
    );
  });

  it('should permanently delete a voucher', async () => {
    await service.permanentlyDelete(2);
    expect(mockRepository.delete).toHaveBeenCalledWith(2);
  });
});
