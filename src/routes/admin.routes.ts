import {
  Bike,
  LayoutDashboard,
  Package,
  Receipt,
  Store,
  Users,
} from "lucide-react";
import type { SidebarItems } from "@/types";

const prefix = "/admin";

export const adminRoutes: SidebarItems = [
  {
    items: [{ title: "Dashboard", url: prefix, icon: LayoutDashboard }],
  },
  {
    title: "Operations",
    items: [
      { title: "Parcels", url: `${prefix}/parcels`, icon: Package },
      { title: "Riders", url: `${prefix}/riders`, icon: Bike },
      { title: "Merchants", url: `${prefix}/merchants`, icon: Store },
    ],
  },
  {
    title: "Configuration",
    items: [
      { title: "Pricing rules", url: `${prefix}/pricing`, icon: Receipt },
      { title: "Users", url: `${prefix}/users`, icon: Users },
    ],
  },
];
