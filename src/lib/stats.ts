import type { MerchantStats } from "@/types";

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
