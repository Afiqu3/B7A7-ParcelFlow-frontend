import { cancelAssignment, createAssignment, getAllAssignment } from "@/api";
import type { AssignmentParams, CancelAssignmentPayload } from "@/types";
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
        },
    });
};
