"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/assets/svg/Logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { QUICK_ACTIONS, ROLE_HOME, ROLE_LABEL, SIDEBAR_ROUTES } from "@/routes";
import type { UserRole } from "@/types";
import DashboardUser from "./dashboard-user";
import { findActiveNav } from "./nav";

// Shared sizing for every row, expanded (h-10) and collapsed (a 40px square).
const rowClass =
  "h-10 gap-3 rounded-xl px-3 font-heading text-[14px] font-semibold group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:p-3!";

// Collapsed-mode labels. Tooltips render in a portal, outside the shell.
const tooltip = (title: string) => ({
  children: title,
  className: "font-heading font-semibold",
});

// Entrance for nav rows: CSS, so it runs before hydration. The sidebar
// persists across navigations, so it plays on first load (and each time
// the mobile sheet opens).
const enterClass =
  "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-left-2 motion-safe:fill-mode-backwards motion-safe:duration-300";

export function DashboardSidebar({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();
  const groups = SIDEBAR_ROUTES[role];
  const quickAction = QUICK_ACTIONS[role];
  const activeUrl = findActiveNav(groups, pathname)?.item.url;

  // The mobile sheet should get out of the way once a link is picked.
  const closeOnMobile = () => {
    if (isMobile) setOpenMobile(false);
  };

  let row = 0;
  const nextDelay = () => ({ animationDelay: `${80 + row++ * 35}ms` });

  return (
    <Sidebar variant="inset" collapsible="icon">
      {/* On phones the sidebar is portalled into a sheet outside the
          shell, so it needs its own font-sans. */}
      <div className="contents font-sans">
        <SidebarHeader className="gap-4 px-2 pt-3">
          <Link
            href={ROLE_HOME[role]}
            onClick={closeOnMobile}
            className="group/brand flex items-center gap-2.5 rounded-xl px-1.5 py-1 outline-none focus-visible:ring-3 focus-visible:ring-sidebar-ring"
          >
            <span className="flex size-9 shrink-0 items-center justify-center transition-transform duration-300 group-hover/brand:-rotate-6">
              <Logo />
            </span>
            <span className="min-w-0 group-data-[collapsible=icon]:hidden">
              <span className="block font-heading text-lg leading-tight font-bold tracking-tight text-white">
                Parcel<span className="text-brand-orange">Flow</span>
              </span>
              <span className="block truncate font-heading text-[11px] font-bold tracking-[0.16em] text-sidebar-foreground/70 uppercase">
                {ROLE_LABEL[role]}
              </span>
            </span>
          </Link>

          {quickAction ? (
            <SidebarMenu>
              <SidebarMenuItem className={enterClass} style={nextDelay()}>
                <SidebarMenuButton
                  asChild
                  tooltip={tooltip(quickAction.title)}
                  className={cn(
                    rowClass,
                    "justify-center bg-brand-orange font-bold text-brand-ink shadow-[0_10px_24px_-12px_var(--color-brand-orange)] hover:bg-brand-orange hover:text-brand-ink hover:brightness-110 active:bg-brand-orange active:text-brand-ink",
                  )}
                >
                  <Link href={quickAction.url} onClick={closeOnMobile}>
                    {quickAction.icon ? (
                      <quickAction.icon strokeWidth={2.75} />
                    ) : null}
                    <span>{quickAction.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          ) : null}
        </SidebarHeader>

        <SidebarContent className="gap-1 pt-1">
          {groups.map((group) => (
            <SidebarGroup key={group.title ?? "main"} className="py-1.5">
              {group.title ? (
                <SidebarGroupLabel className="px-3 font-heading text-[11px] font-bold tracking-[0.18em] text-sidebar-foreground/55 uppercase">
                  {group.title}
                </SidebarGroupLabel>
              ) : null}
              <SidebarGroupContent>
                <SidebarMenu className="gap-0.5">
                  {group.items.map((item) => {
                    const active = item.url === activeUrl;
                    return (
                      <SidebarMenuItem
                        key={item.url}
                        className={enterClass}
                        style={nextDelay()}
                      >
                        <SidebarMenuButton
                          asChild
                          isActive={active}
                          tooltip={tooltip(item.title)}
                          className={cn(
                            rowClass,
                            "relative text-sidebar-foreground transition-colors hover:bg-white/5 hover:text-white data-active:bg-transparent data-active:text-white",
                          )}
                        >
                          <Link
                            href={item.url}
                            aria-current={active ? "page" : undefined}
                            onClick={closeOnMobile}
                          >
                            {/* Slides to the active row on navigation. */}
                            {active ? (
                              <motion.span
                                layoutId="dashboard-nav-active"
                                aria-hidden
                                className="absolute inset-0 rounded-xl bg-white/8 ring-1 ring-white/10 ring-inset"
                                transition={{
                                  type: "spring",
                                  stiffness: 420,
                                  damping: 36,
                                }}
                              >
                                <span className="absolute inset-y-2.5 left-0 w-0.75 rounded-r-full bg-brand-orange group-data-[collapsible=icon]:hidden" />
                              </motion.span>
                            ) : null}
                            {item.icon ? (
                              <item.icon
                                className={cn(
                                  "relative transition-colors",
                                  active && "text-brand-orange",
                                )}
                                strokeWidth={2.25}
                              />
                            ) : null}
                            <span className="relative">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>

        <SidebarSeparator className="mx-3" />
        <SidebarFooter className="p-2">
          <DashboardUser role={role} />
        </SidebarFooter>
      </div>
      <SidebarRail />
    </Sidebar>
  );
}
