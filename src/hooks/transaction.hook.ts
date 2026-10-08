import { getAllMyTransactions, getAllTransactions } from "@/api";
import type { TransactionParams } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useGetAllMyTransactions = (params: TransactionParams) => {
    return useQuery({
        queryKey: ["my-transactions", params],
        queryFn: () => getAllMyTransactions(params),
    });
};

export const useGetAllTransactions = (params: TransactionParams) => {
    return useQuery({
        queryKey: ["transactions", params],
        queryFn: () => getAllTransactions(params),
    });
};
