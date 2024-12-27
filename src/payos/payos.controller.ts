import { Body, Controller, Get, Post } from '@nestjs/common';
import { PayosService } from './payos.service';

@Controller('payos')
export class PayosController {
  constructor(private readonly payosService: PayosService) {}

  @Post('topup')
  async topUp(
    @Body() body: { walletUserId: number; amount: number; description: string }
  ) {
    const { walletUserId, amount, description } = body;

    try {
      const result = await this.payosService.topUp(walletUserId, amount, description);
      return result;
    } catch (error) {
      console.error('Error during top-up:', error);
      throw new Error('Unable to top-up account. Please try again later.');
    }
  }

  // bug: withdrawMoney is not defined
  @Post('withdraw')
  async withdraw(
    @Body() body: { walletUserId: number; amount: number; bankName: string; accountNumber: number }
  ) {
    const { walletUserId, amount, bankName, accountNumber } = body;

    try {
      const result = await this.payosService.withdrawMoney(walletUserId, amount, bankName, accountNumber);
      return result;
    } catch (error) {
      console.error('Error during withdrawal:', error);
      throw new Error('Unable to withdraw funds. Please try again later.');
    }
  }

  @Post('update-transaction-status')
  async updateTransactionStatus(@Body() body: { transferId: number; status: boolean }) {
    const { transferId, status } = body;

    try {
      const result = await this.payosService.updateTransactionStatus(transferId, status);
      return result;
    } catch (error) {
      console.error('Error updating transaction status:', error);
      throw new Error('Unable to update transaction status. Please try again later.');
    }
  }

  @Get('transactions')
  async getAllTransactions() {
    try {
      const transactions = await this.payosService.getAllTransactions();
      return transactions;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw new Error('Unable to fetch transactions. Please try again later.');
    }
  }

}
