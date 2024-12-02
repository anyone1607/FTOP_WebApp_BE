import { Test, TestingModule } from '@nestjs/testing';
import { Voucher } from './entities/voucher.entity';
import { VoucherController } from './voucher.controller';
import { VoucherService } from './voucher.service';

const mockVouchers: Voucher[] = [
  {
    voucherId: 1,
    voucherName: 'Discount10',
    voucherDiscount: 10,
    store: null,
    expiredDate: new Date('2024-12-31'),
    createdDate: new Date('2024-01-01'),
    isDeleted: false,
    deletedAt: null,
    order: [],
  },
  {
    voucherId: 2,
    voucherName: 'Discount20',
    voucherDiscount: 20,
    store: null,
    expiredDate: new Date('2024-11-30'),
    createdDate: new Date('2024-01-01'),
    isDeleted: true,
    deletedAt: new Date('2024-06-01'),
    order: [],
  },
];

const mockVoucherService = {
  findAll: jest.fn().mockResolvedValue(mockVouchers.filter((v) => !v.isDeleted)),
  getDeletedVouchers: jest.fn().mockResolvedValue(mockVouchers.filter((v) => v.isDeleted)),
  findOne: jest.fn((id) => Promise.resolve(mockVouchers.find((v) => v.voucherId === id))),
  create: jest.fn((voucherData) => Promise.resolve({ ...voucherData, voucherId: 3 })),
  update: jest.fn((id, data) => Promise.resolve({ ...mockVouchers.find((v) => v.voucherId === id), ...data })),
  softDelete: jest.fn((id) => Promise.resolve()),
  restore: jest.fn((id) => Promise.resolve()),
  permanentlyDelete: jest.fn((id) => Promise.resolve()),
};

describe('VoucherController', () => {
  let controller: VoucherController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VoucherController],
      providers: [
        {
          provide: VoucherService,
          useValue: mockVoucherService,
        },
      ],
    }).compile();

    controller = module.get<VoucherController>(VoucherController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all non-deleted vouchers', async () => {
    const result = await controller.findAll();
    expect(result).toEqual(mockVouchers.filter((v) => !v.isDeleted));
  });

  it('should return all deleted vouchers', async () => {
    const result = await controller.getDeletedVouchers();
    expect(result).toEqual(mockVouchers.filter((v) => v.isDeleted));
  });

  it('should create a new voucher', async () => {
    const newVoucher = {
      voucherName: 'Discount30',
      voucherDiscount: 30,
      expiredDate: new Date('2025-12-31'),
      createdDate: new Date(),
    };
    const result = await controller.create(newVoucher);
    expect(result).toEqual({ ...newVoucher, voucherId: 3 });
  });

  it('should find a voucher by ID', async () => {
    const result = await controller.findOne(1);
    expect(result).toEqual(mockVouchers[0]);
  });

  it('should update a voucher by ID', async () => {
    const updatedData = { voucherDiscount: 15 };
    const result = await controller.update(1, updatedData);
    expect(result.voucherDiscount).toBe(15);
  });

  it('should soft delete a voucher by ID', async () => {
    await controller.softDelete(1);
    expect(mockVoucherService.softDelete).toHaveBeenCalledWith(1);
  });

  it('should restore a deleted voucher by ID', async () => {
    await controller.restore(2);
    expect(mockVoucherService.restore).toHaveBeenCalledWith(2);
  });

  it('should permanently delete a voucher by ID', async () => {
    await controller.permanentlyDelete(2);
    expect(mockVoucherService.permanentlyDelete).toHaveBeenCalledWith(2);
  });
});