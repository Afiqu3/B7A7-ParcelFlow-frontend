import z from "zod";

export const PASSWORD_MIN_LENGTH = 8;

export type PasswordRule = {
    id: string;
    /** Short label shown in the live <PasswordStrength /> checklist. */
    label: string;
    /** Error message reported by the Zod schema. */
    message: string;
    test: (value: string) => boolean;
};

// Single source of truth for password strength. Both `strongPasswordSchema`
// and the <PasswordStrength /> checklist are built from this list, so the UI
// and the validation can never disagree. Add or change rules here only.
export const PASSWORD_RULES: readonly PasswordRule[] = [
    {
        id: "length",
        label: `At least ${PASSWORD_MIN_LENGTH} characters`,
        message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
        test: (value) => value.length >= PASSWORD_MIN_LENGTH,
    },
    {
        id: "lowercase",
        label: "One lowercase letter",
        message: "Password must contain a lowercase letter",
        test: (value) => /[a-z]/.test(value),
    },
    {
        id: "uppercase",
        label: "One uppercase letter",
        message: "Password must contain an uppercase letter",
        test: (value) => /[A-Z]/.test(value),
    },
    {
        id: "number",
        label: "One number",
        message: "Password must contain a number",
        test: (value) => /[0-9]/.test(value),
    },
    {
        id: "symbol",
        label: "One symbol (e.g. ! @ # $)",
        message: "Password must contain a special character",
        test: (value) => /[^A-Za-z0-9]/.test(value),
    },
];

export const strongPasswordSchema = PASSWORD_RULES.reduce(
    (schema, rule) => schema.refine(rule.test, rule.message),
    // Stop here when empty so the user sees one message, not five.
    z.string().min(1, { error: "Password is required", abort: true }),
);

export const BD_PHONE_REGEX = /^(?:\+?880|0)1[3-9]\d{8}$/;

export const loginSchema = z.object({
    email: z.email("Enter a valid email"),
    password: z.string().min(1, "Password is required"),
});

export const merchantRegistrationSchema = z.object({
    name: z
        .string("Enter a valid name")
        .min(3, "Name must at least 3 characters long!!!")
        .max(20),
    email: z.email("Enter a valid email"),
    password: strongPasswordSchema,
    phone: z
        .string()
        .trim()
        .min(1, { error: "Phone number is required", abort: true })
        .regex(BD_PHONE_REGEX, "Please provide a valid Bangladeshi number"),
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

export const emailVerifySchema = z.object({
    otp: z.string().regex(/^\d{6}$/, "OTP must be 6 digits"),
});

export const forgotPasswordSchema = z.object({
    email: z.email("Invalid email address").trim().toLowerCase(),
});

export const resetPasswordSchema = z
    .object({
        email: z.email("Invalid email address").trim().toLowerCase(),
        newPassword: strongPasswordSchema,
        confirmPassword: z.string().min(1, "Please confirm your password"),
        otp: z.string().regex(/^\d{6}$/, "OTP must be 6 digits"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Password do not match",
        path: ["confirmPassword"],
    });

export const changePasswordSchema = z
    .object({
        currentPassword: z
            .string()
            .min(1, "Please provide your current password"),
        newPassword: strongPasswordSchema,
        confirmPassword: z.string().min(1, "Please confirm your new password"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    })
    .refine((data) => data.currentPassword !== data.newPassword, {
        message: "New password must be different from the current one",
        path: ["newPassword"],
    });
