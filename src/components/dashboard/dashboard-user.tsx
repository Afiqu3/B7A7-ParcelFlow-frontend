"use client";

import { ChevronsUpDown, House, LogIn, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/constants";
import { useGetMe, useLogout } from "@/hooks";
import { cn } from "@/lib/utils";
import { ROLE_LABEL } from "@/routes";
import type { UserRole } from "@/types";
import { initials } from "./nav";

const cardClass =
  "h-14 gap-3 rounded-xl px-2 text-sidebar-foreground hover:bg-white/5 hover:text-white data-open:bg-white/[0.08] data-open:text-white group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:p-0!";

/** Signed-in user at the bottom of the sidebar, with the account menu. */
export default function DashboardUser({ role }: { role: UserRole }) {
  const router = useRouter();
  const { isMobile } = useSidebar();
  const { data: user, isPending } = useGetMe();
  const { mutate: logout, isPending: loggingOut } = useLogout();

  if (isPending) {
    return (
      <div
        aria-hidden
        className="flex h-14 items-center gap-3 px-2 group-data-[collapsible=icon]:px-0"
      >
        <Skeleton className="size-10 shrink-0 rounded-xl bg-white/10" />
        <div className="flex flex-1 flex-col gap-2 group-data-[collapsible=icon]:hidden">
          <Skeleton className="h-3 w-24 bg-white/10" />
          <Skeleton className="h-2.5 w-32 bg-white/[0.07]" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            tooltip={{
              children: "Log in",
              className: "font-heading font-semibold",
            }}
            className={cn(cardClass, "h-10 px-3 font-heading font-semibold")}
          >
            <Link href={ROUTES.login}>
              <LogIn />
              <span>Log in</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  const handleLogout = () =>
    logout(undefined, {
      onSuccess: () => {
        toast.success("See you again", {
          description: "Logged out successfully",
        });
        router.replace(ROUTES.home);
      },
      onError: () => {
        toast.error("Logout failed", {
          description: "Something went wrong. Please try again",
        });
      },
    });

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className={cardClass}
              aria-label={`Account menu for ${user.name}`}
            >
              <Avatar className="size-10 rounded-xl after:hidden">
                <AvatarFallback className="rounded-xl bg-brand-orange font-heading text-sm font-bold text-brand-ink">
                  {initials(user.name)}
                </AvatarFallback>
              </Avatar>
              <span className="grid min-w-0 flex-1 text-left leading-tight">
                <span className="truncate font-heading text-sm font-bold text-white">
                  {user.name}
                </span>
                <span className="truncate text-xs text-sidebar-foreground">
                  {user.email}
                </span>
              </span>
              <ChevronsUpDown className="ml-auto size-4 text-sidebar-foreground/70" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side={isMobile ? "top" : "right"}
            align="end"
            sideOffset={10}
            className="w-64 rounded-xl p-1.5 font-sans"
          >
            <DropdownMenuLabel className="flex flex-col gap-0.5 px-2 py-2">
              <span className="truncate font-heading text-sm font-bold text-secondary">
                {user.name}
              </span>
              <span className="truncate text-xs font-normal text-muted-foreground">
                {user.email}
              </span>
              <span className="mt-1.5 w-fit rounded-full bg-brand-orange/10 px-2 py-0.5 font-heading text-[11px] font-bold text-brand-orange-ink">
                {ROLE_LABEL[user.role ?? role]}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="rounded-lg px-2 py-2">
              <Link href={ROUTES.home}>
                <House />
                Back to website
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              disabled={loggingOut}
              onSelect={handleLogout}
              className="rounded-lg px-2 py-2"
            >
              <LogOut />
              {loggingOut ? "Logging out…" : "Log out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
