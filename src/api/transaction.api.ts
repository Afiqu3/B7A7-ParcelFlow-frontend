import apiClient from "@/lib/apiClient";
import type { ApiResponse, Transaction, TransactionParams } from "@/types";

export const getAllMyTransactions = async (params: TransactionParams) => {
    return apiClient<ApiResponse<Transaction[]>>("/transaction/my-transactions", {
        params,
    });
};

export const getAllTransactions = async (params: TransactionParams) => {
    return apiClient<ApiResponse<Transaction[]>>("/transaction/all-transactions", {
        params,
    });
};