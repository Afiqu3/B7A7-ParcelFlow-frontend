"use client";

import {
  CheckCircle2,
  ChevronDown,
  Clock,
  MessageCircle,
  Truck,
  Users,
} from "lucide-react";
import { useState } from "react";
import { SECTION_IDS } from "@/constants";
import { cn } from "@/lib/utils";
import { Container, Eyebrow } from "./decor";
import { Reveal, RevealGroup, RevealItem } from "./motion";

const FAQ_ITEMS = [
  {
    question: "How is the delivery price calculated?",
    answer:
      "Pricing is based on three factors: parcel weight, delivery zone (Inside City, Sub-City, Outside City) and the speed tier you choose (Same Day, Express 24h, Regular 48-72h). The exact amount is shown before you confirm the booking — no hidden fees.",
  },
  {
    question: "What payment methods do you support?",
    answer:
      "Prepay with bKash (instant refund if you cancel before pickup) or choose Cash on Delivery and we collect from your customer at the door. COD amount is transferred to your wallet the next business day.",
  },
  {
    question: "How many delivery attempts are made?",
    answer:
      "Up to 3 attempts. If nobody is available, the rider leaves a notice and we contact the recipient to reschedule. After 3 failed attempts the parcel is returned to you.",
  },
  {
    question: "Can I drop off parcels myself to save the pickup fee?",
    answer:
      "Yes — drop your parcels at any ParcelFlow hub and the pickup charge is waived. Hub locations and hours are shown in your dashboard.",
  },
  {
    question: "What happens if a parcel is damaged or lost?",
    answer:
      "Every parcel is insured up to ৳5,000 by default. You can declare a higher value at booking for a small additional fee. Claims are resolved within 12 hours on average.",
  },
  {
    question: "Do you deliver outside major cities?",
    answer:
      "Yes — our Outside City zone covers district towns and upazilas nationwide. Remote areas may add 24h to the Regular timeline; you'll see the exact ETA at checkout.",
  },
];

const METRICS = [
  { value: "99%", label: "On-time delivery", icon: CheckCircle2 },
  { value: "3", label: "Delivery attempts", icon: Clock },
  { value: "500+", label: "Active riders", icon: Truck },
  { value: "12h", label: "Avg. resolution", icon: Users },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id={SECTION_IDS.faq}
      aria-labelledby="faq-heading"
      className="scroll-mt-16 bg-accent py-20 sm:py-24 lg:py-28"
    >
      <Container>
        {/* Header */}
        <Reveal>
          <div className="max-w-3xl">
            <Eyebrow>Frequently asked</Eyebrow>
            <h2
              id="faq-heading"
              className="mt-4 font-heading text-4xl leading-[1.02] font-bold tracking-[-0.04em] text-secondary sm:text-5xl lg:text-6xl"
            >
              Questions?
              <br />
              <span className="text-brand-orange">We've got answers.</span>
            </h2>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-secondary/70">
              Everything merchants and riders ask most — pricing, COD, coverage,
              claims and more.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-2 lg:items-start lg:gap-14">
          {/* Visual + trust metrics */}
          <div>
            <Reveal amount={0.25}>
              <div className="group relative">
                <div className="overflow-hidden rounded-3xl shadow-[0_28px_56px_-32px_rgba(15,32,86,0.5)] ring-1 ring-secondary/10 dark:ring-white/10 dark:shadow-[0_28px_56px_-32px_rgba(0,0,0,0.85)]">
                  {/* biome-ignore lint/performance/noImgElement: static export (output: "export") has no image optimizer; explicit width/height keeps CLS at zero. */}
                  <img
                    src="/assets/faq.jpg"
                    alt="A field of 3D question marks with one glowing orange"
                    width={3840}
                    height={2160}
                    loading="lazy"
                    decoding="async"
                    className="aspect-video w-full object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out motion-safe:group-hover:scale-[1.03]"
                  />
                </div>

                {/* Floating support chip */}
                <div
                  aria-hidden
                  className="absolute -bottom-5 left-5 flex items-center gap-3 rounded-2xl bg-white py-3 pr-5 pl-3 shadow-[0_20px_45px_-24px_rgba(15,32,86,0.55)] ring-1 ring-secondary/10 sm:left-7 dark:bg-card dark:ring-white/10 dark:shadow-[0_20px_45px_-24px_rgba(0,0,0,0.85)]"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-orange text-brand-ink">
                    <MessageCircle className="size-5" strokeWidth={2.25} />
                  </span>
                  <span>
                    <span className="block font-heading text-sm font-bold text-secondary">
                      Quick answers
                    </span>
                    <span className="block text-xs text-secondary/60">
                      Replies within 12 hours
                    </span>
                  </span>
                </div>
              </div>
            </Reveal>

            <RevealGroup
              className="mt-11 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-2"
              interval={0.07}
            >
              {METRICS.map(({ value, label, icon: Icon }) => (
                <RevealItem key={label}>
                  <div className="flex h-full items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-secondary/10 dark:bg-card dark:ring-white/10">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-orange/15 text-brand-orange">
                      <Icon aria-hidden className="size-5" strokeWidth={2.25} />
                    </span>
                    <span>
                      <span className="block font-heading text-xl font-extrabold tracking-tight text-secondary">
                        {value}
                      </span>
                      <span className="block text-xs leading-snug text-secondary/60">
                        {label}
                      </span>
                    </span>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>

          {/* Accordion */}
          <RevealGroup
            className="grid max-w-3xl gap-3 sm:gap-4 lg:max-w-none"
            interval={0.08}
          >
            {FAQ_ITEMS.map(({ question, answer }, index) => {
              const isOpen = openIndex === index;
              const triggerId = `${SECTION_IDS.faq}-trigger-${index}`;
              const panelId = `${SECTION_IDS.faq}-panel-${index}`;

              return (
                <RevealItem key={question}>
                  <div className="rounded-2xl bg-white ring-1 ring-secondary/10 transition-[box-shadow,transform] duration-300 has-[button:focus-visible]:ring-2 has-[button:focus-visible]:ring-brand-orange/60 hover:shadow-[0_24px_48px_-24px_rgba(15,32,86,0.35)] hover:ring-brand-orange/30 dark:bg-card dark:ring-white/10 dark:hover:shadow-[0_24px_48px_-24px_rgba(0,0,0,0.8)]">
                    <h3>
                      <button
                        type="button"
                        id={triggerId}
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() =>
                          setOpenIndex((prev) =>
                            prev === index ? null : index,
                          )
                        }
                        className="flex w-full cursor-pointer items-center justify-between gap-4 p-5 text-left outline-none sm:p-6"
                      >
                        <span className="font-heading text-[16px] font-bold tracking-tight text-secondary sm:text-[17px]">
                          {question}
                        </span>
                        <span
                          className={cn(
                            "grid size-9 shrink-0 place-items-center rounded-full bg-accent text-secondary/60 transition-colors duration-300",
                            isOpen && "bg-brand-orange text-brand-ink",
                          )}
                        >
                          <ChevronDown
                            aria-hidden
                            strokeWidth={2.5}
                            className={cn(
                              "size-4 transition-transform duration-300 ease-out",
                              isOpen && "rotate-180",
                            )}
                          />
                        </span>
                      </button>
                    </h3>

                    {/*
                      Expand/collapse animates `grid-template-rows` between 0fr and
                      1fr. The grid item itself must clip its overflow (or set
                      min-height: 0) — otherwise its automatic minimum height keeps
                      the row expanded at content size and every answer stays visible.
                    */}
                    <section
                      id={panelId}
                      aria-labelledby={triggerId}
                      aria-hidden={!isOpen}
                      className="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none"
                      style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                    >
                      <div className="min-h-0 overflow-hidden">
                        <div
                          className={cn(
                            "px-5 pb-5 leading-relaxed text-secondary/70 transition-[opacity,transform,translate] duration-300 ease-out motion-reduce:transition-none sm:px-6 sm:pb-6",
                            isOpen
                              ? "translate-y-0 opacity-100"
                              : "-translate-y-1 opacity-0",
                          )}
                        >
                          <p>{answer}</p>
                        </div>
                      </div>
                    </section>
                  </div>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </Container>
    </section>
  );
}
