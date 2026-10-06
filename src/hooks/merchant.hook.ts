import { getMerchantProfile, updateMerchantProfile } from "@/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { meQueryOptions } from "./auth.hook";

export const useGetMerchantProfile = () => {
    return useQuery({
        queryKey: ["merchant"],
        queryFn: getMerchantProfile,
        retry: false,
    });
};

export const useUpdateMerchantProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateMerchantProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["merchant"] });
            queryClient.invalidateQueries({
                queryKey: meQueryOptions.queryKey,
            });
        },
    });
};
