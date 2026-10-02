"use client";

import { CircleHelp, LogIn, Menu, Receipt, Truck, X } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import CtaLink from "@/components/modules/landing/CtaLink";
import BrandMark from "@/components/shared/BrandMark";
import { ROUTES } from "@/constants";
import { useGetMe } from "@/hooks";
import { cn } from "@/lib/utils";
import type { LinkItem } from "@/types";
import UserMenu from "./UserMenu";
import { Skeleton } from "@/components/ui/skeleton";

const NAV_ITEMS: LinkItem[] = [
  { label: "How it works", href: ROUTES.howItWorks, icon: CircleHelp },
  { label: "Pricing", href: ROUTES.pricing, icon: Receipt },
  { label: "Ride with us", href: ROUTES.rideWithUs, icon: Truck },
];

// "/" only matches the home page; other items also match their sub-routes.
function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeMenu = () => setOpen(false);

  const { data: user, isPending } = useGetMe();

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 8));

  // Close the mobile menu with Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-white/10 bg-brand transition-shadow duration-300",
        scrolled && "shadow-[0_8px_30px_-12px_rgba(3,8,30,0.6)]",
      )}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8"
      >
        <BrandMark />

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative rounded-md px-3.5 py-2 font-heading text-[15px] font-semibold outline-none transition-colors focus-visible:ring-3 focus-visible:ring-brand-orange/50",
                    active ? "text-white" : "text-white/80 hover:text-white",
                  )}
                >
                  {item.label}
                  {active ? (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-brand-orange"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2 sm:gap-3">
          {isPending ? (
            <Skeleton aria-hidden className="size-9 rounded-full bg-white/15" />
          ) : user ? (
            <UserMenu user={user} />
          ) : (
            <>
              <Link
                href={ROUTES.login}
                className="hidden rounded-md px-3 py-2 font-heading text-[15px] font-semibold text-white/85 outline-none transition-colors hover:text-white focus-visible:ring-3 focus-visible:ring-brand-orange/50 sm:inline-flex"
              >
                Log in
              </Link>
              <CtaLink
                href={ROUTES.register}
                size="sm"
                arrow
                className="hidden rounded-lg sm:inline-flex"
              >
                Start shipping
              </CtaLink>
            </>
          )}

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((prev) => !prev)}
            className="grid size-10 place-items-center rounded-lg text-white outline-none transition-colors hover:bg-white/10 focus-visible:ring-3 focus-visible:ring-brand-orange/50 lg:hidden"
          >
            <AnimatePresence initial={false} mode="wait">
              <motion.span
                key={open ? "close" : "open"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex"
              >
                {open ? <X className="size-5" /> : <Menu className="size-5" />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </nav>

      {/* Mobile menu overlays the page (absolute) so opening/closing it
          doesn't push the page content around. */}
      <AnimatePresence>
        {open ? (
          <motion.div
            key="mobile-backdrop"
            aria-hidden
            onClick={closeMenu}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 bottom-0 bg-brand-deep/50 backdrop-blur-[2px] lg:hidden"
          />
        ) : null}
        {open ? (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="absolute inset-x-0 top-full overflow-hidden border-b border-white/10 bg-brand shadow-[0_24px_40px_-16px_rgba(3,8,30,0.7)] lg:hidden"
          >
            <ul className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-4 sm:px-8">
              {NAV_ITEMS.map((item, i) => {
                const active = isActive(pathname, item.href);
                return (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i + 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-3 font-heading text-[15px] font-semibold transition-colors",
                        active
                          ? "bg-white/10 text-white"
                          : "text-white/80 hover:bg-white/5 hover:text-white",
                      )}
                    >
                      <item.icon className="size-4 text-brand-orange" />
                      {item.label}
                    </Link>
                  </motion.li>
                );
              })}

              {!isPending && !user ? (
                <motion.li
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * NAV_ITEMS.length + 0.05 }}
                  className="mt-2 grid grid-cols-2 gap-2 border-t border-white/10 pt-4"
                >
                  <CtaLink
                    href={ROUTES.login}
                    variant="outline"
                    size="sm"
                    onClick={closeMenu}
                  >
                    <LogIn className="size-4" />
                    Log in
                  </CtaLink>
                  <CtaLink
                    href={ROUTES.register}
                    size="sm"
                    arrow
                    onClick={closeMenu}
                  >
                    Start shipping
                  </CtaLink>
                </motion.li>
              ) : null}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
