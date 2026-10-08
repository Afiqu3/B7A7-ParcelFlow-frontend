import type { TransactionStatus } from "./parcel.type";

export interface Transaction {
    id: string;
    amount: string;
    status: TransactionStatus;
    currency: string;
    bkashTrxID?: string;
    paidAt?: string;
    refundedAmount?: string;
    refundedAt?: string;
    refundReason?: string;
    refundTxID?: string;
    parcel: {
        trackingId: string;
        merchant: {
            name: string;
        };
    };
}

export interface TransactionParams {
    page?: number; // defaults to 1
    limit?: number; // defaults to 10
    sortOrder?: "desc" | "asc";
}
