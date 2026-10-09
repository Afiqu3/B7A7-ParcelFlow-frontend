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

export const cancelAssignmentSchema = z.object({
    reason: z
        .string()
        .trim()
        .pipe(
            z.union([
                z.literal(""),
                z
                    .string()
                    .min(5, "Reason must be at least 5 characters")
                    .max(250, "Reason must be at most 250 characters"),
            ]),
        ),
});
