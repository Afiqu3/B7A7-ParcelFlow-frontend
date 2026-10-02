import type { LucideIcon } from "lucide-react";

export interface SidebarItem {
  title: string;
  url: string;
  icon?: LucideIcon;
}

export interface SidebarGroup {
  /** Shown above the group. Leave out for the top, unlabelled group. */
  title?: string;
  items: SidebarItem[];
}

export type SidebarItems = SidebarGroup[];
