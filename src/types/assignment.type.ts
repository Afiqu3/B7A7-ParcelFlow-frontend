export type AssignmentLeg = "PICKUP" | "DELIVERY";

export interface CreateAssignmentPayload {
    parcelId: string;
    riderId: string;
    leg: AssignmentLeg; // PICKUP | DELIVERY
    // status (ASSIGNED), attemptNumber, and assignedById are set server-side —
    // never accepted from the client.
}
