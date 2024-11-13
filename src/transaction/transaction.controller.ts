import { Controller, Get } from '@nestjs/common';
import { TransactionService } from './transaction.service';
@Controller('transaction')
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) {}

    @Get('countTransaction')
    async countTotalTransactions(): Promise<{ totalTransactions: number }> {
        const totalTransactions = await this.transactionService.countTotalTransactions();
        return { totalTransactions };
    }
}
