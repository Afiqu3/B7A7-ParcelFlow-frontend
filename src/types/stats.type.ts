export interface MerchantStats {
    overview: Overview;
    parcels: Parcels;
    delivery: Delivery;
    spend: Spend;
    cod: Cod;
    trends: Trends; // 30days countdown
}

export interface Overview {
    totalParcels: number;
    delivered: number;
    inFlight: number;
}

export interface Parcels {
    total: number;
    byStatus: ByStatus;
    byPaymentType: ByPaymentType;
}

export interface ByStatus {
    CREATED: number;
    PICKUP_ASSIGNED: number;
    PICKED_UP: number;
    AT_HUB: number;
    IN_TRANSIT: number;
    OUT_FOR_DELIVERY: number;
    DELIVERED: number;
    DELIVERY_FAILED: number;
    RETURNED_TO_MERCHANT: number;
    CANCELLED: number;
}

export interface ByPaymentType {
    PREPAID: number;
    COD: number;
}

export interface Delivery {
    delivered: number;
    failed: number;
    returned: number;
    successRate: number;
}

export interface Spend {
    totalDeliveryCharge: number;
    prepaidPaid: number;
    prepaidPending: number;
}

export interface Cod {
    collected: number;
    pending: number;
}

export interface Trends {
    parcelsCreated: ParcelsCreated[];
}

export interface ParcelsCreated {
    date: string;
    count: number;
}
