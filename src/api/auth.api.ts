import apiClient from "@/lib/apiClient";
import { ApiResponse, LoginPayload, User } from "@/types";

export const userLogin = (payload: LoginPayload) => {
    return apiClient("/auth/login", { method: "POST", body: payload });
};

export const googleOAuth = (payload: { idToken: string }) => {
  return apiClient("/auth/google", { method: "POST", body: payload });
};

export const getMe = () => {
    return apiClient<ApiResponse<User>>("/auth/me");
};
