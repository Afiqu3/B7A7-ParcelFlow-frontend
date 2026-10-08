import type { SidebarItems } from "@/types";
import {
    Bike,
    LayoutDashboard,
    Package,
    Receipt,
    Store,
    UserKey,
    UserRound,
    UserRoundPen,
    UserRoundPlus,
    Users,
    UserStar,
} from "lucide-react";

const prefix = "/super-dashboard";

export const superAdminRoutes: SidebarItems = [
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
            {
                title: "Create admin",
                url: `${prefix}/create-admin`,
                icon: UserRoundPlus,
            },
            { title: "Admins", url: `${prefix}/admins`, icon: UserStar },
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
