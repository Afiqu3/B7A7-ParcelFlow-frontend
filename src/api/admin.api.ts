import apiClient from "@/lib/apiClient";
import type { AdminUpdatePayload } from "@/types";

export const updateAdminProfile = (payload: AdminUpdatePayload) => {
    return apiClient("/admin", {
        method: "PATCH",
        body: payload,
    });
};
