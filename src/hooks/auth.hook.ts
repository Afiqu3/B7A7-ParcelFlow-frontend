import { getMe, googleOAuth, userLogin } from "@/api";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useLogin = () => {
    return useMutation({
        mutationFn: userLogin,
    });
};

export const useGoogleOAuth = () => {
    return useMutation({
        mutationFn: googleOAuth,
    });
};

export const useGetMe = () => {
    return useQuery({
        queryKey: ["user"],
        queryFn: getMe,
        retry: false,
    });
};
