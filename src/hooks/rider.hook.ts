import {
    applyAsRider,
    approveOrRejectRider,
    getAllRider,
    getSingleRider,
    toggleRiderUserStatus,
    verifyRiderAccount,
} from "@/api";
import type { RiderParams } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useApplyAsRider = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: applyAsRider,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["riders"],
            });
        },
    });
};

export const useVerifyRiderAccount = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: verifyRiderAccount,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["riders"],
            });
        },
    });
};

export const useGetAllRider = (params: RiderParams) => {
    return useQuery({
        queryKey: ["riders", params],
        queryFn: () => getAllRider(params),
    });
};

export const useGetSingleRider = (riderId: string) => {
    return useQuery({
        queryKey: ["rider", riderId],
        queryFn: () => getSingleRider(riderId),
        enabled: !!riderId,
    });
};

export const useToggleRiderUserStatus = (userId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => toggleRiderUserStatus(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["riders"],
            });
            queryClient.invalidateQueries({
                queryKey: ["rider"],
            });
        },
    });
};

export const useApproveOrRejectRider = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: approveOrRejectRider,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["riders"],
            });
            queryClient.invalidateQueries({
                queryKey: ["rider"],
            });
        },
    });
};
