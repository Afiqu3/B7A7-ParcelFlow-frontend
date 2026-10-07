import apiClient from "@/lib/apiClient";
import { toMerchantStats } from "@/lib/stats";
import type { ApiResponse, MerchantStats } from "@/types";

export const merchantStats = async () => {
    const res = await apiClient<ApiResponse<MerchantStats>>("/stats/merchant");
    return {
        ...res,
        data: res.data ? toMerchantStats(res.data) : res.data,
    };
};
