import apiClient from "@/lib/apiClient";
import type { ApiResponse, CreatePricingRulePayload, Pricing, UpdatePricingRulePayload } from "@/types";

export const getAllPricingRule = () => {
    return apiClient<ApiResponse<Pricing[]>>("/rule");
};

export const createPricingRule = (payload: CreatePricingRulePayload) => {
    return apiClient("/rule", {
        method: "POST",
        body: payload,
    });
};

export const updatePricingRule = (ruleId: string, payload: UpdatePricingRulePayload) => {
    return apiClient(`/rule/${ruleId}`, {
        method: "PATCH",
        body: payload,
    });
};
