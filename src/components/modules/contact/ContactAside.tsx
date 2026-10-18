"use client";

import {
  Clock,
  type LucideIcon,
  Mail,
  MessageCircle,
  Phone,
} from "lucide-react";
import { motion, stagger, type Variants } from "motion/react";
import { EASE_OUT } from "@/components/modules/landing/motion";
import { SUPPORT } from "@/constants";
import { cn } from "@/lib/utils";

type Channel = {
  label: string;
  value: string;
  icon: LucideIcon;
  /** Renders the value as a link when set. */
  href?: string;
  /** Long values (like the email address) wrap instead of overflowing. */
  breakAll?: boolean;
};

const CHANNELS: Channel[] = [
  {
    label: "Email support",
    value: SUPPORT.email,
    icon: Mail,
    href: `mailto:${SUPPORT.email}`,
    breakAll: true,
  },
  {
    label: "Call support",
    value: SUPPORT.phone,
    icon: Phone,
    href: `tel:${SUPPORT.phone.replace(/\s+/g, "")}`,
  },
  {
    label: "Support hours",
    value: "Saturday–Thursday, 9:00–21:00",
    icon: Clock,
  },
  {
    label: "Typical reply",
    value: "Within 12 hours, usually sooner",
    icon: MessageCircle,
  },
];

const list: Variants = {
  hidden: {},
  visible: {
    transition: { delayChildren: stagger(0.08, { startDelay: 0.35 }) },
  },
};

const item: Variants = {
  hidden: { opacity: 0, x: 16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE_OUT } },
};

const linkClass =
  "rounded-sm underline-offset-4 outline-none transition-colors hover:text-brand-orange hover:underline focus-visible:ring-3 focus-visible:ring-brand-orange/50";

/** Hero aside: the fastest ways to reach the support team. */
export default function ContactAside() {
  return (
    <div className="w-full max-w-md rounded-3xl bg-brand-card p-2 ring-1 ring-white/5 sm:p-3 lg:ml-auto">
      <motion.dl
        variants={list}
        initial="hidden"
        animate="visible"
        className="divide-y divide-white/5"
      >
        {CHANNELS.map(({ label, value, icon: Icon, href, breakAll }) => (
          <motion.div
            key={label}
            variants={item}
            className="flex items-center gap-4 px-3 py-3.5 sm:px-4"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand text-brand-orange">
              <Icon aria-hidden className="size-5" strokeWidth={2.25} />
            </span>
            <div className="min-w-0 flex-1">
              <dt className="font-heading text-[15px] font-bold text-white">
                {label}
              </dt>
              <dd
                className={cn(
                  "text-sm text-brand-muted",
                  breakAll && "break-all",
                )}
              >
                {href ? (
                  <a href={href} className={linkClass}>
                    {value}
                  </a>
                ) : (
                  value
                )}
              </dd>
            </div>
          </motion.div>
        ))}
      </motion.dl>
    </div>
  );
}
