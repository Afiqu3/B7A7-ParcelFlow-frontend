import apiClient from "@/lib/apiClient";
import type { ApiResponse, Merchant } from "@/types";

export const getMerchantProfile = () => {
    return apiClient<ApiResponse<Merchant>>("/merchant/profile");
};