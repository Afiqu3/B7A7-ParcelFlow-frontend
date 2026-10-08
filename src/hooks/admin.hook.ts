import { createAdmin, getAllAdmin, updateAdminProfile } from "@/api";
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

export const useGetAllAdmin = (params: AdminParams) => {
    return useQuery({
        queryKey: ["admins", params],
        queryFn: () => getAllAdmin(params),
    });
};
