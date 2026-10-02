"use client";

import Logo from "@/assets/svg/Logo";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar";
import { adminRoutes, merchantRoutes, riderRoutes } from "@/routes";
import { SidebarItems, UserRole } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarRoutes: Partial<Record<UserRole, SidebarItems>> = {
    SUPER_ADMIN: adminRoutes,
    ADMIN: adminRoutes,
    MERCHANT: merchantRoutes,
    RIDER: riderRoutes,
};

export function DashboardSidebar({ role }: { role: UserRole }) {
    const pathname = usePathname();
    const routes: SidebarItems = sidebarRoutes[role] || [];

    console.log(pathname);

    return (
        <Sidebar>
            <SidebarHeader>
                <Link href="/">
                    <div className="flex items-center gap-2">
                        <Logo />
                        <span>PH Healthcare</span>
                    </div>
                </Link>
            </SidebarHeader>
            <SidebarContent>
                {routes.map((item) => (
                    <SidebarGroup key={item.title}>
                        <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {item.items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            isActive={pathname === item.url}
                                            asChild
                                        >
                                            <Link href={item.url}>
                                                {item.title}
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    );
}