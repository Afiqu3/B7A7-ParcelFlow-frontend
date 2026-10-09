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

export interface AdminStats {
    overview: MerchantOverview;
    riders: Riders;
    parcels: AdminParcels;
    delivery: Delivery;
    revenue: Revenue;
    assignments: Assignments;
    trends: AdminTrends;
}

export interface MerchantOverview {
    totalMerchants: number;
    blockedMerchants: number;
    totalRiders: number;
    totalAdmins: number;
    totalParcels: number;
    pendingRiderApprovals: number;
    activeAssignments: number;
}

export interface Riders {
    total: number;
    byApplicationStatus: ByApplicationStatus;
}

export interface ByApplicationStatus {
    PENDING: number;
    APPROVED: number;
    REJECTED: number;
}

export interface AdminParcels {
    total: number;
    byStatus: ByStatus;
}

export interface Revenue {
    bkash: Bkash;
    realizedDeliveryCharge: number;
    cod: AdminCod;
}

export interface AdminCod {
    collected: number;
    outstanding: number;
}

export interface Bkash {
    paid: number;
    pending: number;
    refunded: number;
}

export interface Assignments {
    active: number;
    byStatus: ByStatus2;
}

export interface ByStatus2 {
    ASSIGNED: number;
    ACCEPTED: number;
    IN_PROGRESS: number;
    COMPLETED: number;
    FAILED: number;
    CANCELLED: number;
    REJECTED: number;
}

export interface AdminTrends {
    parcelsCreated: ParcelsCreated[];
    deliveries: Delivery2[];
}

export interface Delivery2 {
    date: string;
    count: number;
}

export interface RiderStats {
    overview: RiderOverview;
    assignments: Assignments;
    performance: RiderPerformance;
    trends: RiderTrends;
}

export interface RiderOverview {
    totalAssignments: number;
    activePickups: number;
    activeDeliveries: number;
    completedPickups: number;
    completedDeliveries: number;
}

export interface RiderPerformance {
    completedDeliveries: number;
    failedDeliveries: number;
    deliverySuccessRate: number;
}

export interface RiderTrends {
    completedAssignments: CompletedAssignment[];
}

export interface CompletedAssignment {
    date: string;
    count: number;
}
