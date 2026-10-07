import type { ParcelCategory, ZoneType } from "./pricing.type";

export type PickupMode = "RIDER_PICKUP" | "MERCHANT_DROP";

export type DeliveryType = "REGULAR" | "EXPRESS" | "SAME_DAY";

export type PaymentType = "PREPAID" | "COD";

export type ParcelStatus =
    | "CREATED"
    | "PICKUP_ASSIGNED"
    | "PICKED_UP"
    | "AT_HUB"
    | "IN_TRANSIT"
    | "OUT_FOR_DELIVERY"
    | "DELIVERED"
    | "DELIVERY_FAILED"
    | "RETURNED_TO_MERCHANT"
    | "CANCELLED";

export type TransactionStatus =
    | "PENDING"
    | "PAID"
    | "FAILED"
    | "CANCELLED"
    | "REFUNDED";

export interface CreateParcelPayload {
    // ── Pickup ────────────────────────────────────────────────
    pickupContactName: string;
    pickupContactPhone: string;
    pickupAddressLine: string;
    pickupDistrict: string;
    pickupCity: string;
    pickupMode?: PickupMode; // defaults to RIDER_PICKUP
    note?: string;

    // ── Recipient / delivery ──────────────────────────────────
    recipientName: string;
    recipientPhone: string;
    recipientEmail: string;
    deliveryAddressLine: string;
    deliveryDistrict: string;
    deliveryCity: string;
    // Zone that pricing is resolved against. Supplied by the client for now;
    // can later be derived server-side from delivery district/city.
    deliveryZoneType: ZoneType;

    // ── Shipment / item ───────────────────────────────────────
    parcelCategory: ParcelCategory;
    weightKg: number;
    itemDescription: string;
    itemQuantity?: number; // defaults to 1
    declaredValue?: number;
    deliveryType?: DeliveryType; // defaults to REGULAR

    // ── Payment ───────────────────────────────────────────────
    paymentType: PaymentType;
    codAmount?: number; // required (> 0) when paymentType === "COD"
}

export interface Parcel {
    // NOTE: Prisma `Decimal` columns arrive as strings (e.g. `"2.5"`).
    // `toParcel` (src/lib/parcel.ts) normalizes them to numbers.
    id: string;
    trackingId: string;
    pickupContactName: string;
    pickupContactPhone: string;
    pickupAddressLine: string;
    pickupMode: PickupMode;
    pickupDistrict: string;
    pickupCity: string;
    note?: string;
    recipientName: string;
    recipientPhone: string;
    recipientEmail: string;
    deliveryAddressLine: string;
    deliveryDistrict: string;
    deliveryCity: string;
    parcelCategory: ParcelCategory;
    weightKg: number;
    itemDescription: string;
    itemQuantity?: number;
    declaredValue?: number;
    deliveryType: DeliveryType;
    paymentType: PaymentType;
    codAmount?: number;
    deliveryZoneType: ZoneType;
    baseCharge: number;
    weightCharge: number;
    deliveryTypeSurcharge: number;
    pickupModeCharge?: number;
    codFee: number;
    totalCharge: number;
    status: ParcelStatus;
    reattemptCount?: number;
    maxReattempts?: number;
    cancelledAt?: string;
    cancelledById?: string;
    cancelReason?: string;
    failureReason?: string;
    deliveredAt?: string;
    returnedAt?: string;
    isDeleted?: boolean;
    deletedAt?: string;
    createdAt: string;
    updatedAt: string;
    merchantId: string;
    transaction?: {
        id: string;
        amount: number;
        status: TransactionStatus;
        currency: string;
        paymentGateway?: string; // default to bkash
        merchantInvoiceNumber: string;
        bkashPaymentID?: string;
        bkashTrxID?: string;
        payerReference?: string;
        paidAt?: string;
        bkashResponse?: JSON;
        refundedAmount?: string;
        refundedAt?: string;
        refundReason?: string;
        refundTxID?: string;
        createdAt: string;
        updatedAt: string;
        parcelId: string;
    };
}

export interface MyParcelsParams {
    status?: ParcelStatus;
    page?: number; // defaults to 1
    limit?: number; // defaults to 10
    searchTerm?: string;
    sortOrder?: "desc" | "asc";
}
