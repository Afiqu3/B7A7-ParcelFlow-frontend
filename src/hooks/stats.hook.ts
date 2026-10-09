import { adminStats, merchantStats, riderStats } from "@/api";
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

export const useRiderStats = () => {
    return useQuery({
        queryKey: ["rider-stats"],
        queryFn: riderStats,
        retry: false,
    });
};
