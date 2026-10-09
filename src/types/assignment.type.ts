export type AssignmentLeg = "PICKUP" | "DELIVERY";

export type AssignmentStatus =
    | "ASSIGNED"
    | "ACCEPTED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "FAILED"
    | "CANCELLED"
    | "REJECTED"; // rider declined the offer before accepting it

export interface CreateAssignmentPayload {
    parcelId: string;
    riderId: string;
    leg: AssignmentLeg; // PICKUP | DELIVERY
    // status (ASSIGNED), attemptNumber, and assignedById are set server-side —
    // never accepted from the client.
}

export interface Assignment {
    id: string;
    leg: AssignmentLeg;
    status: AssignmentStatus;
    attemptNumber: number;
    assignedAt: string;
    acceptedAt?: string;
    startedAt?: string;
    completedAt?: string;
    failedAt?: string;
    rejectedAt?: string;
    cancelledAt?: string;
    failureReason?: string;
    createdAt: string;
    updatedAt: string;
    parcelId: string;
    riderId: string;
    assignedById: string;
    parcel: {
        id: string;
        trackingId: string;
        status: string;
    };
    rider: {
        id: string;
        name: string;
        email: string;
        phone: string;
    };
}

export interface AssignmentParams {
    status?: AssignmentStatus;
    page?: number; // defaults to 1
    limit?: number; // defaults to 10F
    searchTerm?: string;
    sortOrder?: "desc" | "asc";
}

export interface CancelAssignmentPayload {
    reason?: string;
}
