export class DepositDto {
    walletUserId: number;
    transferAmount: number;
    accountNumber: number;
    bankName: string;
    transferType: boolean;
    transferDescription: string;
    transferDate: Date;
}