import apiClient from "@/lib/apiClient";
import type { CreateAssignmentPayload } from "@/types";

export const createAssignment = (payload: CreateAssignmentPayload) => {
    return apiClient("/assignment/create-assignment", {
        method: "POST",
        body: payload,
    });
};
