import apiClient from "@/lib/apiClient";
import type {
    ApiResponse,
    Merchant,
    MerchantParams,
    MerchantUpdatePayload,
} from "@/types";

export const getMerchantProfile = () => {
    return apiClient<ApiResponse<Merchant>>("/merchant/profile");
};

export const updateMerchantProfile = (payload: MerchantUpdatePayload) => {
    return apiClient("/merchant/update-profile", {
        method: "PATCH",
        body: payload,
    });
};

export const getAllMerchant = (params: MerchantParams) => {
    return apiClient<ApiResponse<Merchant[]>>("/merchant", {
        params,
    });
};

export const toggleMerchantUserStatus = (userId: string) => {
    return apiClient(`/merchant/${userId}/status`, {
        method: "PATCH",
    });
};
