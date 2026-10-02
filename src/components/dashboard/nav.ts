import type { SidebarGroup, SidebarItem, SidebarItems } from "@/types";

export type ActiveNav = { group?: SidebarGroup; item: SidebarItem };

/**
 * The nav entry for the current path: the longest URL that is the path
 * itself or one of its parents. So `/dashboard/parcels/42` highlights
 * "Parcels", and only `/dashboard` itself highlights "Dashboard".
 */
export function findActiveNav(
  groups: SidebarItems,
  pathname: string,
  extra: SidebarItem[] = [],
): ActiveNav | null {
  const candidates: ActiveNav[] = [
    ...groups.flatMap((group) => group.items.map((item) => ({ group, item }))),
    ...extra.map((item) => ({ item })),
  ];

  let best: ActiveNav | null = null;
  for (const entry of candidates) {
    const { url } = entry.item;
    const matches = pathname === url || pathname.startsWith(`${url}/`);
    if (matches && (!best || url.length > best.item.url.length)) best = entry;
  }
  return best;
}

/** "Shojol Islam" → "SI", "rahim" → "R". */
export function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
