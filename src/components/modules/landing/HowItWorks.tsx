import { SECTION_IDS } from "@/constants";
import { cn } from "@/lib/utils";
import { Container, Eyebrow } from "./decor";
import { Reveal, RevealGroup, RevealItem } from "./motion";

const STEPS = [
  {
    title: "Create a parcel",
    body: "Enter pickup and delivery details. Your price appears instantly, worked out from weight, zone and speed.",
  },
  {
    title: "Pay your way",
    body: "Prepay with bKash, or choose cash on delivery and we collect from your customer at the door.",
  },
  {
    title: "We pick it up",
    body: "A rider collects from your address — or drop it at our hub yourself and skip the pickup charge.",
  },
  {
    title: "Delivered & tracked",
    body: "Follow every status change live. If nobody’s home, we try again — up to 3 attempts.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id={SECTION_IDS.howItWorks}
      aria-labelledby="how-it-works-heading"
      className="scroll-mt-16 bg-accent py-20 sm:py-24 lg:py-28"
    >
      <Container>
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-10">
          <Reveal>
            <Eyebrow>How it works</Eyebrow>
            <h2
              id="how-it-works-heading"
              className="mt-4 max-w-md font-heading text-4xl leading-[1.02] font-bold tracking-[-0.04em] text-secondary sm:text-5xl"
            >
              From your shelf to their door.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-sm text-[17px] leading-relaxed text-secondary/70 md:pb-1">
              Four steps, all from one dashboard. No calls, no guesswork about
              what it costs.
            </p>
          </Reveal>
        </div>

        <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:gap-5">
          {STEPS.map((step, i) => {
            const isLast = i === STEPS.length - 1;
            return (
              <RevealItem key={step.title} className="h-full">
                <article
                  className={cn(
                    "group h-full rounded-3xl p-6 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 lg:min-h-72",
                    isLast
                      ? "bg-brand text-white shadow-[0_24px_48px_-24px_rgba(15,32,86,0.7)]"
                      : "bg-white text-secondary hover:shadow-[0_24px_48px_-28px_rgba(15,32,86,0.35)]",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-12 place-items-center rounded-2xl font-heading text-lg font-bold transition-transform duration-300 group-hover:-rotate-6",
                      isLast
                        ? "bg-brand-orange text-brand-ink"
                        : "bg-brand text-brand-orange",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-6 font-heading text-xl font-bold tracking-tight">
                    {step.title}
                  </h3>
                  <p
                    className={cn(
                      "mt-3 text-[15px] leading-relaxed",
                      isLast ? "text-brand-muted" : "text-secondary/70",
                    )}
                  >
                    {step.body}
                  </p>
                </article>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </Container>
    </section>
  );
}
