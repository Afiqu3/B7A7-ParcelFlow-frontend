import {
  Banknote,
  Bike,
  CalendarDays,
  Clock,
  FileText,
  type LucideIcon,
  Package,
  Smartphone,
  Warehouse,
  Zap,
} from "lucide-react";
import type { PaymentMethod, PickupMethod } from "@/lib/pricing";
import type { DeliverySpeed, ParcelCategory, ZoneType } from "@/types";

// Display copy for the pricing enums. Order of each *_ORDER list is the
// order options appear on the page.

export const ZONE_ORDER: ZoneType[] = [
  "INSIDE_CITY",
  "SUB_CITY",
  "OUTSIDE_CITY",
];

export const ZONES: Record<
  ZoneType,
  {
    label: string;
    description: string /** 1 = innermost ring */;
    ring: 1 | 2 | 3;
  }
> = {
  INSIDE_CITY: {
    label: "Inside City",
    description: "Pickup and delivery within the same city.",
    ring: 1,
  },
  SUB_CITY: {
    label: "Sub-City",
    description: "Nearby districts in the same division.",
    ring: 2,
  },
  OUTSIDE_CITY: {
    label: "Outside City",
    description: "Every other district, nationwide.",
    ring: 3,
  },
};

export const CATEGORY_ORDER: ParcelCategory[] = ["PARCEL", "DOCUMENT"];

export const CATEGORIES: Record<
  ParcelCategory,
  { label: string; icon: LucideIcon }
> = {
  PARCEL: { label: "Parcel", icon: Package },
  DOCUMENT: { label: "Document", icon: FileText },
};

export const SPEED_ORDER: DeliverySpeed[] = ["REGULAR", "EXPRESS", "SAME_DAY"];

export const SPEEDS: Record<
  DeliverySpeed,
  { label: string; eta: string; icon: LucideIcon }
> = {
  REGULAR: { label: "Regular", eta: "48–72h", icon: CalendarDays },
  EXPRESS: { label: "Express", eta: "24h", icon: Clock },
  SAME_DAY: { label: "Same day", eta: "Today", icon: Zap },
};

export const PICKUP_METHODS: Record<
  PickupMethod,
  { label: string; icon: LucideIcon }
> = {
  HUB_DROP_OFF: { label: "Drop at hub", icon: Warehouse },
  RIDER_PICKUP: { label: "Rider pickup", icon: Bike },
};

export const PAYMENT_METHODS: Record<
  PaymentMethod,
  { label: string; icon: LucideIcon }
> = {
  PREPAID: { label: "Prepaid", icon: Smartphone },
  COD: { label: "COD", icon: Banknote },
};
