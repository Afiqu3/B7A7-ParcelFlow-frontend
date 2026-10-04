import apiClient from "@/lib/apiClient";
import {
    ApiResponse,
    LoginPayload,
    RegisterMerchantPayload,
    User,
    VerifyEmailPayload,
} from "@/types";


export const userLogin = (payload: LoginPayload) => {
    return apiClient("/auth/login", { method: "POST", body: payload });
};

export const userRegistration = (payload: RegisterMerchantPayload) => {
    return apiClient("/auth/register", { method: "POST", body: payload });
};

export const verifyAccount = (payload: VerifyEmailPayload) => {
    return apiClient("/auth/verify-otp", { method: "POST", body: payload });
};

export const googleOAuth = (payload: { idToken: string }) => {
    return apiClient<ApiResponse<User>>("/auth/google", {
        method: "POST",
        body: payload,
    });
};

export const userLogout = () => {
    return apiClient("/auth/logout", { method: "POST" });
};

export const getMe = () => {
    return apiClient<ApiResponse<User>>("/auth/me");
};
