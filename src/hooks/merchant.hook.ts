import {
    getAllMerchant,
    getMerchantProfile,
    toggleMerchantUserStatus,
    updateMerchantProfile,
} from "@/api";
import type { MerchantParams } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { meQueryOptions } from "./auth.hook";

export const useGetMerchantProfile = () => {
    return useQuery({
        queryKey: ["merchant"],
        queryFn: getMerchantProfile,
        retry: false,
    });
};

export const useUpdateMerchantProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateMerchantProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["merchant"] });
            queryClient.invalidateQueries({
                queryKey: meQueryOptions.queryKey,
            });
        },
    });
};

export const useGetAllMerchant = (params: MerchantParams) => {
    return useQuery({
        queryKey: ["merchants", params],
        queryFn: () => getAllMerchant(params),
    });
};

export const useToggleMerchantUserStatus = (userId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => toggleMerchantUserStatus(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["merchants"],
            });
        },
    });
};
