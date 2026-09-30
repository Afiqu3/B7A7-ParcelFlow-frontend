import { cn } from "@/lib/utils";

// Small decorative pieces shared by the landing sections. CSS-only
// animations (motion-safe) so they can render on the server.

/** A dot with a soft expanding ring, for "live" indicators. */
export function PulseDot({
  className,
  ringClassName,
}: {
  className?: string;
  ringClassName?: string;
}) {
  return (
    <span aria-hidden className={cn("relative inline-flex size-2", className)}>
      <span
        className={cn(
          "absolute inset-0 rounded-full bg-brand-orange motion-safe:animate-pulse-ring",
          ringClassName,
        )}
      />
      <span className="relative inline-flex size-full rounded-full bg-brand-orange" />
    </span>
  );
}

/** Orange dot with a pulse, for use inside an <svg>. */
export function SvgPulseDot({
  cx,
  cy,
  r = 6,
}: {
  cx: number;
  cy: number;
  r?: number;
}) {
  return (
    <g fill="var(--color-brand-orange)">
      <circle
        cx={cx}
        cy={cy}
        r={r}
        className="origin-center transform-fill motion-safe:animate-pulse-ring"
      />
      <circle cx={cx} cy={cy} r={r} />
    </g>
  );
}

/** Dotted "route" stroke whose dots flow along the path. */
export function RoutePath({ d, className }: { d: string; className?: string }) {
  return (
    <path
      d={d}
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeDasharray="0 14"
      className={cn("motion-safe:animate-dash-flow", className)}
    />
  );
}

/** Four-point star used between marquee items. */
export function Sparkle({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("size-4 shrink-0", className)}
    >
      <path
        fill="currentColor"
        d="M12 0c.6 6.2 5.8 11.4 12 12-6.2.6-11.4 5.8-12 12-.6-6.2-5.8-11.4-12-12C6.2 11.4 11.4 6.2 12 0z"
      />
    </svg>
  );
}

type EyebrowProps = {
  children: React.ReactNode;
  tone?: "onLight" | "onDark" | "onOrange";
  className?: string;
};

/** Small uppercase label above section headings. */
export function Eyebrow({
  children,
  tone = "onLight",
  className,
}: EyebrowProps) {
  return (
    <p
      className={cn(
        "font-heading text-[13px] font-bold uppercase tracking-[0.2em]",
        tone === "onLight" && "text-brand-orange-ink",
        tone === "onDark" && "text-brand-orange",
        tone === "onOrange" && "text-brand-ink",
        className,
      )}
    >
      {children}
    </p>
  );
}

/** Shared page-width wrapper for landing sections. */
export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8", className)}>
      {children}
    </div>
  );
}
