import { useQuery } from "@tanstack/react-query";
import { getAllPricingRule } from "@/api";
import { toPricingRule } from "@/lib/pricing";

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
