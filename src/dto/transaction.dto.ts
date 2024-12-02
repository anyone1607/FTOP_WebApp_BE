export class CreateTransactionDto {
    transferUserId: number;
    receiveUserId: number;
    amount: number;
    description: string;
}