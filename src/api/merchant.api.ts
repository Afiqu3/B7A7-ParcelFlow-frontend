import apiClient from "@/lib/apiClient";
import type { ApiResponse, Merchant, MerchantUpdatePayload } from "@/types";

export const getMerchantProfile = () => {
    return apiClient<ApiResponse<Merchant>>("/merchant/profile");
};

export const updateMerchantProfile = (payload: MerchantUpdatePayload) => {
    return apiClient("/merchant/update-profile", {
        method: "PATCH",
        body: payload,
    });
};