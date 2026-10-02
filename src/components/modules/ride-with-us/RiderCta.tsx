import Link from "next/link";
import CtaLink from "@/components/modules/landing/CtaLink";
import {
  Container,
  RoutePath,
  SvgPulseDot,
} from "@/components/modules/landing/decor";
import { Reveal } from "@/components/modules/landing/motion";
import { ROUTES } from "@/constants";

export default function RiderCta() {
  return (
    <section
      aria-labelledby="rider-cta-heading"
      className="bg-accent py-16 sm:py-20"
    >
      <Container>
        <Reveal amount={0.4}>
          <div className="relative overflow-hidden rounded-[2rem] bg-brand-ink px-6 py-14 text-center text-white sm:px-12 sm:py-16 lg:py-20">
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute top-8 right-0 hidden h-27.5 w-110 overflow-visible text-brand-line md:block"
              viewBox="0 0 440 110"
              fill="none"
            >
              <RoutePath d="M14 30 C 110 0, 190 44, 290 62 C 360 74, 410 66, 460 52" />
              <SvgPulseDot cx={14} cy={30} />
            </svg>

            <h2
              id="rider-cta-heading"
              className="relative mx-auto max-w-2xl font-heading text-4xl leading-none font-bold tracking-[-0.045em] sm:text-5xl lg:text-6xl"
            >
              Ready to <span className="text-brand-orange">ride?</span>
            </h2>
            <p className="relative mx-auto mt-5 max-w-md text-[17px] leading-relaxed text-brand-muted">
              Apply online. Our team reviews every application and emails you as
              soon as you&rsquo;re reviewed.
            </p>
            <div className="relative mx-auto mt-9 flex max-w-xs flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
              <CtaLink href={ROUTES.riderApply} arrow>
                Apply as a rider
              </CtaLink>
              <CtaLink href={ROUTES.login} variant="outline">
                Rider log in
              </CtaLink>
            </div>
            <p className="relative mt-8 text-sm text-brand-muted">
              Sending parcels instead?{" "}
              <Link
                href={ROUTES.howItWorks}
                className="rounded-sm font-heading font-bold text-white underline decoration-brand-orange decoration-2 underline-offset-4 outline-none transition-colors hover:text-brand-orange focus-visible:ring-3 focus-visible:ring-brand-orange/50"
              >
                See how it works
              </Link>
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
