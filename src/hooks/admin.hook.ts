import {
    createAdmin,
    createSuperAdmin,
    getAllAdmin,
    getAllSuperAdmin,
    toggleAdminUserStatus,
    updateAdminProfile,
} from "@/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { meQueryOptions } from "./auth.hook";
import type { AdminParams } from "@/types";

export const useUpdateAdminProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateAdminProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: meQueryOptions.queryKey,
            });
            queryClient.invalidateQueries({
                queryKey: ["admins"],
            });
        },
    });
};

export const useCreateAdmin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createAdmin,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admins"],
            });
        },
    });
};

export const useCreateSuperAdmin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createSuperAdmin,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["super-admins"],
            });
        },
    });
};

export const useGetAllAdmin = (params: AdminParams) => {
    return useQuery({
        queryKey: ["admins", params],
        queryFn: () => getAllAdmin(params),
    });
};

export const useGetAllSuperAdmin = (params: AdminParams) => {
    return useQuery({
        queryKey: ["super-admins", params],
        queryFn: () => getAllSuperAdmin(params),
    });
};

export const useToggleAdminUserStatus = (userId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => toggleAdminUserStatus(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admins"],
            });
            queryClient.invalidateQueries({
                queryKey: ["super-admins"],
            });
        },
    });
};
