import {
  ArrowLeft,
  Check,
  CircleHelp,
  House,
  LifeBuoy,
  PackageSearch,
  Receipt,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import CtaLink from "@/components/modules/landing/CtaLink";
import {
  Container,
  PulseDot,
  RoutePath,
} from "@/components/modules/landing/decor";
import BrandMark from "@/components/shared/BrandMark";
import { ROUTES, SUPPORT } from "@/constants";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Page not found · ParcelFlow",
  description:
    "This page went off-route. Head back home or find the right ParcelFlow destination.",
};

const SHORTCUTS = [
  { label: "Home", href: ROUTES.home, icon: House },
  { label: "How it works", href: ROUTES.howItWorks, icon: CircleHelp },
  { label: "Pricing", href: ROUTES.pricing, icon: Receipt },
  { label: "Log in", href: ROUTES.login, icon: ArrowLeft },
] as const;

export default function NotFound() {
  return (
    <main
      aria-labelledby="not-found-heading"
      className="relative flex min-h-screen flex-col overflow-hidden bg-brand font-sans text-white"
    >
      {/* Backdrop: soft glows + a dotted delivery route running off-map. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 size-96 rounded-full bg-brand-card blur-3xl" />
        <div className="absolute -right-24 top-1/3 size-80 rounded-full bg-brand-orange/15 blur-3xl" />
        <div className="absolute -bottom-40 left-1/4 size-96 rounded-full bg-brand-line/25 blur-3xl" />
        <svg
          aria-hidden="true"
          className="absolute top-24 left-1/2 h-72 w-225 -translate-x-1/4 text-brand-line/70"
          viewBox="-140 -160 900 240"
          fill="none"
        >
          <RoutePath d="M-140 6 C -40 -2, 140 38, 310 30 C 380 27, 420 12, 448 6 C 530 -8, 650 -44, 800 -110" />
        </svg>
      </div>

      {/* Minimal top bar so the 404 still feels like ParcelFlow. */}
      <div className="relative z-10 border-b border-white/10">
        <Container className="flex h-16 items-center justify-between gap-4">
          <BrandMark />
          <Link
            href={ROUTES.home}
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 font-heading text-sm font-semibold text-white/80 outline-none transition-colors hover:text-white focus-visible:ring-3 focus-visible:ring-brand-orange/50"
          >
            <ArrowLeft className="size-4" strokeWidth={2.5} />
            Back to home
          </Link>
        </Container>
      </div>

      <Container className="relative z-10 grid flex-1 items-center gap-14 py-14 sm:py-20 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10">
        {/* Copy, in the same voice as the landing hero. */}
        <div>
          <p className="inline-flex items-center gap-2.5 rounded-full bg-brand-card px-3.5 py-1.5 font-heading text-[13px] font-semibold text-brand-cream ring-1 ring-white/5">
            <PulseDot />
            404 · This route went off-map
          </p>

          <h1
            id="not-found-heading"
            className="mt-6 font-heading text-[3.4rem] leading-[0.92] font-bold tracking-tighter sm:text-7xl lg:text-[5rem]"
          >
            <span className="mb-[-0.08em] block overflow-hidden pb-[0.08em]">
              <span className="block">Parcel</span>
            </span>
            <span className="mb-[-0.08em] block overflow-hidden pb-[0.08em]">
              <span className="block text-brand-orange">not found.</span>
            </span>
          </h1>

          <p className="mt-7 max-w-120 text-[17px] leading-relaxed text-brand-muted">
            The page you&apos;re looking for was delivered elsewhere — a
            mistyped address, a moved route, or a tracking link that expired.
            Let&apos;s get your shipment back on course.
          </p>

          <p className="mt-6 inline-flex max-w-full items-center gap-3 rounded-2xl border-[1.5px] border-dashed border-brand-line bg-brand-deep/60 px-4 py-3 font-mono text-sm">
            <PackageSearch
              aria-hidden
              className="size-4 shrink-0 text-brand-orange"
              strokeWidth={2.25}
            />
            <span className="truncate text-brand-cream">
              PF-404-ROUTE-UNKNOWN
            </span>
            <span className="hidden shrink-0 text-brand-muted sm:inline">
              · check the URL and try again
            </span>
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <CtaLink href={ROUTES.home} arrow>
              Back to home
            </CtaLink>
            <CtaLink href={ROUTES.howItWorks} variant="outline">
              How ParcelFlow works
            </CtaLink>
          </div>

          <nav aria-label="Popular destinations" className="mt-9">
            <p className="font-heading text-[13px] font-bold tracking-[0.2em] text-brand-muted uppercase">
              Popular destinations
            </p>
            <ul className="mt-3 flex flex-wrap gap-2.5">
              {SHORTCUTS.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-brand-line bg-brand px-3.5 py-1.5 font-heading text-[13px] font-semibold text-white outline-none transition-colors hover:border-brand-muted/60 hover:bg-white/5 focus-visible:ring-3 focus-visible:ring-brand-orange/50"
                  >
                    <Icon
                      aria-hidden
                      className="size-4 text-brand-orange"
                      strokeWidth={2.25}
                    />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Lost-parcel status card, echoing the hero TrackingCard. */}
        <div className="relative mx-auto w-full max-w-104 pr-3.5 pb-3.5 lg:mr-0">
          {/* Orange card peeking out behind, like the landing visual. */}
          <div
            aria-hidden
            className="absolute inset-0 translate-x-3.5 translate-y-3.5 rounded-[1.75rem] bg-linear-to-b from-[#F0662D] to-[#C4532A]"
          />

          <div className="relative rounded-[1.75rem] bg-white p-5 text-secondary shadow-[0_30px_60px_-20px_rgba(2,6,23,0.55)] sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
              <div>
                <p className="font-heading text-[11px] font-bold tracking-[0.16em] text-secondary/60 uppercase">
                  Delivery status
                </p>
                <p className="mt-1 font-heading text-6xl font-bold tracking-tighter">
                  4<span className="text-brand-orange">0</span>4
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-brand-orange/12 px-3 py-1 font-heading text-xs font-bold text-brand-orange-ink">
                Address unknown
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-accent px-4 py-3">
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-secondary/60">
                  From
                </p>
                <p className="truncate font-heading text-[13px] font-bold sm:text-sm">
                  The link you followed
                </p>
              </div>
              <span
                aria-hidden
                className={cn(
                  "grid size-9 shrink-0 place-items-center rounded-full",
                  "border-2 border-dashed border-brand-orange-ink/40 text-brand-orange-ink",
                )}
              >
                <PackageSearch className="size-4" strokeWidth={2.5} />
              </span>
              <div className="min-w-0 text-right">
                <p className="text-[11px] font-medium text-secondary/60">To</p>
                <p className="truncate font-heading text-[13px] font-bold sm:text-sm">
                  Nowhere on our map
                </p>
              </div>
            </div>

            <ol aria-label="What happened" className="mt-5 space-y-0">
              {[
                { label: "Link created", state: "done" },
                { label: "Rider left the hub", state: "done" },
                { label: "Wrong turn at this URL", state: "current" },
                { label: "Delivered", state: "pending" },
              ].map((step, i, all) => (
                <li
                  key={step.label}
                  className="relative flex items-center gap-3 pb-3 last:pb-0"
                >
                  {i < all.length - 1 && (
                    <span
                      aria-hidden
                      className={cn(
                        "absolute top-4.5 left-2 h-[calc(100%-18px)] w-0.5",
                        step.state === "done"
                          ? "bg-brand"
                          : "bg-linear-to-b from-brand to-brand-orange",
                      )}
                    />
                  )}
                  <span className="relative grid size-4.5 shrink-0 place-items-center">
                    {step.state === "done" && (
                      <span className="grid size-full place-items-center rounded-full bg-brand">
                        <Check
                          aria-hidden
                          className="size-3 text-white"
                          strokeWidth={3.5}
                        />
                      </span>
                    )}
                    {step.state === "current" && (
                      <>
                        <span className="absolute inset-0 rounded-full bg-brand-orange motion-safe:animate-pulse-ring" />
                        <span className="relative grid size-full place-items-center rounded-full bg-brand-orange ring-4 ring-brand-orange/20">
                          <span className="size-1.5 rounded-full bg-brand-ink" />
                        </span>
                      </>
                    )}
                    {step.state === "pending" && (
                      <span className="size-full rounded-full border-2 border-secondary/15 bg-white" />
                    )}
                  </span>
                  <span
                    className={cn(
                      "font-heading text-sm",
                      step.state === "done" && "font-semibold",
                      step.state === "current" &&
                        "font-bold text-brand-orange-ink",
                      step.state === "pending" &&
                        "font-medium text-secondary/55",
                    )}
                  >
                    {step.label}
                    {step.state === "current" && (
                      <span className="sr-only">
                        {" "}
                        (where things went wrong)
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ol>

            <div className="mt-5 flex items-center justify-between gap-3 border-t border-secondary/10 pt-4 font-heading text-sm">
              <a
                href={`mailto:${SUPPORT.email}`}
                className="inline-flex items-center gap-2 rounded-md font-semibold outline-none transition-colors hover:text-brand-orange-ink focus-visible:ring-3 focus-visible:ring-brand-orange/40"
              >
                <LifeBuoy className="size-4" strokeWidth={2.5} />
                Contact support
              </a>
              <Link
                href={ROUTES.home}
                className="rounded-md font-bold text-brand-orange-ink outline-none transition-colors hover:underline focus-visible:ring-3 focus-visible:ring-brand-orange/40"
              >
                Start over →
              </Link>
            </div>
          </div>
        </div>
      </Container>

      <div className="relative z-10 border-t border-white/10">
        <Container className="flex flex-col gap-1 py-5 text-[13px] text-brand-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} ParcelFlow</p>
          <p>Courier &amp; payments for merchants across Bangladesh</p>
        </Container>
      </div>
    </main>
  );
}
