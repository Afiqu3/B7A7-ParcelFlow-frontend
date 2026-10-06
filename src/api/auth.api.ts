import apiClient from "@/lib/apiClient";
import {
    ApiResponse,
    ChangePasswordPayload,
    LoginPayload,
    RegisterMerchantPayload,
    ResetPasswordPayload,
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

export const resendMerchantVerifyCode = (payload: { email: string }) => {
    return apiClient("/auth/resend-otp", {
        method: "POST",
        body: payload,
    });
};

export const forgotPassword = (payload: { email: string }) => {
    return apiClient("/auth/forgot-password", {
        method: "POST",
        body: payload,
    });
};

export const resetPassword = (payload: ResetPasswordPayload) => {
    return apiClient("/auth/reset-password", {
        method: "POST",
        body: payload,
    });
};

export const changePassword = (payload: ChangePasswordPayload) => {
    return apiClient("/auth/change-password", {
        method: "POST",
        body: payload,
    });
};

export const googleOAuth = (payload: { idToken: string }) => {
    return apiClient("/auth/google", {
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
