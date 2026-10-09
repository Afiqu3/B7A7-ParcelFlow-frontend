import {
    applyAsRider,
    approveOrRejectRider,
    getAllAvailableRider,
    getAllRider,
    getRiderProfile,
    getSingleRider,
    toggleRiderUserStatus,
    verifyRiderAccount,
} from "@/api";
import type { AvailableRiderParams, RiderParams } from "@/types";
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
            queryClient.invalidateQueries({
                queryKey: ["available-riders"],
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

export const useGetAllAvailableRider = (params: AvailableRiderParams) => {
    return useQuery({
        queryKey: ["available-riders", params],
        queryFn: () => getAllAvailableRider(params),
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
            queryClient.invalidateQueries({
                queryKey: ["available-riders"],
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
            queryClient.invalidateQueries({
                queryKey: ["available-riders"],
            });
        },
    });
};

export const useGetRiderProfile = () => {
    return useQuery({
        queryKey: ["rider"],
        queryFn: getRiderProfile,
        retry: false,
    });
};
