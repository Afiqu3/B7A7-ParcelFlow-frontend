import { getMe } from "@/api";
import { useQuery } from "@tanstack/react-query";

export const useGetMe = () => {
    return useQuery({
        queryKey: ["user"],
        queryFn: getMe,
        retry: false,
    });
};