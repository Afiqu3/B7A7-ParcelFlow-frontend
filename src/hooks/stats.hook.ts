import { adminStats, merchantStats } from "@/api";
import { useQuery } from "@tanstack/react-query";

export const useMerchantStats = () => {
    return useQuery({
        queryKey: ["stats"],
        queryFn: merchantStats,
        retry: false,
    });
};

export const useAdminStats = () => {
    return useQuery({
        queryKey: ["admin-stats"],
        queryFn: adminStats,
        retry: false,
    });
};
