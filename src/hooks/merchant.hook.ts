import { getMerchantProfile } from "@/api";
import { useQuery } from "@tanstack/react-query";

export const useGetMerchantProfile = () => {
    return useQuery({
        queryKey: ["merchant"],
        queryFn: getMerchantProfile,
        retry: false,
    });
};
