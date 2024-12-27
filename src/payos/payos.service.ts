import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import PayOS from '@payos/node';
import { BankTransfer } from '../banktransfer/entities/banktransfer.entity';
import { User } from '../user/entities/user.entity';
import { ConfigService } from '@nestjs/config';
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
  async topUp(
    walletUserId: number,
    amount: number,
    description: string,
  ) {
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

  // rút tiền qua payos (limited) web
  async withdrawMoney(walletUserId: number, amount: number, bankName: string, accountNumber: number) {
    const user = await this.userRepository.findOne({
      where: { id: walletUserId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.walletBalance < amount) {
      throw new Error('Insufficient funds');
    }

    const bankTransfer = this.bankTransferRepository.create({
      walletUserId,
      transferType: false,
      bankName,
      accountNumber,
      transferAmount: amount,
      transferDescription: `Rút tiền từ tài khoản ${walletUserId}`,
      transferDate: new Date(),
      status: false,
    });

    await this.bankTransferRepository.save(bankTransfer);

    return {
      message: 'Withdrawal request created successfully',
      user,
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

    if (status === true && bankTransfer.status === false) {
      bankTransfer.status = true;
      await this.bankTransferRepository.save(bankTransfer);

      bankTransfer.user.walletBalance = bankTransfer.user.walletBalance + bankTransfer.transferAmount;
      await this.userRepository.save(bankTransfer.user);

      return {
        message: 'Transaction completed successfully',
        user: bankTransfer.user,
      };
    }

    return { message: 'Transaction already processed or invalid status' };
  }

  async getAllTransactions() {
    return await this.bankTransferRepository.find({ relations: ['user'] });
  }



}
