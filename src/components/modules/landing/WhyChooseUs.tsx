import {
  CheckCircle2,
  Clock,
  type LucideIcon,
  ShieldCheck,
  Truck,
  Users,
  Wallet,
} from "lucide-react";
import { SECTION_IDS } from "@/constants";
import { Container, Eyebrow } from "./decor";
import { Reveal, RevealGroup, RevealItem } from "./motion";

const METRICS = [
  { value: "99%", label: "On-time delivery", icon: CheckCircle2 },
  { value: "3", label: "Delivery attempts", icon: Clock },
  { value: "500+", label: "Active riders", icon: Truck },
  { value: "12h", label: "Avg. resolution", icon: Users },
];

const REASONS: { title: string; body: string; icon: LucideIcon }[] = [
  {
    title: "Built for Bangladesh",
    body: "Pricing, pickup logic and COD flows designed around how merchants actually ship here — not imported from abroad.",
    icon: ShieldCheck,
  },
  {
    title: "Riders who know the streets",
    body: "Our network is local. Riders navigate by landmarks and lanes, not just GPS, so parcels don't stall at the last kilometre.",
    icon: Truck,
  },
  {
    title: "Transparent, predictable cost",
    body: "Weight, zone and speed determine the price — shown before you book. No surprise surcharges at pickup or delivery.",
    icon: Wallet,
  },
];

export default function WhyChooseUs() {
  return (
    <section
      id={SECTION_IDS.whyChooseUs}
      aria-labelledby="why-choose-us-heading"
      className="scroll-mt-16 bg-brand text-white py-20 sm:py-24 lg:py-28"
    >
      <Container>
        {/* Header */}
        <Reveal>
          <div className="max-w-3xl">
            <Eyebrow tone="onDark">Why ParcelFlow</Eyebrow>
            <h2
              id="why-choose-us-heading"
              className="mt-4 font-heading text-4xl leading-[1.02] font-bold tracking-[-0.04em] sm:text-5xl lg:text-6xl"
            >
              The courier partner
              <br />
              <span className="text-brand-orange">merchants trust.</span>
            </h2>
            <p className="mt-6 text-[17px] leading-relaxed text-brand-muted max-w-xl">
              Every feature is built around how Bangladeshi merchants actually
              ship — from COD collection to multi-attempt delivery.
            </p>
          </div>
        </Reveal>

        {/* Metrics strip */}
        <RevealGroup
          className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-6"
          interval={0.08}
        >
          {METRICS.map(({ value, label, icon: Icon }) => (
            <RevealItem key={label}>
              <div className="rounded-2xl bg-brand-card p-5 ring-1 ring-white/5 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgba(2,6,23,0.6)] hover:ring-brand-orange/30">
                <span className="grid size-11 place-items-center rounded-xl bg-brand-orange/15 text-brand-orange">
                  <Icon aria-hidden className="size-5" strokeWidth={2.25} />
                </span>
                <p className="mt-5 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
                  {value}
                </p>
                <p className="mt-1.5 text-sm text-brand-muted">{label}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* Photo + trust badge */}
        <Reveal amount={0.35} className="mt-14">
          <div className="group relative">
            <div className="overflow-hidden rounded-3xl shadow-[0_32px_64px_-32px_rgba(2,6,23,0.6)] ring-1 ring-white/10 aspect-4/3 sm:aspect-video">
              {/* biome-ignore lint/performance/noImgElement: static export (output: "export") has no image optimizer; explicit width/height keeps CLS at zero. */}
              <img
                src="/assets/why-choose-us.jpg"
                alt="A ParcelFlow rider handing a parcel to a happy customer at a shopfront"
                width={2750}
                height={2062}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              />
            </div>

            {/* Floating stat badge */}
            <div
              aria-hidden
              className="absolute -bottom-6 left-5 flex items-center gap-3 rounded-2xl bg-brand-card py-3 pr-5 pl-3 shadow-[0_20px_45px_-24px_rgba(2,6,23,0.85)] ring-1 ring-white/10 sm:left-7"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-orange text-brand-ink">
                <ShieldCheck className="size-5" strokeWidth={2.25} />
              </span>
              <span>
                <span className="block font-heading text-sm font-bold text-white">
                  Trusted by merchants
                </span>
                <span className="block text-xs text-brand-muted">
                  99% on-time delivery rate
                </span>
              </span>
            </div>
          </div>
        </Reveal>

        {/* Reason cards - alternating layout */}
        <RevealGroup className="mt-14 grid gap-6 lg:grid-cols-3" interval={0.1}>
          {REASONS.map(({ title, body, icon: Icon }, index) => (
            <RevealItem key={title}>
              <article className="rounded-3xl bg-brand-card p-6 ring-1 ring-white/5 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgba(2,6,23,0.6)] hover:ring-brand-orange/30 lg:col-span-1">
                <span className="grid size-12 place-items-center rounded-xl bg-brand-orange text-brand-ink">
                  <Icon aria-hidden className="size-5.5" strokeWidth={2.25} />
                </span>
                <h3 className="mt-5 font-heading text-xl font-bold tracking-tight">
                  {title}
                </h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-brand-muted">
                  {body}
                </p>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
