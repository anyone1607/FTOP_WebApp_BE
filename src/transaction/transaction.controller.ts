import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Transaction } from './entities/transaction.entity';
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get('countTransaction')
  async countTotalTransactions(): Promise<{ totalTransactions: number }> {
    const totalTransactions =
      await this.transactionService.countTotalTransactions();
    return { totalTransactions };
  }

  @Get('revenue-by-order')
  async getRevenueByOrder() {
    return await this.transactionService.getRevenueByOrder();
  }

  @Get('search/:receiveUserId')
  async findByReceiveUserIdWithConditions(
    @Param('receiveUserId', ParseIntPipe) receiveUserId: number,
  ): Promise<Transaction[]> {
    return this.transactionService.findTransactionsByReceiveUserId(
      receiveUserId,
    );
  }
}
