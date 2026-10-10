import {
    acceptAssignment,
    cancelAssignment,
    completeAssignment,
    createAssignment,
    failAssignment,
    getAllAssignment,
    getAllMyAssignment,
    rejectAssignment,
    startAssignment,
} from "@/api";
import type {
    AssignmentParams,
    CancelAssignmentPayload,
    MyAssignmentParams,
} from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCreateAssignment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createAssignment,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["available-riders"],
            });
            queryClient.invalidateQueries({
                queryKey: ["assignments"],
            });
            queryClient.invalidateQueries({
                queryKey: ["my-assignments"],
            });
        },
    });
};

export const useGetAllAssignment = (params: AssignmentParams) => {
    return useQuery({
        queryKey: ["assignments", params],
        queryFn: () => getAllAssignment(params),
    });
};

export const useCancelAssignment = (
    assignmentId: string,
    payload: CancelAssignmentPayload,
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => cancelAssignment(assignmentId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["available-riders"],
            });
            queryClient.invalidateQueries({
                queryKey: ["assignments"],
            });
            queryClient.invalidateQueries({
                queryKey: ["my-assignments"],
            });
        },
    });
};

export const useGetAllMyAssignment = (params: MyAssignmentParams) => {
    return useQuery({
        queryKey: ["my-assignments", params],
        queryFn: () => getAllMyAssignment(params),
    });
};


export const useAcceptAssignment = (assignmentId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => acceptAssignment(assignmentId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["assignments"],
            });
            queryClient.invalidateQueries({
                queryKey: ["my-assignments"],
            });
        },
    });
};

export const useRejectAssignment = (assignmentId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => rejectAssignment(assignmentId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["assignments"],
            });
            queryClient.invalidateQueries({
                queryKey: ["my-assignments"],
            });
        },
    });
};

export const useStartAssignment = (assignmentId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => startAssignment(assignmentId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["assignments"],
            });
            queryClient.invalidateQueries({
                queryKey: ["my-assignments"],
            });
        },
    });
};

export const useCompleteAssignment = (assignmentId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => completeAssignment(assignmentId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["assignments"],
            });
            queryClient.invalidateQueries({
                queryKey: ["my-assignments"],
            });
        },
    });
};

export const useFailAssignment = (assignmentId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => failAssignment(assignmentId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["assignments"],
            });
            queryClient.invalidateQueries({
                queryKey: ["my-assignments"],
            });
        },
    });
};