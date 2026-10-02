"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export const DASHBOARD_CONTENT_ID = "dashboard-content";

/**
 * Page area. Re-keyed per path so each page fades up on arrival; the
 * animation is CSS, so it runs before hydration and respects reduced
 * motion. Note the re-key also remounts any nested layouts below it.
 */
export default function DashboardContent({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div
      id={DASHBOARD_CONTENT_ID}
      tabIndex={-1}
      className="flex-1 px-4 pt-2 pb-10 outline-none sm:px-6 lg:px-8"
    >
      <div
        key={pathname}
        className="mx-auto w-full max-w-7xl motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 motion-safe:ease-out"
      >
        {children}
      </div>
    </div>
  );
}
