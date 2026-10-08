import apiClient from "@/lib/apiClient";
import { toAdminStats, toMerchantStats } from "@/lib/stats";
import type { AdminStats, ApiResponse, MerchantStats } from "@/types";

export const merchantStats = async () => {
    const res = await apiClient<ApiResponse<MerchantStats>>("/stats/merchant");
    return {
        ...res,
        data: res.data ? toMerchantStats(res.data) : res.data,
    };
};

export const adminStats = async () => {
    const res = await apiClient<ApiResponse<AdminStats>>("/stats/admin");
    return {
        ...res,
        data: res.data ? toAdminStats(res.data) : res.data,
    };
};
