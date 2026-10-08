import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPricingRule, getAllPricingRule, updatePricingRule } from "@/api";
import { toPricingRule } from "@/lib/pricing";
import type { UpdatePricingRulePayload } from "@/types";

export const pricingRulesQueryKey = ["pricing-rules"] as const;

/** Active pricing rules, with their decimal strings parsed into numbers. */
export const useGetAllPricingRule = () => {
    return useQuery({
        queryKey: pricingRulesQueryKey,
        queryFn: getAllPricingRule,
        select: (res) =>
            res.data.filter((rule) => rule.isActive).map(toPricingRule),
        // Rates rarely change, so there's no need to refetch on every visit.
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });
};

export const useCreatePricingRule = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createPricingRule,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: pricingRulesQueryKey });
        },
    });
};
export const useUpdatePricingRule = (ruleId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: UpdatePricingRulePayload) =>
            updatePricingRule(ruleId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: pricingRulesQueryKey });
        },
    });
};

/** Every rule including inactive ones, for the admin management page. */
export const useAdminPricingRules = () => {
    return useQuery({
        queryKey: [...pricingRulesQueryKey, "admin"],
        queryFn: getAllPricingRule,
        select: (res) => res.data.map(toPricingRule),
        retry: 1,
    });
};
