import z from "zod";

const requiredString = (label: string) =>
    z
        .string({ error: `${label} is required` })
        .trim()
        .min(1, `${label} is required`);

export const PickupMode = {
    RIDER_PICKUP: "RIDER_PICKUP",
    MERCHANT_DROP: "MERCHANT_DROP",
} as const;

export type PickupMode = (typeof PickupMode)[keyof typeof PickupMode];

export const ZoneType = {
    INSIDE_CITY: "INSIDE_CITY",
    SUB_CITY: "SUB_CITY",
    OUTSIDE_CITY: "OUTSIDE_CITY",
} as const;

export type ZoneType = (typeof ZoneType)[keyof typeof ZoneType];

export const ParcelCategory = {
    PARCEL: "PARCEL",
    DOCUMENT: "DOCUMENT",
} as const;

export type ParcelCategory =
    (typeof ParcelCategory)[keyof typeof ParcelCategory];

export const DeliveryType = {
    REGULAR: "REGULAR",
    EXPRESS: "EXPRESS",
    SAME_DAY: "SAME_DAY",
} as const;

export type DeliveryType = (typeof DeliveryType)[keyof typeof DeliveryType];

export const PaymentType = {
    PREPAID: "PREPAID",
    COD: "COD",
} as const;

export type PaymentType = (typeof PaymentType)[keyof typeof PaymentType];

export const CreateParcelZodValidationSchema = z
    .object({
        // ── Pickup ────────────────────────────────────────────────
        pickupContactName: requiredString("Pickup contact name").max(100),
        pickupContactPhone: requiredString("Pickup contact phone").max(20),
        pickupAddressLine: requiredString("Pickup address").max(255),
        pickupDistrict: requiredString("Pickup district").max(100),
        pickupCity: requiredString("Pickup city").max(100),
        pickupMode: z.enum(PickupMode).default(PickupMode.RIDER_PICKUP),
        note: z.string().trim().max(500).optional(),

        // ── Recipient / delivery ──────────────────────────────────
        recipientName: requiredString("Recipient name").max(100),
        recipientPhone: requiredString("Recipient phone").max(20),
        recipientEmail: z.email("Invalid recipient email").trim().toLowerCase(),
        deliveryAddressLine: requiredString("Delivery address").max(255),
        deliveryDistrict: requiredString("Delivery district").max(100),
        deliveryCity: requiredString("Delivery city").max(100),
        deliveryZoneType: z.enum(ZoneType, {
            error: "Delivery zone type is required",
        }),

        // ── Shipment / item ───────────────────────────────────────
        parcelCategory: z.enum(ParcelCategory, {
            error: "Parcel category is required",
        }),
        weightKg: z
            .number({ error: "Weight must be a number" })
            .positive("Weight must be greater than 0")
            .max(1000, "Weight looks unrealistically high"),
        itemDescription: requiredString("Item description").max(255),
        itemQuantity: z
            .number({ error: "Item quantity must be a number" })
            .int("Item quantity must be a whole number")
            .positive("Item quantity must be greater than 0")
            .max(10_000, "Item quantity looks unrealistically high")
            .default(1),
        declaredValue: z
            .number({ error: "Declared value must be a number" })
            .nonnegative("Declared value cannot be negative")
            .max(10_000_000, "Declared value looks unrealistically high")
            .optional(),
        deliveryType: z.enum(DeliveryType).default(DeliveryType.REGULAR),

        // ── Payment ───────────────────────────────────────────────
        paymentType: z.enum(PaymentType, { error: "Payment type is required" }),
        codAmount: z
            .number({ error: "COD amount must be a number" })
            .positive("COD amount must be greater than 0")
            .max(10_000_000, "COD amount looks unrealistically high")
            .optional(),
    })
    // COD parcels must carry a positive codAmount.
    .refine(
        (data) =>
            data.paymentType !== PaymentType.COD ||
            (data.codAmount !== undefined && data.codAmount > 0),
        {
            error: "COD amount is required for COD parcels",
            path: ["codAmount"],
        },
    )
    // Prepaid parcels must not carry a codAmount.
    .refine(
        (data) =>
            data.paymentType !== PaymentType.PREPAID ||
            data.codAmount === undefined,
        {
            error: "Prepaid parcels cannot have a COD amount",
            path: ["codAmount"],
        },
    )
    // DOCUMENT parcels are flat-rate and cannot be Cash on Delivery.
    .refine(
        (data) =>
            data.parcelCategory !== ParcelCategory.DOCUMENT ||
            data.paymentType !== PaymentType.COD,
        {
            error: "DOCUMENT parcels cannot be Cash on Delivery",
            path: ["paymentType"],
        },
    );

export const cancelParcelSchema = z.object({
    cancelReason: z
        .string()
        .trim()
        .pipe(
            z.union([
                z.literal(""),
                z
                    .string()
                    .min(2, "Cancel reason must be at least 5 characters")
                    .max(250, "Cancel reason must be at most 250 characters"),
            ]),
        ),
});

export const parcelStatusUpdateByAdminSchema = z.object({
	status: z.enum(["AT_HUB", "IN_TRANSIT"], {
		error: "Status is required",
	}),
});
