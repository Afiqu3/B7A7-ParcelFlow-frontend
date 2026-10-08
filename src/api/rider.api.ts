import apiClient from "@/lib/apiClient";
import type {
    ApiResponse,
    ApplyAsRiderPayload,
    ApproveRiderPayload,
    Rider,
    RiderParams,
    VerifyEmailPayload,
} from "@/types";

export const applyAsRider = (payload: ApplyAsRiderPayload) => {
    const formData = new FormData();

    formData.append("data", JSON.stringify(payload.data));
    formData.append("vehiclePaper", payload.vehiclePaper);

    return apiClient("/rider/apply", {
        method: "POST",
        body: formData,
    });
};

export const verifyRiderAccount = (payload: VerifyEmailPayload) => {
    return apiClient("/rider/apply/verify-email", {
        method: "POST",
        body: payload,
    });
};

export const getAllRider = (params: RiderParams) => {
    return apiClient<ApiResponse<Rider[]>>("/rider", {
        params,
    });
};

export const getSingleRider = (riderId: string) => {
    return apiClient<ApiResponse<Rider>>(`/rider/${riderId}`);
};

export const toggleRiderUserStatus = (userId: string) => {
    return apiClient(`/rider/${userId}/status`, {
        method: "PATCH",
    });
};

export const approveOrRejectRider = (payload: ApproveRiderPayload) => {
    return apiClient("/rider/approve", {
        method: "POST",
        body: payload,
    });
};
