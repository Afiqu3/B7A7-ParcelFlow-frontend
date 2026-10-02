"use client";

import { type ReactNode, useState } from "react";
import { SECTION_IDS } from "@/constants";
import { useGetAllPricingRule } from "@/hooks";
import { scrollToSection } from "@/lib/scroll";
import type { ParcelCategory, ZoneType } from "@/types";
import Estimator from "./Estimator";
import { PricingEmpty, PricingError, RateCardsSkeleton } from "./PricingStates";
import { CATEGORY_ORDER, ZONE_ORDER } from "./pricing-meta";
import { CategorySwitch, RateCardGrid, RatesSection } from "./RateCards";

/**
 * Data-driven part of the pricing page: the rate cards and the estimator.
 * Zone and parcel type live here so "Estimate a … delivery" on a card can
 * preselect the estimator.
 */
export default function Pricing() {
  const { data: rules, isError, isFetching, refetch } = useGetAllPricingRule();
  const [zone, setZone] = useState<ZoneType>("INSIDE_CITY");
  const [category, setCategory] = useState<ParcelCategory>("PARCEL");

  const zones = ZONE_ORDER.filter((z) => rules?.some((r) => r.zoneType === z));
  const categories = CATEGORY_ORDER.filter((c) =>
    rules?.some((r) => r.parcelCategory === c),
  );
  // Fall back if the current pick disappears (e.g. a rule is switched off).
  const activeZone = zones.includes(zone) ? zone : zones[0];
  const activeCategory = categories.includes(category)
    ? category
    : categories[0];
  const ready = Boolean(rules?.length && activeZone && activeCategory);

  let content: ReactNode;
  if (!rules) {
    // `rules` survives a failed background refetch, so the error only shows
    // when there's nothing cached to fall back on.
    content = isError ? (
      <PricingError onRetry={() => refetch()} retrying={isFetching} />
    ) : (
      <RateCardsSkeleton />
    );
  } else if (!ready) {
    content = <PricingEmpty />;
  } else {
    content = (
      <RateCardGrid
        rules={rules}
        zones={zones}
        category={activeCategory}
        onEstimate={(nextZone) => {
          setZone(nextZone);
          scrollToSection(SECTION_IDS.estimator);
        }}
      />
    );
  }

  // Same element tree in every state, so the section heading doesn't
  // remount (and replay its reveal) when the data arrives.
  return (
    <>
      <RatesSection
        toolbar={
          ready && categories.length > 1 ? (
            <CategorySwitch
              categories={categories}
              value={activeCategory}
              onValueChange={setCategory}
            />
          ) : null
        }
      >
        {content}
      </RatesSection>

      {rules && ready ? (
        <Estimator
          rules={rules}
          zones={zones}
          categories={categories}
          zone={activeZone}
          category={activeCategory}
          onZoneChange={setZone}
          onCategoryChange={setCategory}
        />
      ) : null}
    </>
  );
}
