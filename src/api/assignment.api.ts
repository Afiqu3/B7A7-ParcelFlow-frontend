import apiClient from "@/lib/apiClient";
import type {
    ApiResponse,
    Assignment,
    AssignmentParams,
    CancelAssignmentPayload,
    CreateAssignmentPayload,
} from "@/types";

export const createAssignment = (payload: CreateAssignmentPayload) => {
    return apiClient("/assignment/create-assignment", {
        method: "POST",
        body: payload,
    });
};

export const getAllAssignment = (params: AssignmentParams) => {
    return apiClient<ApiResponse<Assignment[]>>("/assignment", {
        params,
    });
};

export const cancelAssignment = (
    assignmentId: string,
    payload: CancelAssignmentPayload,
) => {
    return apiClient(`/assignment/${assignmentId}/cancel`, {
        method: "PATCH",
        body: payload,
    });
};
