"use client";

import { Check, Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Mode = "light" | "dark" | "system";

/**
 * Theme switcher used in the public header and dashboard topbar.
 * `variant` picks navy-friendly (on brand) or card-friendly styling.
 * Fully responsive: icon-only on phones, expands on sm+.
 */
export default function ThemeToggle({
  variant = "brand",
  className,
}: {
  variant?: "brand" | "surface";
  className?: string;
}) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  const active = (mounted ? theme : "system") as Mode;
  const isDark = mounted ? resolvedTheme === "dark" : false;

  const options: { value: Mode; label: string; icon: typeof Sun }[] = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Laptop },
  ];

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        aria-label={open ? "Close theme menu" : "Change theme"}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
        onBlur={(e) => {
          if (!e.currentTarget.parentElement?.contains(e.relatedTarget)) {
            setOpen(false);
          }
        }}
        className={cn(
          "grid size-9 place-items-center rounded-xl outline-none transition-colors focus-visible:ring-3 focus-visible:ring-brand-orange/50 active:scale-95",
          variant === "brand"
            ? "text-white/85 hover:bg-white/10 hover:text-white"
            : "text-secondary hover:bg-secondary/6 hover:text-secondary",
        )}
      >
        <span className="relative grid place-items-center">
          {mounted ? (
            isDark ? (
              <Moon className="size-4.5" strokeWidth={2.25} />
            ) : (
              <Sun className="size-4.5" strokeWidth={2.25} />
            )
          ) : (
            <Sun className="size-4.5" strokeWidth={2.25} />
          )}
        </span>
        <span className="sr-only">Theme: {active}. Activate to change.</span>
      </button>

      {open ? (
        <div
          role="menu"
          aria-label="Color theme"
          className="absolute right-0 z-50 mt-2 w-36 overflow-hidden rounded-xl bg-popover p-1 text-popover-foreground shadow-xl ring-1 ring-border"
        >
          {options.map((opt) => {
            const selected = active === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                role="menuitemradio"
                aria-checked={selected}
                onClick={() => {
                  setTheme(opt.value);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left font-heading text-[13px] font-semibold outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-brand-orange/50",
                  selected
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <opt.icon className="size-4" strokeWidth={2.25} />
                <span className="flex-1">{opt.label}</span>
                {selected ? (
                  <Check className="size-3.5" strokeWidth={2.75} />
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
