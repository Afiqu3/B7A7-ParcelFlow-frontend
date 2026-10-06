import {
    changePassword,
    forgotPassword,
    getMe,
    googleOAuth,
    resendMerchantVerifyCode,
    resetPassword,
    userLogin,
    userLogout,
    userRegistration,
    verifyAccount,
} from "@/api";
import { User } from "@/types";
import {
    queryOptions,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import { FetchError } from "ofetch";

const useRefreshMe = () => {
    const queryClient = useQueryClient();
    return () => queryClient.query({ ...meQueryOptions, staleTime: 0 });
};

export const useLogin = () => {
    const refreshMe = useRefreshMe();
    return useMutation({
        mutationFn: userLogin,
        onSuccess: () => refreshMe(),
    });
};

export const useRegistration = () => {
    return useMutation({
        mutationFn: userRegistration,
    });
};

export const useGoogleOAuth = () => {
    const refreshMe = useRefreshMe();
    return useMutation({
        mutationFn: googleOAuth,
        onSuccess: () => refreshMe(),
    });
};

export const useLogout = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: userLogout,
        onSuccess: () => {
            queryClient.setQueryData(meQueryOptions.queryKey, null);
        },
    });
};

const fetchMe = async (): Promise<User | null> => {
    try {
        const res = await getMe();
        return res.success ? res.data : null;
    } catch (err) {
        if (
            err instanceof FetchError &&
            (err.status === 401 || err.status === 403)
        ) {
            return null;
        }
        throw err;
    }
};

export const meQueryOptions = queryOptions({
    queryKey: ["user"],
    queryFn: fetchMe,
    retry: false,
});

export const useGetMe = () => useQuery(meQueryOptions);

// export const useGetMe = () => {
//     return useQuery({
//         queryKey: ["user"],
//         queryFn: getMe,
//         retry: false,
//     });
// };
export const useVerifyAccount = () => {
    const refreshMe = useRefreshMe();
    return useMutation({
        mutationFn: verifyAccount,
        onSuccess: () => refreshMe(),
    });
};

export const useResendMerchantVerifyCode = () => {
    const refreshMe = useRefreshMe();
    return useMutation({
        mutationFn: resendMerchantVerifyCode,
        onSuccess: () => refreshMe(),
    });
};

export const useForgotPassword = () => {
    return useMutation({
        mutationFn: forgotPassword,
    });
};

export const useChangePassword = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: changePassword,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: meQueryOptions.queryKey,
            });
        },
    });
};

export const useResetPassword = () => {
    return useMutation({
        mutationFn: resetPassword,
    });
};
