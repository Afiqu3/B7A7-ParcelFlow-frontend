import apiClient from "@/lib/apiClient";
import { ApplyAsRiderPayload, VerifyEmailPayload } from "@/types";

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
    return apiClient("/rider/apply/verify-email", { method: "POST", body: payload });
};
