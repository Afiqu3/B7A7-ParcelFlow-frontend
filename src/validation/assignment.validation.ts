import z from "zod";

export const createAssignmentSchema = z.object({
    parcelId: z
        .string({ error: "Parcel id is required" })
        .trim()
        .min(1, "Parcel id is required"),
    riderId: z
        .string({ error: "Rider id is required" })
        .trim()
        .min(1, "Rider id is required"),
    leg: z.enum(["PICKUP", "DELIVERY"], {
        error: "Leg must be PICKUP or DELIVERY",
    }),
});
