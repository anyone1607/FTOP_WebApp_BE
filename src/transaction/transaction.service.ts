import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async countTotalTransactions(): Promise<number> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    return this.transactionRepository.count({
      where: {
        status: true,
        transactionDate: Between(startOfDay, endOfDay),
      },
    });
  }

  // list transaction userby receiveUserid
  async findTransactionsByReceiveUserId(
    receiveUserId: number,
  ): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: {
        receiveUserId,
        status: true,
        order: { orderStatus: true },
      },
      relations: ['order', 'receiveUser', 'transferUser'],
    });
  }


  // list transaction userby transferUserid (android)
  async findTransactionsByTransferUserId(
    transferUserId: number,
  ): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: {
        transferUserId,
        status: true,
        order: { orderStatus: true },
      },
      relations: ['order', 'receiveUser', 'transferUser'],
    });
  }

  // api thong ke doanh thu theo ngay thang nam
  async getRevenueByOrder(
    filterType?: 'day' | 'month' | 'year',
    filterValue?: string,
  ) {
    const query = this.transactionRepository
      .createQueryBuilder('transaction')
      .select('transaction.orderId', 'orderId')
      .addSelect('SUM(transaction.transactionAmount)', 'totalRevenue');
      
    if (filterType === 'day') {
      query.where('DATE(transaction.transactionDate) = :filterValue', {
        filterValue,
      });
    }
    else if (filterType === 'month') {
      query.where(
        'MONTH(transaction.transactionDate) = :month AND YEAR(transaction.transactionDate) = :year',
        {
          month: parseInt(filterValue.split('-')[1]),
          year: parseInt(filterValue.split('-')[0]),
        },
      );
    }
    else if (filterType === 'year') {
      query.where('YEAR(transaction.transactionDate) = :filterValue', {
        filterValue,
      });
    }

    const result = await query
      .groupBy('transaction.orderId')
      .orderBy('transaction.orderId', 'ASC')
      .getRawMany();
    if (!result.length) {
      return {
        message: `No revenue data found for ${filterType} ${filterValue}`,
        data: [],
      };
    }

    return result;
  }


  // api chuyen tien giua cac user voi nhau (android)
  async transferMoney(transferUserId: number, receiveUserId: number, amount: number, description: string): Promise<Transaction> {
    const transferUser = await this.userRepository.findOne({ where: { id: transferUserId } });
    const receiveUser = await this.userRepository.findOne({ where: { id: receiveUserId } });

    if(!transferUser) throw new NotFoundException('Transfer user not found');
    if(!receiveUser) throw new NotFoundException('Receive user not found');

    // if (transferUser.walletBalance - amount < 0) {
    //   throw new BadRequestException('Balance cannot be negative after transaction');
    // }

    if (transferUser.walletBalance < amount) {
      throw new BadRequestException({
        message: 'Insufficient balance',
        currentBalance: transferUser.walletBalance,
        requiredAmount: amount,
      });
    }

    transferUser.walletBalance -= amount;
    receiveUser.walletBalance += amount;

    console.log('Transfer User Balance:', transferUser.walletBalance);
    console.log('Receive User Balance:', receiveUser.walletBalance);


    await this.userRepository.save(transferUser);
    await this.userRepository.save(receiveUser);

    const updatedTransferUser = await this.userRepository.findOne({ where: { id: transferUserId } });
    const updatedReceiveUser = await this.userRepository.findOne({ where: { id: receiveUserId } });

    console.log('Updated Transfer User:', updatedTransferUser.walletBalance);
    console.log('Updated Receive User:', updatedReceiveUser.walletBalance);

    const transaction = this.transactionRepository.create({
      transferUserId,
      receiveUserId,
      transactionAmount: amount,
      transactionDate: new Date(),
      transactionDescription: description,
      status: true,
    })
    return this.transactionRepository.save(transaction);
  }

  async findAllTransactionsForUser(userId: number): Promise<Transaction[]> {
    return this.transactionRepository.createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.order', 'order')
      .leftJoinAndSelect('transaction.receiveUser', 'receiveUser')
      .leftJoinAndSelect('transaction.transferUser', 'transferUser')
      .where('transaction.transferUserId = :userId', { userId })
      .orWhere('transaction.receiveUserId = :userId', { userId })
      .getMany();
  }

}
