import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import PayOS from '@payos/node';
import { BankTransfer } from '../banktransfer/entities/banktransfer.entity';
import { User } from '../user/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { HttpStatus } from 'src/global/globalEnum';
@Injectable()
export class PayosService {
  private payos: any;

  constructor(
    @InjectRepository(BankTransfer)
    private bankTransferRepository: Repository<BankTransfer>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
  ) {
    try {
      this.payos = new PayOS(
        this.configService.get<string>('PAYOS_CLIENT_ID'),
        this.configService.get<string>('PAYOS_API_KEY'),
        this.configService.get<string>('PAYOS_CHECKSUM_KEY'),
      );
      // console.log('PayOS initialized successfully');
    } catch (error) {
      console.error('Error initializing PayOS:', error);
      throw new Error('Failed to initialize PayOS');
    }
  }

  // nạp tiền qua payos (limited)
  async topUp(walletUserId: number, amount: number, description: string) {
    const user = await this.userRepository.findOne({
      where: { id: walletUserId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const paymentLink = await this.payos.createPaymentLink({
      amount,
      description: `Nạp tiền vào tài khoản ${walletUserId}`,
      orderCode: Math.floor(Math.random() * 1000000000),
      returnUrl: 'https://your-domain.com/success',
      cancelUrl: 'https://your-domain.com/cancel',
    });

    const bankTransfer = this.bankTransferRepository.create({
      walletUserId,
      transferType: true,
      transferAmount: amount,
      transferDescription: description,
      transferDate: new Date(),
      status: false,
    });

    await this.bankTransferRepository.save(bankTransfer);

    return {
      message: 'Payment link created successfully',
      user,
      paymentLink,
    };
  }

  async updateTransactionStatus(transferId: number, status: boolean) {
    const bankTransfer = await this.bankTransferRepository.findOne({
      where: { transferId },
      relations: ['user'],
    });

    if (!bankTransfer) {
      throw new Error('Transaction not found');
    }

    if (bankTransfer.status === true && status === false) {
      throw new Error('Cannot reject a successful transaction');
    }

    if (status === true && bankTransfer.status === false) {
      bankTransfer.status = true;
      await this.bankTransferRepository.save(bankTransfer);

      bankTransfer.user.walletBalance += bankTransfer.transferAmount;
      await this.userRepository.save(bankTransfer.user);

      return {
        message: 'Transaction completed successfully',
        user: bankTransfer.user,
      };
    }

    if (status === false && bankTransfer.status === false) {
      bankTransfer.status = false;
      await this.bankTransferRepository.save(bankTransfer);
      return { message: 'Transaction rejected' };
    }

    return { message: 'No changes made' };
  }

  async getAllTransactions() {
    return await this.bankTransferRepository.find({ relations: ['user'] });
  }

  async withdraw(
    walletUserId: number,
    amount: number,
    bankName: string,
    accountNumber: number,
  ) {
    if (amount < 5000 || amount > 300000000) {
      throw new HttpException(
        ['Số tiền rút phải từ 50,000 đến 300,000,000'],
        HttpStatus.BAD_REQUEST,
      );
    }

    const owner = await this.userRepository.findOne({
      where: { id: walletUserId },
    });

    if (!owner) {
      throw new HttpException(
        ['Người dùng không tồn tại'],
        HttpStatus.NOT_FOUND,
      );
    }

    const errors = [];
    if (owner.walletBalance < amount) {
      errors.push('Số dư không đủ để thực hiện giao dịch');
    }
    if (owner.role !== 'owner' && owner.role !== 'student') {
      errors.push('Người dùng không có quyền rút tiền');
    }

    if (errors.length > 0) {
      throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    }

    // owner.walletBalance -= amount;
    console.log('Số dư ban đầu:', owner.walletBalance);
    owner.walletBalance -= amount;
    console.log('Số dư sau khi trừ:', owner.walletBalance);
    await this.userRepository.save(owner);

    const bankTransfer = this.bankTransferRepository.create({
      walletUserId: owner.id,
      accountNumber: accountNumber ? Number(accountNumber) : null,
      bankName: bankName || null,
      transferType: false,
      transferAmount: amount,
      transferDescription: 'Rút tiền',
      transferDate: new Date(),
      status: true,
    });

    const savedTransfer = await this.bankTransferRepository.save(bankTransfer);
    if (!savedTransfer) {
      throw new HttpException(
        ['Lỗi lưu giao dịch, vui lòng thử lại sau'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      message: 'Rút tiền thành công',
      balance: owner.walletBalance,
      transaction: savedTransfer,
    };
  }
}
