"use client";

import { Check, X } from "lucide-react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { PASSWORD_RULES } from "@/validation";

type StrengthLevel = {
  label: string;
  /** Fill colour for the active meter segments. */
  bar: string;
  /** Text colour for the strength label. */
  text: string;
};

// Every rule is required, so only "Strong" means the password will be
// accepted. "Almost there" is deliberately not a green/"good" state.
function getStrength(score: number, total: number): StrengthLevel | null {
  if (score === 0) return null;
  if (score === total) {
    return { label: "Strong", bar: "bg-emerald-600", text: "text-emerald-700" };
  }
  if (score === total - 1) {
    return {
      label: "Almost there",
      bar: "bg-amber-400",
      text: "text-amber-700",
    };
  }
  if (score >= Math.ceil(total / 2)) {
    return {
      label: "Fair",
      bar: "bg-brand-orange",
      text: "text-brand-orange-ink",
    };
  }
  return { label: "Weak", bar: "bg-destructive", text: "text-destructive" };
}

type PasswordStrengthProps = {
  password: string;
  /** Mark unmet rules as errors, e.g. after a failed submit. */
  showErrors?: boolean;
  /** Point the password input's `aria-describedby` at this id. */
  id?: string;
  className?: string;
};

export default function PasswordStrength({
  password,
  showErrors = false,
  id,
  className,
}: PasswordStrengthProps) {
  const results = PASSWORD_RULES.map((rule) => ({
    rule,
    passed: rule.test(password),
  }));
  const total = results.length;
  const score = results.filter((r) => r.passed).length;
  const strength = getStrength(score, total);

  return (
    <MotionConfig reducedMotion="user">
      <div id={id} className={cn("flex flex-col gap-3", className)}>
        <div className="flex items-center gap-3">
          {/* Native meter for assistive tech; the segmented bar is visual only. */}
          <meter
            className="sr-only"
            min={0}
            max={total}
            value={score}
            aria-label="Password strength"
            aria-valuetext={strength?.label ?? "No password entered"}
          />
          <div aria-hidden className="flex flex-1 gap-1">
            {results.map(({ rule }, index) => (
              <span
                key={rule.id}
                className={cn(
                  "h-1.5 flex-1 rounded-full bg-secondary/10 transition-colors duration-300 motion-reduce:transition-none",
                  index < score && strength?.bar,
                )}
              />
            ))}
          </div>
          <span
            aria-hidden
            className={cn(
              "min-w-22 text-right font-heading text-xs font-bold transition-colors",
              strength ? strength.text : "text-secondary/50",
            )}
          >
            {strength?.label ?? "Strength"}
          </span>
        </div>

        <ul className="grid gap-x-4 gap-y-1.5 sm:grid-cols-2">
          {results.map(({ rule, passed }) => {
            const failed = !passed && showErrors;

            return (
              <li
                key={rule.id}
                className={cn(
                  "flex items-center gap-2 text-xs transition-colors",
                  passed && "text-emerald-700",
                  failed && "text-destructive",
                  !passed && !failed && "text-secondary/70",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "flex size-4 shrink-0 items-center justify-center rounded-full transition-colors",
                    passed && "bg-emerald-600 text-white",
                    failed && "bg-destructive/10 text-destructive",
                    !passed && !failed && "bg-secondary/10 text-secondary/40",
                  )}
                >
                  {/* Pops the icon in whenever a rule's state changes. */}
                  <AnimatePresence initial={false} mode="popLayout">
                    <motion.span
                      key={passed ? "passed" : failed ? "failed" : "pending"}
                      initial={{ opacity: 0, scale: 0.4 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 24,
                      }}
                      className="flex"
                    >
                      {passed ? (
                        <Check className="size-3" strokeWidth={3} />
                      ) : failed ? (
                        <X className="size-3" strokeWidth={3} />
                      ) : (
                        <span className="size-1.5 rounded-full bg-current" />
                      )}
                    </motion.span>
                  </AnimatePresence>
                </span>
                {rule.label}
                <span className="sr-only">
                  {passed ? "(met)" : "(not met)"}
                </span>
              </li>
            );
          })}
        </ul>

        {/* Announces level changes to screen readers without reading every keystroke. */}
        <p className="sr-only" aria-live="polite">
          {strength
            ? `Password strength: ${strength.label}. ${score} of ${total} requirements met.`
            : ""}
        </p>
      </div>
    </MotionConfig>
  );
}
