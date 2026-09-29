import apiClient from "@/lib/apiClient";
import { ApiResponse, User } from "@/types";

export const getMe = () => {
  return apiClient<ApiResponse<User>>("/auth/me");
};