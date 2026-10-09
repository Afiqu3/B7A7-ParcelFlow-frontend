import type { SidebarItems } from "@/types";
import {
    Bike,
    LayoutDashboard,
    Package,
    Receipt,
    Store,
    UserKey,
    UserPlus,
    UserRound,
    UserRoundPen,
    UserRoundPlus,
    Users,
    UserStar,
    Wallet,
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
        ],
    },
    {
        title: "Configuration",
        items: [
            { title: "Pricing rules", url: `${prefix}/pricing`, icon: Receipt },
            { title: "Merchants", url: `${prefix}/merchants`, icon: Store },
            { title: "Riders", url: `${prefix}/riders`, icon: Bike },
            { title: "Users", url: `${prefix}/users`, icon: Users },
            {
                title: "Create admin",
                url: `${prefix}/create-admin`,
                icon: UserRoundPlus,
            },
            {
                title: "Create super admin",
                url: `${prefix}/create-super-admin`,
                icon: UserPlus,
            },
            { title: "Admins", url: `${prefix}/admins`, icon: UserStar },
            {
                title: "Super admins",
                url: `${prefix}/super-admins`,
                icon: UserStar,
            },
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
