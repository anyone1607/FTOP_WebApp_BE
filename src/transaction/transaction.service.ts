import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
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

}
