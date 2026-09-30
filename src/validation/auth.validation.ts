import z from "zod";

export const strongPasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[a-z]/, "Password must contain a lowercase letter")
  .regex(/[A-Z]/, "Password must contain an uppercase letter")
  .regex(/[0-9]/, "Password must contain a number")
  .regex(/[^A-Za-z0-9]/, "Password must contain a special character");

export const loginSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const registrationSchema = z.object({
  name: z
    .string("Enter a valid name")
    .min(3, "Name must at least 3 characters long!!!")
    .max(20),
  email: z.email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
  phone: z
    .string()
    .refine((val) => val === "" || /^(?:\+?880|0)1[3-9]\d{8}$/.test(val), {
      message: "Please provide valid Bangladeshi number",
    }),
  businessName: z
    .string("Enter a valid business name")
    .min(5, "Business name must at least 5 characters long!!!")
    .max(20)
    .optional(),
});
