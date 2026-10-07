import {
    createParcel,
    getAllMyParcels,
    getSingleParcelAsMerchant,
} from "@/api";
import type { MyParcelsParams } from "@/types";
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

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
