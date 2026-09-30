import { Bike, Check, type LucideIcon, Motorbike, Truck } from "lucide-react";
import Link from "next/link";
import { ROUTES, SECTION_IDS } from "@/constants";
import CtaLink from "./CtaLink";
import { Container, Eyebrow } from "./decor";
import { Reveal, RevealGroup, RevealItem } from "./motion";

const REQUIREMENTS = [
  "National ID (NID)",
  "Driving license",
  "Vehicle papers",
  "A bike, bicycle or van",
];

const VEHICLES: { label: string; icon: LucideIcon }[] = [
  { label: "Bike", icon: Motorbike },
  { label: "Bicycle", icon: Bike },
  { label: "Van", icon: Truck },
];

const APPLY_STEPS = [
  { title: "Apply online", body: "Details, NID, license and vehicle papers." },
  {
    title: "Verify your email",
    body: "Enter the code we send within an hour.",
  },
  { title: "Get approved", body: "We email you as soon as you’re reviewed." },
];

export default function RideWithUs() {
  return (
    <section
      id={SECTION_IDS.riders}
      aria-labelledby="riders-heading"
      className="scroll-mt-16 bg-brand-orange py-20 text-brand-ink sm:py-24"
    >
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-16">
        <Reveal>
          <Eyebrow tone="onOrange">For riders</Eyebrow>
          <h2
            id="riders-heading"
            className="mt-4 font-heading text-5xl leading-[0.92] font-bold tracking-tighter sm:text-6xl lg:text-[4.25rem]"
          >
            Ride with
            <br />
            ParcelFlow.
          </h2>
          <p className="mt-6 max-w-md text-[17px] leading-relaxed text-brand-ink/85">
            Pick up and deliver parcels in your area. Apply online — our team
            reviews every application.
          </p>

          <ul className="mt-8 grid max-w-lg gap-x-6 gap-y-3 sm:grid-cols-2">
            {REQUIREMENTS.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2.5 font-heading text-[15px] font-semibold"
              >
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-ink">
                  <Check
                    className="size-3.5 text-brand-orange"
                    strokeWidth={3.5}
                  />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
            <CtaLink href={ROUTES.riderApply} variant="ink" arrow>
              Apply as a rider
            </CtaLink>
            <Link
              href={ROUTES.login}
              className="rounded-sm font-heading text-[15px] font-bold underline decoration-2 underline-offset-4 outline-none transition-colors hover:decoration-brand-ink/40 focus-visible:ring-3 focus-visible:ring-brand-ink/30"
            >
              Already a rider? Log in
            </Link>
          </div>
        </Reveal>

        <div>
          <RevealGroup
            className="grid grid-cols-3 gap-3 sm:gap-4"
            interval={0.1}
          >
            {VEHICLES.map(({ label, icon: Icon }) => (
              <RevealItem key={label}>
                <div className="group flex aspect-6/7 flex-col justify-between rounded-3xl bg-brand-ink p-4 transition-transform duration-300 hover:-translate-y-1.5 hover:-rotate-1 sm:p-6">
                  <Icon
                    aria-hidden
                    className="size-9 text-brand-orange transition-transform duration-500 ease-out group-hover:translate-x-2 sm:size-11"
                    strokeWidth={1.75}
                  />
                  <p className="font-heading text-lg font-bold text-white sm:text-2xl">
                    {label}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal delay={0.25} amount={0.4}>
            <ol className="mt-3 grid gap-6 rounded-3xl bg-brand-cream p-6 sm:mt-4 sm:grid-cols-3 sm:gap-5 sm:p-7">
              {APPLY_STEPS.map((step, i) => (
                <li key={step.title}>
                  <span className="font-heading text-lg font-bold text-brand-orange-ink">
                    {i + 1}
                  </span>
                  <p className="mt-1.5 font-heading text-[15px] font-bold text-secondary">
                    {step.title}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-secondary/70">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
