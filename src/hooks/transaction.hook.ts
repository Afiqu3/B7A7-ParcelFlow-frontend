import { getAllMyTransactions } from "@/api";
import type { TransactionParams } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useGetAllMyTransactions = (params: TransactionParams) => {
    return useQuery({
        queryKey: ["my-transactions", params],
        queryFn: () => getAllMyTransactions(params),
    });
};
