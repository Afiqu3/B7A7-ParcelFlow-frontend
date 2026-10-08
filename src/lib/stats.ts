import type {
    AdminStats,
    ByApplicationStatus,
    ByStatus,
    ByStatus2,
    MerchantStats,
} from "@/types";

function num(value: unknown, fallback = 0): number {
    const parsed = typeof value === "number" ? value : Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}

/**
 * Normalizes merchant stats from the API. Like parcels, numeric fields
 * may arrive as strings (Prisma `Decimal`), which would silently break
 * charts and formatters — so everything numeric is coerced here.
 */
export function toMerchantStats(stats: MerchantStats): MerchantStats {
    type StatusMap = MerchantStats["parcels"]["byStatus"];
    const rawStatus = (stats.parcels.byStatus ?? {}) as Partial<
        Record<keyof StatusMap, unknown>
    >;
    const byStatus: StatusMap = {
        CREATED: num(rawStatus.CREATED),
        PICKUP_ASSIGNED: num(rawStatus.PICKUP_ASSIGNED),
        PICKED_UP: num(rawStatus.PICKED_UP),
        AT_HUB: num(rawStatus.AT_HUB),
        IN_TRANSIT: num(rawStatus.IN_TRANSIT),
        OUT_FOR_DELIVERY: num(rawStatus.OUT_FOR_DELIVERY),
        DELIVERED: num(rawStatus.DELIVERED),
        DELIVERY_FAILED: num(rawStatus.DELIVERY_FAILED),
        RETURNED_TO_MERCHANT: num(rawStatus.RETURNED_TO_MERCHANT),
        CANCELLED: num(rawStatus.CANCELLED),
    };

    return {
        overview: {
            totalParcels: num(stats.overview.totalParcels),
            delivered: num(stats.overview.delivered),
            inFlight: num(stats.overview.inFlight),
        },
        parcels: {
            total: num(stats.parcels.total),
            byStatus,
            byPaymentType: {
                PREPAID: num(stats.parcels.byPaymentType.PREPAID),
                COD: num(stats.parcels.byPaymentType.COD),
            },
        },
        delivery: {
            delivered: num(stats.delivery.delivered),
            failed: num(stats.delivery.failed),
            returned: num(stats.delivery.returned),
            successRate: num(stats.delivery.successRate),
        },
        spend: {
            totalDeliveryCharge: num(stats.spend.totalDeliveryCharge),
            prepaidPaid: num(stats.spend.prepaidPaid),
            prepaidPending: num(stats.spend.prepaidPending),
        },
        cod: {
            collected: num(stats.cod.collected),
            pending: num(stats.cod.pending),
        },
        trends: {
            parcelsCreated: (stats.trends.parcelsCreated ?? []).map(
                (point) => ({
                    date: point.date,
                    count: num(point.count),
                }),
            ),
        },
    };
}

const section = <T extends object>(value: T | undefined | null): T =>
    (value ?? {}) as T;

/**
 * Normalizes admin stats the same way: every numeric field is coerced
 * (Prisma `Decimal` strings), missing sections default to zeros.
 */
export function toAdminStats(stats: AdminStats): AdminStats {
    const overview = section(stats.overview);
    const riders = section(stats.riders);
    const riderStatus = section(riders.byApplicationStatus) as Partial<
        Record<keyof ByApplicationStatus, unknown>
    >;
    const parcels = section(stats.parcels);
    const parcelStatus = section(parcels.byStatus) as Partial<
        Record<keyof ByStatus, unknown>
    >;
    const delivery = section(stats.delivery);
    const revenue = section(stats.revenue);
    const bkash = section(revenue.bkash);
    const cod = section(revenue.cod);
    const assignments = section(stats.assignments);
    const assignmentStatus = section(assignments.byStatus) as Partial<
        Record<keyof ByStatus2, unknown>
    >;
    const trends = section(stats.trends);

    return {
        overview: {
            totalMerchants: num(overview.totalMerchants),
            blockedMerchants: num(overview.blockedMerchants),
            totalRiders: num(overview.totalRiders),
            totalAdmins: num(overview.totalAdmins),
            totalParcels: num(overview.totalParcels),
            pendingRiderApprovals: num(overview.pendingRiderApprovals),
            activeAssignments: num(overview.activeAssignments),
        },
        riders: {
            total: num(riders.total),
            byApplicationStatus: {
                PENDING: num(riderStatus.PENDING),
                APPROVED: num(riderStatus.APPROVED),
                REJECTED: num(riderStatus.REJECTED),
            },
        },
        parcels: {
            total: num(parcels.total),
            byStatus: {
                CREATED: num(parcelStatus.CREATED),
                PICKUP_ASSIGNED: num(parcelStatus.PICKUP_ASSIGNED),
                PICKED_UP: num(parcelStatus.PICKED_UP),
                AT_HUB: num(parcelStatus.AT_HUB),
                IN_TRANSIT: num(parcelStatus.IN_TRANSIT),
                OUT_FOR_DELIVERY: num(parcelStatus.OUT_FOR_DELIVERY),
                DELIVERED: num(parcelStatus.DELIVERED),
                DELIVERY_FAILED: num(parcelStatus.DELIVERY_FAILED),
                RETURNED_TO_MERCHANT: num(parcelStatus.RETURNED_TO_MERCHANT),
                CANCELLED: num(parcelStatus.CANCELLED),
            },
        },
        delivery: {
            delivered: num(delivery.delivered),
            failed: num(delivery.failed),
            returned: num(delivery.returned),
            successRate: num(delivery.successRate),
        },
        revenue: {
            bkash: {
                paid: num(bkash.paid),
                pending: num(bkash.pending),
                refunded: num(bkash.refunded),
            },
            realizedDeliveryCharge: num(revenue.realizedDeliveryCharge),
            cod: {
                collected: num(cod.collected),
                outstanding: num(cod.outstanding),
            },
        },
        assignments: {
            active: num(assignments.active),
            byStatus: {
                ASSIGNED: num(assignmentStatus.ASSIGNED),
                ACCEPTED: num(assignmentStatus.ACCEPTED),
                IN_PROGRESS: num(assignmentStatus.IN_PROGRESS),
                COMPLETED: num(assignmentStatus.COMPLETED),
                FAILED: num(assignmentStatus.FAILED),
                CANCELLED: num(assignmentStatus.CANCELLED),
                REJECTED: num(assignmentStatus.REJECTED),
            },
        },
        trends: {
            parcelsCreated: (trends.parcelsCreated ?? []).map((point) => ({
                date: point.date,
                count: num(point.count),
            })),
            deliveries: (trends.deliveries ?? []).map((point) => ({
                date: point.date,
                count: num(point.count),
            })),
        },
    };
}
