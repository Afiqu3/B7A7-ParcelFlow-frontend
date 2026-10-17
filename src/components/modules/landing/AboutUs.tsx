import {
  type LucideIcon,
  PackageCheck,
  Route,
  Truck,
  Wallet,
} from "lucide-react";
import { SECTION_IDS } from "@/constants";
import { Container, Eyebrow } from "./decor";
import { Reveal, RevealGroup, RevealItem } from "./motion";

const COMMITMENTS: { title: string; body: string; icon: LucideIcon }[] = [
  {
    title: "Local riders, local streets",
    body: "Our riders know the lanes and landmarks of the areas they cover — so parcels keep moving.",
    icon: Route,
  },
  {
    title: "Honest, upfront pricing",
    body: "The price you see before you book is the price you pay. Nothing extra at the door.",
    icon: Wallet,
  },
  {
    title: "Care at every handoff",
    body: "Every parcel is tracked and scanned along the way, from pickup to delivery.",
    icon: PackageCheck,
  },
];

export default function AboutUs() {
  return (
    <section
      id={SECTION_IDS.about}
      aria-labelledby="about-heading"
      className="scroll-mt-16 bg-brand text-white py-20 sm:py-24 lg:py-28"
    >
      <Container className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <Reveal amount={0.3}>
          <div className="group relative">
            <div className="overflow-hidden rounded-3xl shadow-[0_24px_48px_-28px_rgba(2,6,23,0.5)] ring-1 ring-white/10">
              {/* biome-ignore lint/performance/noImgElement: static export (output: "export") has no image optimizer; explicit width/height keeps CLS at zero. */}
              <img
                src="/assets/about-us.jpg"
                alt="A delivery van in motion on a tree-lined street"
                width={6240}
                height={4160}
                loading="lazy"
                decoding="async"
                className="aspect-3/2 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
            </div>

            {/* Floating caption pinned over the photo's bottom edge */}
            <div
              aria-hidden
              className="absolute -bottom-6 left-5 flex items-center gap-3 rounded-2xl bg-brand-card py-3 pr-5 pl-3 shadow-[0_20px_45px_-24px_rgba(2,6,23,0.85)] ring-1 ring-white/10 sm:left-7"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-orange text-brand-ink">
                <Truck className="size-5" strokeWidth={2.25} />
              </span>
              <span>
                <span className="block font-heading text-sm font-bold text-white">
                  On the road daily
                </span>
                <span className="block text-xs text-brand-muted">
                  From pickup to doorstep
                </span>
              </span>
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <Eyebrow tone="onDark">About us</Eyebrow>
            <h2
              id="about-heading"
              className="mt-4 max-w-lg font-heading text-4xl leading-[1.02] font-bold tracking-[-0.04em] sm:text-5xl"
            >
              The team behind every delivery.
            </h2>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-brand-muted">
              ParcelFlow is a courier platform for Bangladeshi merchants. We
              handle pickup, delivery and payment collection, so you can focus
              on selling — with clear pricing, live tracking and riders who know
              the streets they serve.
            </p>
          </Reveal>

          <RevealGroup className="mt-9 grid gap-6" interval={0.1}>
            {COMMITMENTS.map(({ title, body, icon: Icon }) => (
              <RevealItem key={title}>
                <div className="flex items-start gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-orange text-brand-ink">
                    <Icon aria-hidden className="size-5" strokeWidth={2.25} />
                  </span>
                  <div>
                    <h3 className="font-heading text-[17px] font-bold tracking-tight">
                      {title}
                    </h3>
                    <p className="mt-1 text-[15px] leading-relaxed text-brand-muted">
                      {body}
                    </p>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Container>
    </section>
  );
}
