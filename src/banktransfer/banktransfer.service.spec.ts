import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { BanktransferService } from './banktransfer.service';
import { BankTransfer } from './entities/banktransfer.entity';

describe('BanktransferService', () => {
  let service: BanktransferService;
  let repository: Repository<BankTransfer>;

  const mockBankTransferRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
  };

  const mockUser = new User();
  mockUser.id = 1;
  mockUser.displayName = 'testuser';

  const mockBankTransfer = new BankTransfer();
  mockBankTransfer.transferId = 1;
  mockBankTransfer.walletUserId = 1;
  mockBankTransfer.user = mockUser;
  mockBankTransfer.accountNumber = 123456;
  mockBankTransfer.bankName = 'Test Bank';
  mockBankTransfer.transferType = true;
  mockBankTransfer.transferAmount = 100;
  mockBankTransfer.transferDescription = 'Top-up';
  mockBankTransfer.transferDate = new Date();
  mockBankTransfer.status = true;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BanktransferService,
        {
          provide: getRepositoryToken(BankTransfer),
          useValue: mockBankTransferRepository,
        },
      ],
    }).compile();

    service = module.get<BanktransferService>(BanktransferService);
    repository = module.get<Repository<BankTransfer>>(getRepositoryToken(BankTransfer));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getBankTransferInfo', () => {
    it('should return bank transfer info by walletUserId', async () => {
      mockBankTransferRepository.findOne.mockResolvedValue(mockBankTransfer);
      const result = await service.getBankTransferInfo(1);
      expect(result).toEqual(mockBankTransfer);
      expect(mockBankTransferRepository.findOne).toHaveBeenCalledWith({
        where: { walletUserId: 1 },
        relations: ['user'],
      });
    });
  });

  describe('findTransfersByUserId', () => {
    it('should return a list of transfers by walletUserId', async () => {
      mockBankTransferRepository.find.mockResolvedValue([mockBankTransfer]);
      const result = await service.findTransfersByUserId(1);
      expect(result).toEqual([mockBankTransfer]);
      expect(mockBankTransferRepository.find).toHaveBeenCalledWith({
        where: { walletUserId: 1 },
      });
    });
  });
});
