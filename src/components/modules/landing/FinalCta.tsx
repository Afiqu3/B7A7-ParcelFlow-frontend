import { ROUTES } from "@/constants";
import CtaLink from "./CtaLink";
import { Container, RoutePath, SvgPulseDot } from "./decor";
import { Reveal } from "./motion";

export default function FinalCta() {
  return (
    <section aria-labelledby="cta-heading" className="bg-accent py-16 sm:py-20">
      <Container>
        <Reveal amount={0.4}>
          <div className="relative overflow-hidden rounded-[2rem] bg-brand px-6 py-16 text-center text-white sm:px-12 sm:py-20 lg:py-24">
            {/* Decorative dotted routes */}
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute top-6 right-0 hidden h-27.5 w-110 overflow-visible text-brand-line md:block"
              viewBox="0 0 440 110"
              fill="none"
            >
              <RoutePath d="M14 30 C 110 0, 190 44, 290 62 C 360 74, 410 66, 460 52" />
              <SvgPulseDot cx={14} cy={30} />
            </svg>
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute bottom-8 left-0 hidden h-30 w-105 overflow-visible text-brand-line md:block"
              viewBox="0 0 420 120"
              fill="none"
            >
              <RoutePath d="M-20 40 C 60 12, 150 26, 230 62 C 290 90, 330 104, 380 102" />
              <SvgPulseDot cx={380} cy={102} />
            </svg>

            <h2
              id="cta-heading"
              className="relative mx-auto max-w-3xl font-heading text-4xl leading-none font-bold tracking-[-0.045em] sm:text-5xl lg:text-6xl"
            >
              Ready to send your{" "}
              <span className="text-brand-orange">first parcel?</span>
            </h2>
            <p className="relative mx-auto mt-5 max-w-md text-[17px] leading-relaxed text-brand-muted">
              Create a free merchant account and see your price before you book.
            </p>
            <div className="relative mx-auto mt-9 flex max-w-xs flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
              <CtaLink href={ROUTES.register} arrow>
                Create merchant account
              </CtaLink>
              <CtaLink href={ROUTES.login} variant="outline">
                Log in
              </CtaLink>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
