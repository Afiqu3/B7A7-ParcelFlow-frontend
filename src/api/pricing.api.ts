import apiClient from "@/lib/apiClient";
import type { ApiResponse, Pricing } from "@/types";

export const getAllPricingRule = () => {
  return apiClient<ApiResponse<Pricing[]>>("/rule");
};
