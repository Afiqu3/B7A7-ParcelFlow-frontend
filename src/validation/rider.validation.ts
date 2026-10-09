import z from "zod";
import { BD_PHONE_REGEX } from "./auth.validation";

export const MAX_FILE_SIZE = 4.5;

export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE * 1024 * 1024;

export const ACCEPTED_FILE_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/png",
    "image/jpeg",
];

export const isAcceptedFileSize = (fileSize: number) => {
    return fileSize <= MAX_FILE_SIZE_BYTES;
};

export const isAcceptedFileType = (fileType: string) => {
    return ACCEPTED_FILE_TYPES.includes(fileType);
};

export const getCustomFileSchema = <T>(message: string) =>
    z.custom<T>(
        (value) =>
            value === null ||
            (value instanceof File &&
                isAcceptedFileSize(value.size) &&
                isAcceptedFileType(value.type)),
        {
            message: message,
        },
    );

export const riderApplicationSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Full name must be at least 2 characters long"),
    email: z.email("Invalid email address").trim().toLowerCase(),
    phone: z
        .string()
        .trim()
        .min(1, { error: "Phone number is required", abort: true })
        .regex(BD_PHONE_REGEX, "Please provide a valid Bangladeshi number"),
    address: z.string().trim(),
    nid: z
        .string()
        .trim()
        .regex(/^(\d{10}|\d{13}|\d{17})$/, "Enter a valid NID number"),
    licenseNumber: z
        .string("Provide your driving license number")
        .trim()
        .min(3, "License number is required"),
    vehicleType: z.enum(
        ["BIKE", "BICYCLE", "VAN"],
        "Vehicle type must be BIKE or BICYCLE or VAN",
    ),
    vehiclePaper: getCustomFileSchema<File | null>(
        `VehiclePaper must be a PDF, DOC, DOCX or an image file under ${MAX_FILE_SIZE}MB`,
    ).refine((value) => value instanceof File, {
        message: "VehiclePaper is required",
    }),
});

export const approveRiderValidationSchema = z.object({
    riderId: z.string().trim(),
    applicationStatus: z.enum(
        ["APPROVED", "REJECTED"],
        "Application status must be APPROVED or REJECTED",
    ),
    rejectionReason: z.string().optional(),
});

export const updateRiderValidationSchema = z.object({
    name: z
        .string()
        .trim()
        .pipe(
            z.union([
                z.literal(""),
                z.string().min(2, "Name must be at least 2 characters"),
            ]),
        ),
    phone: z
        .string()
        .trim()
        .min(1)
        .regex(BD_PHONE_REGEX, "Please provide a valid Bangladeshi number")
        .optional(),
    address: z
        .string()
        .trim()
        .pipe(
            z.union([
                z.literal(""),
                z.string().min(5, "Address must be at least 5 characters"),
            ]),
        ),
});
