import { cookies } from "next/headers";
import type { CSSProperties, ReactNode } from "react";
import { MotionProvider } from "@/components/modules/landing/motion";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { UserRole } from "@/types";
import DashboardContent, { DASHBOARD_CONTENT_ID } from "./dashboard-content";
import { DashboardSidebar } from "./dashboard-sidebar";
import DashboardTopbar from "./dashboard-topbar";

// Cookie the shadcn sidebar writes when it's opened or collapsed. Reading
// it here renders the right width on the server, so there's no flash.
const SIDEBAR_COOKIE = "sidebar_state";

export default async function DashboardShell({
  children,
  role,
}: {
  children: ReactNode;
  role: UserRole;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get(SIDEBAR_COOKIE)?.value !== "false";

  return (
    <MotionProvider>
      {/* font-sans: the app default (on <html>) is mono; the dashboard uses
          the same sans as the marketing pages. */}
      <SidebarProvider
        defaultOpen={defaultOpen}
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
