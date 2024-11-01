export type UserDetails = {
    email: string;
    displayName: string;
    role: string;
    password: string;
    walletBalance: number;
    isActive: boolean;
}

export type VoucherDetails = {
    voucherName: string;
    voucherDiscount: number;
    storeId: number;
    expiredDate: Date;
    createdDate: Date;
}