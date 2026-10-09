import {
    ClipboardList,
    HandCoins,
    History,
    LayoutDashboard,
    UserKey,
    UserRound,
} from "lucide-react";
import type { SidebarItems } from "@/types";

const prefix = "/rider-dashboard";

export const riderRoutes: SidebarItems = [
    {
        items: [{ title: "Dashboard", url: prefix, icon: LayoutDashboard }],
    },
    {
        title: "Deliveries",
        items: [
            { title: "My tasks", url: `${prefix}/tasks`, icon: ClipboardList },
            { title: "History", url: `${prefix}/history`, icon: History },
        ],
    },
    {
        title: "Money",
        items: [
            { title: "COD collected", url: `${prefix}/cod`, icon: HandCoins },
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
        ],
    },
];
