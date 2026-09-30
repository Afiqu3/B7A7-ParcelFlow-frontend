import Link from "next/link";
import Logo from "@/assets/svg/Logo";
import { cn } from "@/lib/utils";

type BrandMarkProps = {
  /** `light` for navy backgrounds, `dark` for light backgrounds. */
  tone?: "light" | "dark";
  href?: string;
  className?: string;
};

export default function BrandMark({
  tone = "light",
  href = "/",
  className,
}: BrandMarkProps) {
  return (
    <Link
      href={href}
      aria-label="ParcelFlow home"
      className={cn(
        "group flex w-fit items-center gap-2 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-brand-orange/50",
        className,
      )}
    >
      <span className="flex size-9 items-center justify-center transition-transform duration-300 group-hover:-rotate-6">
        <Logo />
      </span>
      <span
        className={cn(
          "font-heading text-xl font-bold tracking-tight",
          tone === "light" ? "text-white" : "text-secondary",
        )}
      >
        Parcel<span className="text-brand-orange">Flow</span>
      </span>
    </Link>
  );
}
