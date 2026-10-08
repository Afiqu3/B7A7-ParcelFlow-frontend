import type { SidebarItem, SidebarItems, UserRole } from "@/types";
import { adminRoutes } from "./admin.routes";
import { merchantQuickAction, merchantRoutes } from "./merchant.routes";
import { riderRoutes } from "./rider.routes";

/** Where each role's dashboard lives. */
export const ROLE_HOME: Record<UserRole, string> = {
  SUPER_ADMIN: "/super-dashboard",
  ADMIN: "/admin-dashboard",
  MERCHANT: "/dashboard",
  RIDER: "/rider",
};

export const ROLE_LABEL: Record<UserRole, string> = {
  SUPER_ADMIN: "Super admin",
  ADMIN: "Admin",
  MERCHANT: "Merchant",
  RIDER: "Rider",
};

export const SIDEBAR_ROUTES: Record<UserRole, SidebarItems> = {
  SUPER_ADMIN: adminRoutes,
  ADMIN: adminRoutes,
  MERCHANT: merchantRoutes,
  RIDER: riderRoutes,
};

/** Optional primary action pinned above a role's navigation. */
export const QUICK_ACTIONS: Partial<Record<UserRole, SidebarItem>> = {
  MERCHANT: merchantQuickAction,
};
