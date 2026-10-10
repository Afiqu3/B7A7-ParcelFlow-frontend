import apiClient from "@/lib/apiClient";
import type {
    ApiResponse,
    Assignment,
    AssignmentParams,
    CancelAssignmentPayload,
    CreateAssignmentPayload,
    MyAssignment,
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

export const getAllMyAssignment = (params: AssignmentParams) => {
    return apiClient<ApiResponse<MyAssignment[]>>(
        "/assignment/my-assignments",
        {
            params,
        },
    );
};

export const acceptAssignment = (assignmentId: string) => {
    return apiClient(`/assignment/${assignmentId}/accept`, {
        method: "PATCH",
    });
};

export const rejectAssignment = (assignmentId: string) => {
    return apiClient(`/assignment/${assignmentId}/reject`, {
        method: "PATCH",
    });
};

export const startAssignment = (assignmentId: string) => {
    return apiClient(`/assignment/${assignmentId}/start`, {
        method: "PATCH",
    });
};

export const completeAssignment = (assignmentId: string) => {
    return apiClient(`/assignment/${assignmentId}/complete`, {
        method: "PATCH",
    });
};

export const failAssignment = (assignmentId: string) => {
    return apiClient(`/assignment/${assignmentId}/fail`, {
        method: "PATCH",
    });
};
