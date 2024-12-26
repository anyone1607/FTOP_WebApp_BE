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

  // nạp tiền qua payos (successfully)
  // async createPayment(amount: number, description: string) {
  //   const orderCode = Math.floor(Math.random() * 1000000000);
  //   const paymentData = {
  //     amount,
  //     description,
  //     orderCode,
  //     returnUrl: 'https://your-domain.com/success',
  //     cancelUrl: 'https://your-domain.com/cancel',
  //   };

  //   try {
  //     console.log('Creating payment with data:', paymentData);
  //     const paymentLink = await this.payos.createPaymentLink(paymentData);
  //     return paymentLink;
  //   } catch (error) {
  //     console.error('Error creating payment link:', error);
  //     throw new Error('Failed to create payment link');
  //   }
  // }

  // nạp tiền qua payos (limited)
  async topUp(
    walletUserId: number,
    amount: number,
    accountNumber: number,
    bankName: string,
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
      description,
      orderCode: Math.floor(Math.random() * 1000000000),
      returnUrl: 'https://your-domain.com/success',
      cancelUrl: 'https://your-domain.com/cancel',
    });

    const bankTransfer = this.bankTransferRepository.create({
      walletUserId,
      accountNumber,
      bankName,
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

    if (status === true && bankTransfer.status === false) {
      bankTransfer.status = true;
      await this.bankTransferRepository.save(bankTransfer);

      // Đảm bảo walletBalance là kiểu số trước khi cộng
      bankTransfer.user.walletBalance =
        parseFloat(bankTransfer.user.walletBalance.toString()) +
        bankTransfer.transferAmount;
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
