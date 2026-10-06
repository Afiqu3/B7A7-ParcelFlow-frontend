"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { MotionProvider } from "@/components/modules/landing/motion";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { UserRole } from "@/types";
import DashboardContent, { DASHBOARD_CONTENT_ID } from "./dashboard-content";
import { DashboardSidebar } from "./dashboard-sidebar";
import DashboardTopbar from "./dashboard-topbar";

// Cookie the sidebar writes when it's opened or collapsed.
const SIDEBAR_COOKIE = "sidebar_state";

function readSidebarPreference(): boolean | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${SIDEBAR_COOKIE}=([^;]*)`),
  );
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]) !== "false";
  } catch {
    return match[1] !== "false";
  }
}

export default function DashboardShell({
  children,
  role,
}: {
  children: ReactNode;
  role: UserRole;
}) {
  // Prerender and first paint assume expanded (the default when no cookie
  // exists). The stored preference applies after mount, so `output:
  // "export"` can prerender this route and hydration never mismatches.
  // (Reading the cookie on the server via `cookies()` would forbid static
  // rendering, so it lives here on the client instead.)
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const stored = readSidebarPreference();
    if (stored !== null) setOpen(stored);
  }, []);

  return (
    <MotionProvider>
      {/* font-sans: the app default (on <html>) is mono; the dashboard uses
          the same sans as the marketing pages. */}
      <SidebarProvider
        open={open}
        onOpenChange={setOpen}
        className="font-sans"
        style={{ "--sidebar-width-icon": "4rem" } as CSSProperties}
      >
        <a
          href={`#${DASHBOARD_CONTENT_ID}`}
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-xl focus:bg-brand-orange focus:px-4 focus:py-2 focus:font-heading focus:text-sm focus:font-bold focus:text-brand-ink"
        >
          Skip to content
        </a>

        <DashboardSidebar role={role} />

        {/* Cream panel inside the navy frame. From md up it scrolls on its
            own, so the rounded corners and frame stay put. */}
        <SidebarInset className="bg-accent md:h-[calc(100svh-1rem)] md:overflow-y-auto md:peer-data-[variant=inset]:rounded-2xl md:peer-data-[variant=inset]:shadow-[0_24px_64px_-32px_rgba(2,6,23,0.8)]">
          <DashboardTopbar role={role} />
          <DashboardContent>{children}</DashboardContent>
        </SidebarInset>
      </SidebarProvider>
    </MotionProvider>
  );
}
