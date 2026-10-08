import z from "zod";
import { strongPasswordSchema } from "./auth.validation";

export const updateAdminSchema = z.object({
    name: z
        .string("Provide your name")
        .min(3, "Name must at least 3 characters long!!!")
        .max(50)
        .optional(),
});

export const createAdminSchema = z.object({
	name: z
		.string("Provide your name")
		.min(3, "Name must at least 3 characters long!!!")
		.max(50),
	email: z.email("Invalid email address").trim().toLowerCase(),
	password: strongPasswordSchema,
	personalEmail: z.email("Invalid email address").trim().toLowerCase(),
});