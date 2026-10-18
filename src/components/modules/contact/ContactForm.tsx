"use client";

import { useForm } from "@tanstack/react-form";
import {
  ArrowRight,
  Check,
  CircleHelp,
  type LucideIcon,
  Receipt,
  RotateCcw,
  SendHorizontal,
  Truck,
} from "lucide-react";
import { AnimatePresence, motion, stagger, type Variants } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import {
  errorMotion,
  labelSwapMotion,
  useShake,
} from "@/components/form/form-motion";
import { ctaVariants } from "@/components/modules/landing/CtaLink";
import {
  Container,
  Eyebrow,
  PulseDot,
} from "@/components/modules/landing/decor";
import { EASE_OUT, Reveal } from "@/components/modules/landing/motion";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { ROUTES, SECTION_IDS, SUPPORT } from "@/constants";
import { cn } from "@/lib/utils";
import { CONTACT_TOPICS, contactSchema } from "@/validation";

const CHECKLIST = [
  "The tracking ID from your dashboard, if it’s about a parcel in transit.",
  "The email address you booked with, so we can find your account fast.",
  "Screenshots or photos, whenever something doesn’t look right.",
];

const QUICK_LINKS: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "See delivery pricing", href: ROUTES.pricing, icon: Receipt },
  { label: "How ParcelFlow works", href: ROUTES.howItWorks, icon: CircleHelp },
  { label: "Apply to ride with us", href: ROUTES.riderApply, icon: Truck },
];

const list: Variants = {
  hidden: {},
  visible: {
    transition: { delayChildren: stagger(0.1, { startDelay: 0.1 }) },
  },
};

const row: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: EASE_OUT } },
};

// The tick pops in just after its row arrives.
const tick: Variants = {
  hidden: { scale: 0 },
  visible: {
    scale: 1,
    transition: { type: "spring", stiffness: 500, damping: 20, delay: 0.15 },
  },
};

// `bg-card` (not `bg-white`) so dark mode flips it via the theme token
// instead of the unlayered `.dark .bg-white` override, which would win
// over the checked chip's orange background.
const inputClass =
  "h-11 rounded-xl border-2 border-secondary/15 bg-card px-3.5 text-[15px] transition-[border-color,box-shadow] focus-visible:border-brand-orange focus-visible:ring-3 focus-visible:ring-brand-orange/40 md:text-[15px]";

const textareaClass =
  "min-h-36 resize-y rounded-xl border-2 border-secondary/15 bg-card px-3.5 py-3 text-[15px] transition-[border-color,box-shadow] focus-visible:border-brand-orange focus-visible:ring-3 focus-visible:ring-brand-orange/40 md:text-[15px]";

/** Animated show/hide for a field's validation message. */
function ErrorSlot({
  show,
  errors,
}: {
  show: boolean;
  errors: Array<{ message?: string } | undefined>;
}) {
  return (
    <AnimatePresence initial={false}>
      {show ? (
        <motion.div key="error" {...errorMotion} className="overflow-hidden">
          <FieldError errors={errors} />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/** The contact form section: guidance on the left, the form on the right. */
export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [receipt, setReceipt] = useState<{
    name: string;
    email: string;
  } | null>(null);
  const [formScope, shakeForm] = useShake<HTMLFormElement>();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      topic: "",
      message: "",
    },

    validators: {
      onSubmit: contactSchema,
    },

    onSubmitInvalid: () => {
      shakeForm();
    },

    onSubmit: async ({ value }) => {
      // The backend has no contact endpoint yet — this simulates the
      // round-trip so the pending and success states are exercisable.
      // Swap it for the real mutation call once `POST /contact` exists.
      await new Promise((resolve) => setTimeout(resolve, 900));
      setReceipt({ name: value.name.trim(), email: value.email.trim() });
      setSent(true);
    },
  });

  const sendAnother = () => {
    setSent(false);
    form.reset();
  };

  return (
    <section
      id={SECTION_IDS.contactForm}
      aria-labelledby="contact-form-heading"
      className="scroll-mt-20 bg-white py-20 sm:py-24 lg:py-28"
    >
      <Container className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-16">
        {/* Guidance */}
        <div>
          <Reveal>
            <Eyebrow>Send a message</Eyebrow>
            <h2
              id="contact-form-heading"
              className="mt-4 max-w-md font-heading text-4xl leading-[1.02] font-bold tracking-[-0.04em] text-secondary sm:text-5xl"
            >
              Tell us what you need.
            </h2>
            <p className="mt-6 max-w-md text-[17px] leading-relaxed text-secondary/70">
              One short message is enough — it lands with the team that can
              actually help. Three things make replies faster:
            </p>
          </Reveal>

          <motion.ul
            variants={list}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="mt-9 max-w-md divide-y divide-secondary/8 border-y border-secondary/8"
          >
            {CHECKLIST.map((entry) => (
              <motion.li
                key={entry}
                variants={row}
                className="flex items-start gap-4 py-4"
              >
                <motion.span
                  variants={tick}
                  className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-brand-orange"
                >
                  <Check
                    aria-hidden
                    className="size-4 text-brand-ink"
                    strokeWidth={3.5}
                  />
                </motion.span>
                <span className="text-[15px] leading-relaxed text-secondary/70">
                  {entry}
                </span>
              </motion.li>
            ))}
          </motion.ul>

          <Reveal delay={0.12}>
            <div className="mt-8 max-w-md rounded-2xl bg-accent p-4 ring-1 ring-secondary/10 sm:p-5 dark:ring-white/10">
              <p className="font-heading text-sm font-bold text-secondary">
                Looking for something specific?
              </p>
              <ul className="mt-2.5 flex flex-col gap-0.5">
                {QUICK_LINKS.map(({ label, href, icon: Icon }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="group flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-[15px] font-semibold text-secondary/75 outline-none transition-colors hover:bg-white hover:text-secondary focus-visible:ring-3 focus-visible:ring-brand-orange/40 dark:hover:bg-white/8"
                    >
                      <span className="inline-flex items-center gap-2.5">
                        <Icon
                          aria-hidden
                          className="size-4 text-brand-orange"
                          strokeWidth={2.25}
                        />
                        {label}
                      </span>
                      <ArrowRight
                        aria-hidden
                        className="size-4 shrink-0 text-secondary/40 transition-[transform,color] duration-200 group-hover:translate-x-0.5 group-hover:text-brand-orange"
                        strokeWidth={2.5}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-8 max-w-md text-sm leading-relaxed text-secondary/60">
              Prefer email? Write to{" "}
              <a
                href={`mailto:${SUPPORT.email}`}
                className="rounded-sm font-heading font-bold text-brand-orange-ink underline decoration-2 underline-offset-4 outline-none transition-colors hover:text-brand-orange focus-visible:ring-3 focus-visible:ring-brand-orange/40"
              >
                {SUPPORT.email}
              </a>{" "}
              and we’ll reply within 12 hours.
            </p>
          </Reveal>
        </div>

        {/* Form card */}
        <Reveal delay={0.08} amount={0.15}>
          <div className="rounded-3xl bg-accent p-5 ring-1 ring-secondary/10 sm:p-7 lg:p-8 dark:ring-white/10">
            <AnimatePresence mode="wait" initial={false}>
              {sent && receipt ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 18, scale: 0.985 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{
                    opacity: 0,
                    y: -12,
                    transition: { duration: 0.18, ease: EASE_OUT },
                  }}
                  transition={{ duration: 0.45, ease: EASE_OUT }}
                  role="status"
                  className="grid place-items-center px-2 py-14 text-center sm:py-20"
                >
                  <motion.span
                    initial={{ scale: 0, rotate: -18 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 320,
                      damping: 18,
                      delay: 0.15,
                    }}
                    className="grid size-16 place-items-center rounded-full bg-brand-orange text-brand-ink shadow-[0_18px_40px_-18px_var(--color-brand-orange)]"
                  >
                    <Check aria-hidden className="size-8" strokeWidth={3} />
                  </motion.span>

                  <h3 className="mt-6 font-heading text-2xl font-bold tracking-tight text-secondary sm:text-3xl">
                    Message received
                  </h3>
                  <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-secondary/70">
                    Thanks {receipt.name.split(" ")[0]} — we’ve got it. Expect a
                    reply at{" "}
                    <span className="font-heading font-bold text-secondary">
                      {receipt.email}
                    </span>{" "}
                    within 12 hours.
                  </p>

                  <button
                    type="button"
                    onClick={sendAnother}
                    className="mt-8 inline-flex items-center gap-2 rounded-sm font-heading text-[15px] font-bold text-brand-orange-ink underline decoration-2 underline-offset-4 outline-none transition-colors hover:text-brand-orange focus-visible:ring-3 focus-visible:ring-brand-orange/40"
                  >
                    <RotateCcw
                      aria-hidden
                      className="size-4"
                      strokeWidth={2.5}
                    />
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{
                    opacity: 0,
                    y: -10,
                    transition: { duration: 0.2, ease: EASE_OUT },
                  }}
                  transition={{ duration: 0.35, ease: EASE_OUT }}
                >
                  <p className="inline-flex items-center gap-2.5 rounded-full bg-white px-3.5 py-1.5 font-heading text-[13px] font-semibold text-secondary ring-1 ring-secondary/10 dark:ring-white/10">
                    <PulseDot />
                    Replies within 12 hours
                  </p>

                  <form
                    ref={formScope}
                    className="mt-7"
                    onSubmit={(event) => {
                      event.preventDefault();
                      form.handleSubmit();
                    }}
                  >
                    <FieldGroup className="gap-5">
                      <div className="grid gap-5 sm:grid-cols-2">
                        <form.Field name="name">
                          {(field) => {
                            const isInvalid =
                              field.state.meta.isTouched &&
                              !field.state.meta.isValid;

                            return (
                              <Field data-invalid={isInvalid}>
                                <FieldLabel
                                  htmlFor={field.name}
                                  className="font-heading font-bold text-secondary"
                                >
                                  Your name
                                </FieldLabel>
                                <Input
                                  id={field.name}
                                  name={field.name}
                                  autoComplete="name"
                                  value={field.state.value}
                                  onChange={(event) =>
                                    field.handleChange(event.target.value)
                                  }
                                  onBlur={field.handleBlur}
                                  aria-invalid={isInvalid}
                                  placeholder="e.g. Rahim Ahmed"
                                  className={inputClass}
                                />
                                <ErrorSlot
                                  show={isInvalid}
                                  errors={field.state.meta.errors}
                                />
                              </Field>
                            );
                          }}
                        </form.Field>

                        <form.Field name="email">
                          {(field) => {
                            const isInvalid =
                              field.state.meta.isTouched &&
                              !field.state.meta.isValid;

                            return (
                              <Field data-invalid={isInvalid}>
                                <FieldLabel
                                  htmlFor={field.name}
                                  className="font-heading font-bold text-secondary"
                                >
                                  Email
                                </FieldLabel>
                                <Input
                                  id={field.name}
                                  name={field.name}
                                  type="email"
                                  autoComplete="email"
                                  value={field.state.value}
                                  onChange={(event) =>
                                    field.handleChange(event.target.value)
                                  }
                                  onBlur={field.handleBlur}
                                  aria-invalid={isInvalid}
                                  placeholder="you@business.com"
                                  className={inputClass}
                                />
                                <ErrorSlot
                                  show={isInvalid}
                                  errors={field.state.meta.errors}
                                />
                              </Field>
                            );
                          }}
                        </form.Field>
                      </div>

                      <form.Field name="phone">
                        {(field) => {
                          const isInvalid =
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid;

                          return (
                            <Field data-invalid={isInvalid}>
                              <FieldLabel
                                htmlFor={field.name}
                                className="font-heading font-bold text-secondary"
                              >
                                Phone{" "}
                                <span className="font-normal text-secondary/50">
                                  (optional)
                                </span>
                              </FieldLabel>
                              <Input
                                id={field.name}
                                name={field.name}
                                type="tel"
                                autoComplete="tel"
                                value={field.state.value}
                                onChange={(event) =>
                                  field.handleChange(event.target.value)
                                }
                                onBlur={field.handleBlur}
                                aria-invalid={isInvalid}
                                placeholder="01XXXXXXXXX"
                                className={inputClass}
                              />
                              <ErrorSlot
                                show={isInvalid}
                                errors={field.state.meta.errors}
                              />
                            </Field>
                          );
                        }}
                      </form.Field>

                      <form.Field name="topic">
                        {(field) => {
                          const isInvalid =
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid;

                          return (
                            <Field data-invalid={isInvalid}>
                              <FieldTitle className="font-heading text-[15px] font-bold text-secondary">
                                What’s it about?
                              </FieldTitle>
                              <RadioGroup
                                value={field.state.value}
                                onValueChange={(value) =>
                                  field.handleChange(value)
                                }
                                onBlur={field.handleBlur}
                                aria-invalid={isInvalid}
                                className="flex flex-wrap gap-2.5"
                              >
                                {CONTACT_TOPICS.map((topic, index) => {
                                  const id = `contact-topic-${index}`;

                                  return (
                                    <label
                                      key={topic}
                                      htmlFor={id}
                                      className="relative inline-flex cursor-pointer items-center rounded-full border-2 border-secondary/15 bg-card px-4 py-2 font-heading text-sm font-semibold text-card-foreground outline-none transition-[background-color,border-color,color,box-shadow,transform] duration-200 hover:-translate-y-px hover:border-brand-orange/50 has-data-[state=checked]:border-brand-orange has-data-[state=checked]:bg-brand-orange has-data-[state=checked]:text-brand-ink has-data-[state=checked]:shadow-[0_10px_24px_-14px_var(--color-brand-orange)] focus-within:ring-3 focus-within:ring-brand-orange/40"
                                    >
                                      <RadioGroupItem
                                        id={id}
                                        value={topic}
                                        className="sr-only"
                                      />
                                      {topic}
                                    </label>
                                  );
                                })}
                              </RadioGroup>
                              <ErrorSlot
                                show={isInvalid}
                                errors={field.state.meta.errors}
                              />
                            </Field>
                          );
                        }}
                      </form.Field>

                      <form.Field name="message">
                        {(field) => {
                          const isInvalid =
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid;

                          return (
                            <Field data-invalid={isInvalid}>
                              <FieldLabel
                                htmlFor={field.name}
                                className="font-heading font-bold text-secondary"
                              >
                                Message
                              </FieldLabel>
                              <Textarea
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onChange={(event) =>
                                  field.handleChange(event.target.value)
                                }
                                onBlur={field.handleBlur}
                                aria-invalid={isInvalid}
                                placeholder="Tell us what’s happening — order details, what you’ve tried, and what you need from us."
                                className={textareaClass}
                              />
                              <ErrorSlot
                                show={isInvalid}
                                errors={field.state.meta.errors}
                              />
                            </Field>
                          );
                        }}
                      </form.Field>

                      <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
                        <button
                          type="submit"
                          disabled={form.state.isSubmitting}
                          className={cn(
                            ctaVariants({ variant: "orange" }),
                            "w-full overflow-hidden disabled:pointer-events-none disabled:opacity-75 sm:w-auto",
                          )}
                        >
                          <AnimatePresence mode="wait" initial={false}>
                            <motion.span
                              key={form.state.isSubmitting ? "sending" : "idle"}
                              {...labelSwapMotion}
                              className="inline-flex items-center gap-2"
                            >
                              {form.state.isSubmitting ? (
                                <>
                                  <Spinner aria-hidden className="size-4" />
                                  Sending…
                                </>
                              ) : (
                                <>
                                  Send message
                                  <SendHorizontal
                                    aria-hidden
                                    className="size-4 transition-transform duration-200 group-hover/cta:translate-x-1"
                                    strokeWidth={2.5}
                                  />
                                </>
                              )}
                            </motion.span>
                          </AnimatePresence>
                        </button>

                        <p className="text-sm leading-relaxed text-secondary/60">
                          We reply within 12 hours, Saturday to Thursday.
                        </p>
                      </div>
                    </FieldGroup>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
