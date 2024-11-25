export type UserDetails = {
    email: string;
    displayName: string;
    avatar: string;
    role: string;
    password: string;
    walletBalance: number;
    isActive: boolean;
}

export type OrderDetails = {
    userId: number;
    storeId: number;
    orderStatus: boolean;
    orderDate: Date;
    voucherId: number;
    note: string;
    totalPrice: number;
}

export type VoucherDetails = {
    voucherName: string;
    voucherDiscount: number;
    storeId: number;
    expiredDate: Date;
    createdDate: Date;
    isDeleted: boolean;
    deletedAt: Date;
}

