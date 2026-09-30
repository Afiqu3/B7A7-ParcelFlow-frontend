import {
  Banknote,
  ChartLine,
  FileText,
  type LucideIcon,
  Package,
  RotateCw,
  Smartphone,
} from "lucide-react";
import { SECTION_IDS } from "@/constants";
import { Container, Eyebrow } from "./decor";
import { Reveal, RevealGroup, RevealItem } from "./motion";

const FEATURES: { title: string; body: string; icon: LucideIcon }[] = [
  {
    title: "bKash checkout",
    body: "Prepaid parcels are paid through bKash. Cancel before pickup and the refund goes back automatically.",
    icon: Smartphone,
  },
  {
    title: "Cash on delivery",
    body: "Sell without asking customers to pay first. Riders collect the COD amount at the door.",
    icon: Banknote,
  },
  {
    title: "Pickup or drop-off",
    body: "Book a rider to your door, or drop parcels at the hub yourself and pay no pickup charge.",
    icon: Package,
  },
  {
    title: "Invoices in one click",
    body: "Download a PDF invoice for any parcel, with the full charge breakdown and payment status.",
    icon: FileText,
  },
  {
    title: "Your numbers, live",
    body: "Parcels by status, spend, COD collected and 30-day trends — right on your dashboard.",
    icon: ChartLine,
  },
  {
    title: "Retries, not returns",
    body: "Missed delivery? We re-attempt — up to 3 tries before a parcel comes back to you.",
    icon: RotateCw,
  },
];

export default function Features() {
  return (
    <section
      id={SECTION_IDS.features}
      aria-labelledby="features-heading"
      className="scroll-mt-16 bg-brand py-20 text-white sm:py-24 lg:py-28"
    >
      <Container>
        <Reveal>
          <Eyebrow tone="onDark">Features</Eyebrow>
          <h2
            id="features-heading"
            className="mt-4 max-w-2xl font-heading text-4xl leading-[1.02] font-bold tracking-[-0.04em] sm:text-5xl"
          >
            Built for merchants who ship every day.
          </h2>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-5">
          {FEATURES.map(({ title, body, icon: Icon }) => (
            <RevealItem key={title} className="h-full">
              <article className="group h-full rounded-3xl bg-brand-card p-7 ring-1 ring-white/5 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgba(2,6,23,0.8)] hover:ring-brand-orange/30">
                <span className="grid size-11 place-items-center rounded-xl bg-brand-orange text-brand-ink transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
                  <Icon className="size-5" strokeWidth={2.25} />
                </span>
                <h3 className="mt-6 font-heading text-xl font-bold tracking-tight">
                  {title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-brand-muted">
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
