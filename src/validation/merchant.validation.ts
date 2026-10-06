import z from "zod";
import { BD_PHONE_REGEX } from "./auth.validation";

export const updateMerchantProfileSchema = z.object({
    name: z
        .string("Enter a valid name")
        .min(3, "Name must at least 3 characters long!!!")
        .max(20)
        .optional(),
    phone: z
        .string()
        .trim()
        .min(1)
        .regex(BD_PHONE_REGEX, "Please provide a valid Bangladeshi number")
        .optional(),
    businessName: z
        .string()
        .trim()
        .pipe(
            z.union([
                z.literal(""),
                z
                    .string()
                    .min(2, "Business name must be at least 2 characters")
                    .max(20, "Business name must be at most 20 characters"),
            ]),
        ),
});
