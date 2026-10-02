"use client";

import { LayoutDashboard, LogOut, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@/hooks";
import { ROLE_HOME } from "@/routes";
import type { LinkItem, User } from "@/types";

const userMenuItems: LinkItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
];

export default function UserMenu({ user }: { user: User }) {
  const router = useRouter();

  const { mutate: logout } = useLogout();

  const handleUserMenuAction = async (href: string) => {
    if (href === "/dashboard") {
      router.push(ROLE_HOME[user.role]);
      return;
    }

    logout(undefined, {
      onSuccess: () => {
        toast.success("See you again", {
          description: "Logged out successfully",
        });
        router.replace("/");
      },
      onError: () => {
        toast.error("Logout failed", {
          description: "Something Went Wrong",
        });
      },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Open account menu"
        className="rounded-full outline-none transition-transform focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        <Avatar className="size-9 border border-border">
          <AvatarFallback className="bg-primary/10 text-primary">
            <UserRound className="size-4.5" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span className="truncate font-medium">{user?.name}</span>
          <span className="truncate text-xs font-normal text-muted-foreground">
            {user?.email}
          </span>
          <span className="mt-1 w-fit rounded-full bg-primary/10 px-2 py-0.5 text-[0.65rem] font-medium tracking-wide text-primary capitalize">
            {user?.role}
          </span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          {userMenuItems.map((item) => (
            <DropdownMenuItem
              key={item.href}
              onClick={async () => {
                await handleUserMenuAction(item.href);
              }}
            >
              <item.icon />
              <span>{item.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          onClick={async () => {
            await handleUserMenuAction("/logout");
          }}
        >
          <LogOut />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
