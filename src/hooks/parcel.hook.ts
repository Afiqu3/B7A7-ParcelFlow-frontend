import {
    cancelParcelByMerchant,
    createParcel,
    deleteParcelByMerchant,
    downloadInvoice,
    getAllMyParcels,
    getSingleParcelAsMerchant,
    paymentParcel,
    trackParcel,
} from "@/api";
import type { cancelParcelPayload, MyParcelsParams } from "@/types";
import { saveBlobAsFile } from "@/utils";
import {
    useMutation,
    useQuery,
    useQueryClient,
    useSuspenseQuery,
} from "@tanstack/react-query";
import type { FetchError } from "ofetch";
import { toast } from "sonner";

export const useCreateParcel = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createParcel,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["my-parcels"] });
        },
    });
};

export const useGetAllMyParcels = (params: MyParcelsParams) => {
    return useQuery({
        queryKey: ["my-parcels", params],
        queryFn: () => getAllMyParcels(params),
    });
};

export const useSuspenseGetAllMyParcels = (params: MyParcelsParams) => {
    return useSuspenseQuery({
        queryKey: ["my-parcels", params],
        queryFn: () => getAllMyParcels(params),
    });
};

export const useGetSingleParcelAsMerchant = (parcelId: string) => {
    return useQuery({
        queryKey: ["my-parcel", "merchant", parcelId],
        queryFn: () => getSingleParcelAsMerchant(parcelId),
        enabled: !!parcelId,
    });
};

export const useCancelParcelByMerchant = (
    parcelId: string,
    payload: cancelParcelPayload,
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => cancelParcelByMerchant(parcelId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["my-parcels"] });
            queryClient.invalidateQueries({
                queryKey: ["my-parcel", "merchant", parcelId],
            });
        },
    });
};

export const useDeleteParcelByMerchant = (parcelId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => deleteParcelByMerchant(parcelId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["my-parcels"] });
            queryClient.invalidateQueries({
                queryKey: ["my-parcel", "merchant", parcelId],
            });
        },
    });
};

export const usePaymentParcel = (parcelId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => paymentParcel(parcelId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["my-parcels"] });
            queryClient.invalidateQueries({
                queryKey: ["my-parcel", "merchant", parcelId],
            });
        },
    });
};

export const useDownloadInvoice = () => {
    return useMutation({
        mutationFn: downloadInvoice,
        onSuccess: (blob, parcelId) => {
            saveBlobAsFile(blob, `invoice-${parcelId}.pdf`);
            toast.success("Invoice downloaded", {
                description: `invoice-${parcelId}.pdf`,
            });
        },
        onError: (err: FetchError) => {
            toast.error("Could not download invoice", {
                description:
                    err.data?.message ||
                    err.message ||
                    "Something went wrong. Please try again.",
            });
        },
    });
};

export const useTrackParcel = (trackingId: string) => {
    return useQuery({
        queryKey: ["track", trackingId],
        queryFn: () => trackParcel(trackingId),
        enabled: trackingId.trim() !== "",
        // A typo'd ID 404s — don't waste retries on it.
        retry: false,
    });
};
