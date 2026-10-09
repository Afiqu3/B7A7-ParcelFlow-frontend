import type { SidebarItems } from "@/types";
import {
    Bike,
    LayoutDashboard,
    NotebookPen,
    Package,
    Receipt,
    Store,
    UserCheck,
    UserKey,
    UserRound,
    UserRoundPen,
    UserRoundPlus,
    UserStar,
    Wallet,
} from "lucide-react";

const prefix = "/admin-dashboard";

export const adminRoutes: SidebarItems = [
    {
        items: [{ title: "Dashboard", url: prefix, icon: LayoutDashboard }],
    },
    {
        title: "Operations",
        items: [
            { title: "Parcels", url: `${prefix}/parcels`, icon: Package },
            {
                title: "Available riders",
                url: `${prefix}/available-riders`,
                icon: UserCheck,
            },
            {
                title: "Assignments",
                url: `${prefix}/assignments`,
                icon: NotebookPen,
            },
        ],
    },
    {
        title: "Configuration",
        items: [
            { title: "Pricing rules", url: `${prefix}/pricing`, icon: Receipt },
            { title: "Merchants", url: `${prefix}/merchants`, icon: Store },
            { title: "Riders", url: `${prefix}/riders`, icon: Bike },
            {
                title: "Create admin",
                url: `${prefix}/create-admin`,
                icon: UserRoundPlus,
            },
            { title: "Admins", url: `${prefix}/admins`, icon: UserStar },
            {
                title: "Transactions",
                url: `${prefix}/transactions`,
                icon: Wallet,
            },
        ],
    },
    {
        title: "Account",
        items: [
            { title: "Profile", url: `${prefix}/profile`, icon: UserRound },
            {
                title: "Change password",
                url: `${prefix}/change-password`,
                icon: UserKey,
            },
            {
                title: "Update profile",
                url: `${prefix}/update-profile`,
                icon: UserRoundPen,
            },
        ],
    },
];
