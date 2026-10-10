import type { SidebarItems } from "@/types";
import {
    ClipboardList,
    LayoutDashboard,
    UserKey,
    UserRound,
    UserRoundPen,
} from "lucide-react";

const prefix = "/rider-dashboard";

export const riderRoutes: SidebarItems = [
    {
        items: [{ title: "Dashboard", url: prefix, icon: LayoutDashboard }],
    },
    {
        title: "Deliveries",
        items: [
            {
                title: "My assignments",
                url: `${prefix}/assignments`,
                icon: ClipboardList,
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
