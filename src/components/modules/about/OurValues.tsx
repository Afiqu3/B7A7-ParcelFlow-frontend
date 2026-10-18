import {
  HeartHandshake,
  type LucideIcon,
  MapPin,
  PackageCheck,
  Wallet,
} from "lucide-react";
import { Container, Eyebrow } from "@/components/modules/landing/decor";
import {
  Reveal,
  RevealGroup,
  RevealItem,
} from "@/components/modules/landing/motion";

const VALUES: { title: string; body: string; icon: LucideIcon }[] = [
  {
    title: "Merchants first",
    body: "Every decision starts with the merchant shipping on our platform — clearer pricing, honest timelines, no surprises.",
    icon: HeartHandshake,
  },
  {
    title: "Handle with care",
    body: "Parcels are scanned at every handoff and insured up to ৳5,000 by default, with claims resolved in 12 hours on average.",
    icon: PackageCheck,
  },
  {
    title: "Local by design",
    body: "Our riders navigate by streets, lanes and landmarks — not just GPS — so parcels don’t stall at the last kilometre.",
    icon: MapPin,
  },
  {
    title: "Clear from the start",
    body: "Weight, zone and speed decide the price, and you see it before you book. What’s quoted is what you pay.",
    icon: Wallet,
  },
];

/** What ParcelFlow stands for, as four commitment cards. */
export default function OurValues() {
  return (
    <section
      aria-labelledby="about-values-heading"
      className="bg-brand py-20 text-white sm:py-24 lg:py-28"
    >
      <Container>
        <Reveal>
          <div className="max-w-3xl">
            <Eyebrow tone="onDark">What we stand for</Eyebrow>
            <h2
              id="about-values-heading"
              className="mt-4 font-heading text-4xl leading-[1.02] font-bold tracking-[-0.04em] sm:text-5xl lg:text-6xl"
            >
              Values you can see
              <br />
              <span className="text-brand-orange">in every delivery.</span>
            </h2>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-brand-muted">
              Four commitments run through everything we build — from the
              booking form to the final knock at the door.
            </p>
          </div>
        </Reveal>

        <RevealGroup
          className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
          interval={0.1}
        >
          {VALUES.map(({ title, body, icon: Icon }) => (
            <RevealItem key={title}>
              <article className="h-full rounded-3xl bg-brand-card p-6 ring-1 ring-white/5 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgba(2,6,23,0.6)] hover:ring-brand-orange/30">
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
