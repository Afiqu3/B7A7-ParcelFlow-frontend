import apiClient from "@/lib/apiClient";
import type { AdminCreatePayload, AdminUpdatePayload } from "@/types";

export const updateAdminProfile = (payload: AdminUpdatePayload) => {
    return apiClient("/admin", {
        method: "PATCH",
        body: payload,
    });
};

export const createAdmin = (payload: AdminCreatePayload) => {
    return apiClient("/admin", {
        method: "POST",
        body: payload,
    });
};
