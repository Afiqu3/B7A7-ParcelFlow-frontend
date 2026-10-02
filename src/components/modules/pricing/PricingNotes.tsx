import {
  Banknote,
  Lock,
  type LucideIcon,
  RotateCw,
  Warehouse,
} from "lucide-react";
import { Container, Eyebrow } from "@/components/modules/landing/decor";
import {
  Reveal,
  RevealGroup,
  RevealItem,
} from "@/components/modules/landing/motion";

const NOTES: { title: string; body: string; icon: LucideIcon }[] = [
  {
    title: "Locked at booking",
    body: "The price shown when you create a parcel is the price you pay, even if our rates change later.",
    icon: Lock,
  },
  {
    title: "Drop off, skip the pickup fee",
    body: "Bring parcels to a ParcelFlow hub yourself and the rider pickup charge comes off.",
    icon: Warehouse,
  },
  {
    title: "COD fee on cash only",
    body: "The COD fee is a percentage of the cash we collect at the door. Prepaid bKash parcels don’t pay it.",
    icon: Banknote,
  },
  {
    title: "Up to 3 delivery attempts",
    body: "Nobody home? We try again — up to 3 times before a parcel comes back to you.",
    icon: RotateCw,
  },
];

export default function PricingNotes() {
  return (
    <section
      aria-labelledby="pricing-notes-heading"
      className="bg-white py-20 sm:py-24"
    >
      <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Reveal>
          <Eyebrow>Good to know</Eyebrow>
          <h2
            id="pricing-notes-heading"
            className="mt-4 max-w-sm font-heading text-4xl leading-[1.02] font-bold tracking-[-0.04em] text-secondary sm:text-5xl"
          >
            The small print, in plain words.
          </h2>
        </Reveal>

        <RevealGroup className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
          {NOTES.map(({ title, body, icon: Icon }) => (
            <RevealItem key={title}>
              <div className="group">
                <span className="grid size-11 place-items-center rounded-xl bg-brand text-brand-orange transition-transform duration-300 group-hover:-rotate-6">
                  <Icon className="size-5" strokeWidth={2.25} />
                </span>
                <h3 className="mt-5 font-heading text-lg font-bold tracking-tight text-secondary">
                  {title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-secondary/70">
                  {body}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
