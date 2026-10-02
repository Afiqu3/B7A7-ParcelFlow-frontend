"use client";

import { ArrowUpRight, ChevronRight } from "lucide-react";
import { AnimatePresence, motion, useInView } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";
import { QUICK_ACTIONS, ROLE_LABEL, SIDEBAR_ROUTES } from "@/routes";
import type { UserRole } from "@/types";
import { findActiveNav } from "./nav";

const isMac = () =>
  typeof navigator !== "undefined" &&
  /Mac|iPhone|iPad/.test(navigator.userAgent);

/** Sticky bar above the page: sidebar toggle, breadcrumb and shortcuts. */
export default function DashboardTopbar({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const quickAction = QUICK_ACTIONS[role];
  const active = findActiveNav(
    SIDEBAR_ROUTES[role],
    pathname,
    quickAction ? [quickAction] : [],
  );
  const title = active?.item.title ?? "Dashboard";
  const section = active?.group?.title;

  // A 1px marker above the bar. Once it scrolls away the bar gets its
  // border and blur; works for the window and the inset panel alike.
  const sentinel = useRef<HTMLDivElement>(null);
  const atTop = useInView(sentinel, { initial: true });

  return (
    <>
      <div ref={sentinel} aria-hidden className="h-px -mb-px" />
      <header
        className={cn(
          "sticky top-0 z-20 flex h-16 shrink-0 items-center gap-2 border-b px-3 transition-[background-color,border-color,box-shadow] duration-300 sm:gap-3 sm:px-6 lg:px-8",
          atTop
            ? "border-transparent bg-accent"
            : "border-secondary/8 bg-accent/80 shadow-[0_12px_32px_-24px_rgba(15,32,86,0.45)] backdrop-blur-md",
        )}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <SidebarTrigger className="size-9 rounded-xl text-secondary hover:bg-secondary/6 hover:text-secondary [&_svg]:size-4.5" />
          </TooltipTrigger>
          <TooltipContent
            side="bottom"
            className="hidden font-heading font-semibold md:inline-flex"
          >
            Toggle sidebar
            <kbd className="rounded bg-background/15 px-1 font-sans text-[10px]">
              {isMac() ? "⌘B" : "Ctrl B"}
            </kbd>
          </TooltipContent>
        </Tooltip>

        <span aria-hidden className="h-5 w-px bg-secondary/10" />

        <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
          <ol className="flex items-center gap-1.5 font-heading text-sm">
            <li className="hidden font-semibold text-secondary/45 sm:block">
              {ROLE_LABEL[role]}
            </li>
            {section ? (
              <>
                <Chevron />
                <li className="hidden font-semibold text-secondary/45 sm:block">
                  {section}
                </li>
              </>
            ) : null}
            <Chevron />
            <li className="min-w-0">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={title}
                  aria-current="page"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="block truncate text-[15px] font-bold text-secondary"
                >
                  {title}
                </motion.span>
              </AnimatePresence>
            </li>
          </ol>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href={ROUTES.home}
            className="hidden h-9 items-center gap-1.5 rounded-xl px-3 font-heading text-sm font-semibold text-secondary/70 outline-none transition-colors hover:bg-secondary/6 hover:text-secondary focus-visible:ring-3 focus-visible:ring-brand-orange/40 sm:inline-flex"
          >
            View site
            <ArrowUpRight className="size-4" strokeWidth={2.25} />
          </Link>

          {/* On phones the sidebar (and its quick action) lives in a
              sheet, so the action gets a shortcut here. */}
          {quickAction?.icon ? (
            <Link
              href={quickAction.url}
              aria-label={quickAction.title}
              className="grid size-9 place-items-center rounded-xl bg-brand-orange text-brand-ink shadow-[0_10px_24px_-12px_var(--color-brand-orange)] outline-none transition-[filter,transform] hover:brightness-110 active:scale-95 focus-visible:ring-3 focus-visible:ring-brand-orange/40 md:hidden"
            >
              <quickAction.icon className="size-4.5" strokeWidth={2.75} />
            </Link>
          ) : null}
        </div>
      </header>
    </>
  );
}

function Chevron() {
  return (
    <li aria-hidden className="hidden sm:block">
      <ChevronRight className="size-3.5 text-secondary/30" strokeWidth={2.5} />
    </li>
  );
}
