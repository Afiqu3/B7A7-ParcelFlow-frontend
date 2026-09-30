import { getMe, googleOAuth, userLogin, userRegistration } from "@/api";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useLogin = () => {
    return useMutation({
        mutationFn: userLogin,
    });
};

export const useRegistration = () => {
  return useMutation({
    mutationFn: userRegistration,
  });
}

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
