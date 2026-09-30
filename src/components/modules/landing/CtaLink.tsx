import { cva, type VariantProps } from "class-variance-authority";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const ctaVariants = cva(
  "group/cta inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-heading font-bold outline-none transition-[background-color,border-color,box-shadow,transform,filter] duration-200 hover:-translate-y-0.5 active:translate-y-0 focus-visible:ring-4",
  {
    variants: {
      variant: {
        orange:
          "bg-brand-orange text-brand-ink shadow-[0_12px_32px_-14px_var(--color-brand-orange)] hover:brightness-110 focus-visible:ring-brand-orange/40",
        outline:
          "border-2 border-brand-line text-white hover:border-brand-muted/60 hover:bg-white/5 focus-visible:ring-white/20",
        ink: "bg-brand-ink text-white hover:bg-brand focus-visible:ring-brand-ink/30",
      },
      size: {
        md: "h-12 px-6 text-[15px]",
        sm: "h-10 px-4 text-sm",
      },
    },
    defaultVariants: { variant: "orange", size: "md" },
  },
);

type CtaLinkProps = ComponentProps<typeof Link> &
  VariantProps<typeof ctaVariants> & {
    /** Shows a trailing arrow that nudges right on hover. */
    arrow?: boolean;
  };

export default function CtaLink({
  className,
  variant,
  size,
  arrow = false,
  children,
  ...props
}: CtaLinkProps) {
  return (
    <Link className={cn(ctaVariants({ variant, size }), className)} {...props}>
      {children}
      {arrow && (
        <ArrowRight
          aria-hidden
          className="size-4 transition-transform duration-200 group-hover/cta:translate-x-1"
          strokeWidth={2.5}
        />
      )}
    </Link>
  );
}
