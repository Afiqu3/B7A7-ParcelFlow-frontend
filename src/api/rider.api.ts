import apiClient from "@/lib/apiClient";
import { ApplyAsRiderPayload } from "@/types";

export const applyAsRider = (payload: ApplyAsRiderPayload) => {
    const formData = new FormData();

    formData.append("data", JSON.stringify(payload.data));
    formData.append("resume", payload.vehiclePaper);

    return apiClient("/rider/apply", {
        method: "POST",
        body: formData,
    });
};
