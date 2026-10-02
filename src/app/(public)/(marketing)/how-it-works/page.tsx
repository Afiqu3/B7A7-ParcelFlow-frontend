import type { Metadata } from "next";
import HowItWorks from "@/components/modules/how-it-works/how-it-works";
import StepIndex from "@/components/modules/how-it-works/StepIndex";
import CtaLink from "@/components/modules/landing/CtaLink";
import FinalCta from "@/components/modules/landing/FinalCta";
import PageHero from "@/components/shared/PageHero";
import { ROUTES } from "@/constants";

export const metadata: Metadata = {
  title: "How it works — ParcelFlow",
  description:
    "Create a parcel, pay with bKash or cash on delivery, and follow it from pickup to your customer's door.",
};

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        headingId="how-it-works-heading"
        eyebrow="How it works"
        lines={[
          { text: "From your shelf" },
          { text: "to their door.", accent: true },
        ]}
        description={
          <p>
            Book a pickup, pay your way and track every parcel live.
            Here&rsquo;s what happens at each step.
          </p>
        }
        actions={
          <>
            <CtaLink href={ROUTES.register} arrow>
              Create merchant account
            </CtaLink>
            <CtaLink href={ROUTES.pricing} variant="outline">
              See pricing
            </CtaLink>
          </>
        }
        aside={<StepIndex />}
      />
      <HowItWorks />
      <FinalCta />
    </>
  );
}
