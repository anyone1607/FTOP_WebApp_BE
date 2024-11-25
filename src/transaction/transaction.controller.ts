import { BadRequestException, Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
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

  // http://localhost:8000/api/transaction/transfer/26
  @Get('transfer/:transferUserId')
  async findByTransferUserIdWithConditions(
    @Param('transferUserId', ParseIntPipe) transferUserId: number,
  ): Promise<Transaction[]> {
    return this.transactionService.findTransactionsByTransferUserId(
      transferUserId,
    );
  }

  @Get('all-transactions/:userId')
async findAllTransactionsForUser(
  @Param('userId', ParseIntPipe) userId: number,
): Promise<Transaction[]> {
  return this.transactionService.findAllTransactionsForUser(userId);
}

  @Post('transfer')
  async transferMoney(@Body() body: any) {
    const { transferUserId, receiveUserId, amount, description } = body;

    if (!transferUserId || !receiveUserId || !amount || amount <= 0) {
      throw new BadRequestException('Invalid transfer details');
    }

    return this.transactionService.transferMoney(transferUserId, receiveUserId, amount, description);
  }

  //api cho chức năng chuyển tiền order android
@Post('place-order-transaction')
async placeOrderWithTransaction(@Body() body: any): Promise<any> {
  const { userId, storeId, voucherId, products, note, totalPrice } = body;

  if (!userId || !storeId || !products || !totalPrice || totalPrice <= 0) {
    throw new BadRequestException('Invalid order details');
  }

  return this.transactionService.placeOrderWithTransaction(userId, storeId, voucherId, products, note, totalPrice);
}

@Get('summary/:userId')
  async getTransactionSummary(@Param('userId') userId: number) {
    return this.transactionService.getTransactionSummary(userId);
  }

}
