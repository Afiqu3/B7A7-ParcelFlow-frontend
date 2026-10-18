import type { Metadata } from "next";
import About from "@/components/modules/about/About";
import AtAGlance from "@/components/modules/about/AtAGlance";
import CtaLink from "@/components/modules/landing/CtaLink";
import FinalCta from "@/components/modules/landing/FinalCta";
import PageHero from "@/components/shared/PageHero";
import { ROUTES } from "@/constants";

export const metadata: Metadata = {
  title: "About us — ParcelFlow",
  description:
    "ParcelFlow is a courier platform built in Dhaka for Bangladeshi merchants — clear pricing, live tracking and riders who know the streets they serve.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        headingId="about-heading"
        eyebrow="About us"
        lines={[
          { text: "The people behind" },
          { text: "every delivery.", accent: true },
        ]}
        description={
          <p>
            ParcelFlow is a courier platform built in Dhaka for Bangladeshi
            merchants — clear pricing, live tracking and riders who know the
            streets they serve.
          </p>
        }
        actions={
          <>
            <CtaLink href={ROUTES.register} arrow>
              Create merchant account
            </CtaLink>
            <CtaLink href={ROUTES.howItWorks} variant="outline">
              How it works
            </CtaLink>
          </>
        }
        aside={<AtAGlance />}
      />
      <About />
      <FinalCta />
    </>
  );
}
