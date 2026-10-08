import {
    LayoutDashboard,
    Package,
    PackageSearch,
    Plus,
    UserKey,
    UserRound,
    UserRoundPen,
    Wallet,
} from "lucide-react";
import type { SidebarItem, SidebarItems } from "@/types";

const prefix = "/dashboard";

/** The orange button at the top of the merchant sidebar. */
export const merchantQuickAction: SidebarItem = {
    title: "New parcel",
    url: `${prefix}/parcels/new`,
    icon: Plus,
};

export const merchantRoutes: SidebarItems = [
    {
        items: [{ title: "Dashboard", url: prefix, icon: LayoutDashboard }],
    },
    {
        title: "Shipping",
        items: [
            { title: "Parcels", url: `${prefix}/parcels`, icon: Package },
            {
                title: "Track parcel",
                url: `${prefix}/track`,
                icon: PackageSearch,
            },
        ],
    },
    {
        title: "Money",
        items: [
            { title: "Transaction history", url: `${prefix}/transactions`, icon: Wallet },
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
