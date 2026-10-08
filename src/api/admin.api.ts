import apiClient from "@/lib/apiClient";
import type {
    AdminCreatePayload,
    AdminParams,
    AdminUpdatePayload,
} from "@/types";

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

export const createSuperAdmin = (payload: AdminCreatePayload) => {
    return apiClient("/admin/super-admin", {
        method: "POST",
        body: payload,
    });
};

export const getAllAdmin = (params: AdminParams) => {
    return apiClient("/admin", {
        params,
    });
};

export const getAllSuperAdmin = (params: AdminParams) => {
    return apiClient("/admin/super-admin", {
        params,
    });
};

export const toggleAdminUserStatus = (userId: string) => {
    return apiClient(`/admin/${userId}/status`, {
        method: "PATCH",
    });
};
