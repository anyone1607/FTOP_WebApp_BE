import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Voucher } from '../voucher/entities/voucher.entity';
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
      store: { storeId: 1, storeName: 'Store 1' },
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
      store: { storeId: 2, storeName: 'Store 2' },
      order: [],
    },
  ];

  const mockRepository = {
    find: jest.fn().mockImplementation((options) =>
      Promise.resolve(
        options.where.isDeleted
          ? mockVouchers.filter((v) => v.isDeleted)
          : mockVouchers.filter((v) => !v.isDeleted),
      ),
    ),
    findOne: jest.fn().mockImplementation((options) =>
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

  it('should validate and create a voucher if it does not exist', async () => {
    const newVoucherDetails = {
      voucherName: 'Discount30',
      voucherDiscount: 30,
      expiredDate: new Date('2025-12-31'),
      createdDate: new Date(),
      storeId: 1,
      isDeleted: false,
      deletedAt: null,
      order: [],
    };
    mockRepository.findOne.mockResolvedValueOnce(null);
    const result = await service.validateVoucher(newVoucherDetails);
    expect(repository.create).toHaveBeenCalledWith(newVoucherDetails);
    expect(repository.save).toHaveBeenCalled();
    expect(result).toEqual(expect.objectContaining(newVoucherDetails));
  });

  it('should fetch all non-deleted vouchers', async () => {
    const result = await service.findAll(1, 'user');
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
      voucherName: 'Discount40',
      voucherDiscount: 40,
      expiredDate: new Date('2025-12-31'),
      createdDate: new Date(),
      store: null ,
      isDeleted: false,
      deletedAt: null,
      order: [],
    };
    const result = await service.create(newVoucherData);
    expect(repository.create).toHaveBeenCalledWith(newVoucherData);
    expect(repository.save).toHaveBeenCalledWith(expect.objectContaining(newVoucherData));
    expect(result).toEqual(expect.objectContaining(newVoucherData));
  });

  it('should soft delete a voucher', async () => {
    await service.softDelete(1);
    expect(repository.save).toHaveBeenCalledWith(
      expect.objectContaining({ isDeleted: true, deletedAt: expect.any(Date) }),
    );
  });

  it('should restore a deleted voucher', async () => {
    const updatedDates = { expiredDate: '2025-12-31', createDate: '2024-01-01' };
    await service.restore(2, updatedDates.expiredDate, updatedDates.createDate);
    expect(repository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        isDeleted: false,
        deletedAt: null,
        expiredDate: new Date(updatedDates.expiredDate),
        createdDate: new Date(updatedDates.createDate),
      }),
    );
  });

  it('should permanently delete a voucher', async () => {
    await service.permanentlyDelete(2);
    expect(repository.delete).toHaveBeenCalledWith(2);
  });
});
