import apiClient from "@/lib/apiClient";
import { toAdminStats, toMerchantStats, toRiderStats } from "@/lib/stats";
import type { AdminStats, ApiResponse, MerchantStats, RiderStats } from "@/types";

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

export const riderStats = async () => {
    const res = await apiClient<ApiResponse<RiderStats>>("/stats/rider");
    return {
        ...res,
        data: res.data ? toRiderStats(res.data) : res.data,
    };
};
