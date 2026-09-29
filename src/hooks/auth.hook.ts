import { getMe, userLogin } from "@/api";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useLogin = () => {
    return useMutation({
        mutationFn: userLogin,
    });
};

export const useGetMe = () => {
    return useQuery({
        queryKey: ["user"],
        queryFn: getMe,
        retry: false,
    });
};
