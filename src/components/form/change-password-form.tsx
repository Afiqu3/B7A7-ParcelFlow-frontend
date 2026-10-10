"use client";

import PasswordStrength from "@/components/modules/authentication/PasswordStrength";
import { useChangePassword, useGetMe } from "@/hooks";
import { changePasswordSchema } from "@/validation";
import { useForm } from "@tanstack/react-form";
import {
    Check,
    CheckCircle2,
    Eye,
    EyeClosed,
    KeyRound,
    Loader2,
    Lock,
    RotateCcw,
    ShieldCheck,
} from "lucide-react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import type { FetchError } from "ofetch";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants";
import { ROLE_HOME } from "@/routes";
import { Button } from "../ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import {
    containerVariants,
    errorMotion,
    iconSwapMotion,
    itemVariants,
    labelSwapMotion,
    useShake,
} from "./form-motion";

const inputClass =
    "h-11 rounded-xl border-secondary/15 bg-background pr-11 text-secondary shadow-none placeholder:text-secondary/40 focus-visible:border-brand-orange focus-visible:ring-3 focus-visible:ring-brand-orange/30 aria-invalid:border-destructive/60";

function VisibilityToggle({
    visible,
    onToggle,
    label,
}: {
    visible: boolean;
    onToggle: () => void;
    label: string;
}) {
    return (
        <button
            type="button"
            onClick={onToggle}
            aria-label={`${visible ? "Hide" : "Show"} ${label}`}
            aria-pressed={visible}
            className="absolute top-1/2 right-3 grid size-7 -translate-y-1/2 place-items-center rounded-lg text-secondary/50 outline-none transition-colors hover:bg-secondary/8 hover:text-secondary focus-visible:ring-2 focus-visible:ring-brand-orange/50"
        >
            <AnimatePresence initial={false} mode="wait">
                <motion.span
                    key={visible ? "hide" : "show"}
                    {...iconSwapMotion}
                    className="flex"
                >
                    {visible ? (
                        <EyeClosed className="size-4" />
                    ) : (
                        <Eye className="size-4" />
                    )}
                </motion.span>
            </AnimatePresence>
        </button>
    );
}

export default function ChangePasswordForm() {
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [formScope, shakeForm] = useShake<HTMLFormElement>();
    const [justUpdated, setJustUpdated] = useState(false);
    const router = useRouter();
    const { data: me } = useGetMe();
    const wasForced = me?.mustChangePassword === true;

    const { mutate: changePassword, isPending } = useChangePassword();

    const form = useForm({
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
        validators: {
            onSubmit: changePasswordSchema,
        },
        onSubmitInvalid: () => {
            setJustUpdated(false);
            shakeForm();
        },
        onSubmit: ({ value }) => {
            setJustUpdated(false);
            changePassword(
                {
                    currentPassword: value.currentPassword,
                    newPassword: value.newPassword,
                },
                {
                    onSuccess: (res) => {
                        if (res && typeof res === "object" && "success" in res && !res.success) {
                            shakeForm();
                            toast.error("Could not update password", {
                                description: "Something went wrong. Please try again.",
                            });
                            return;
                        }
                        toast.success("Password updated", {
                            description:
                                "Use your new password the next time you sign in.",
                        });
                        setJustUpdated(true);
                        form.reset();
                        if (wasForced) {
                            router.push(
                                me?.role
                                    ? ROLE_HOME[me.role]
                                    : ROUTES.merchantDashboard,
                            );
                        }
                    },
                    onError: (err: FetchError) => {
                        shakeForm();
                        toast.error("Could not update password", {
                            description:
                                err.data?.message ||
                                err.message ||
                                "Something went wrong. Please try again.",
                        });
                    },
                },
            );
        },
    });

    return (
        <MotionConfig reducedMotion="user">
            <motion.section
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                aria-labelledby="change-password-title"
                className="overflow-hidden rounded-2xl bg-card text-card-foreground ring-1 ring-secondary/10 shadow-[0_24px_48px_-32px_rgba(15,32,86,0.35)]"
            >
                {/* Card header */}
                <motion.div
                    variants={itemVariants}
                    className="flex flex-col gap-4 border-b border-secondary/8 bg-gradient-to-r from-brand-cream via-brand-cream/40 to-transparent px-5 py-5 sm:flex-row sm:items-center sm:px-6"
                >
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand text-white shadow-[0_12px_24px_-12px_rgba(15,32,86,0.7)]">
                        <KeyRound className="size-5" strokeWidth={2.25} />
                    </span>
                    <div className="min-w-0">
                        <h2
                            id="change-password-title"
                            className="font-heading text-lg font-extrabold tracking-tight text-secondary"
                        >
                            Update your password
                        </h2>
                        <p className="mt-0.5 text-sm text-secondary/70">
                            Choose a strong, unique password to keep your
                            parcels and payouts safe.
                        </p>
                    </div>
                    <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-brand/8 px-3 py-1 font-heading text-[11px] font-bold tracking-wide text-brand uppercase sm:ml-auto">
                        <ShieldCheck className="size-3.5" strokeWidth={2.5} />
                        Secure
                    </span>
                </motion.div>

                <div className="px-5 py-5 sm:px-6 sm:py-6">
                    {/* Success banner */}
                    <AnimatePresence initial={false}>
                        {justUpdated && (
                            <motion.div
                                key="updated-banner"
                                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                transition={{ duration: 0.28, ease: "easeOut" }}
                                className="overflow-hidden"
                            >
                                <output
                                    className="flex items-start gap-2.5 rounded-xl bg-emerald-600/10 px-3.5 py-3 text-sm font-medium text-emerald-800 ring-1 ring-emerald-600/20 ring-inset"
                                >
                                    <CheckCircle2
                                        className="mt-0.5 size-4.5 shrink-0 text-emerald-600"
                                        strokeWidth={2.25}
                                    />
                                    Password changed successfully. Other
                                    devices may be signed out automatically.
                                </output>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form
                        ref={formScope}
                        noValidate
                        onSubmit={(e) => {
                            e.preventDefault();
                            form.handleSubmit();
                        }}
                    >
                        <FieldGroup>
                            {/* Current password */}
                            <form.Field name="currentPassword">
                                {(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched &&
                                        !field.state.meta.isValid;
                                    return (
                                        <motion.div variants={itemVariants}>
                                            <Field data-invalid={isInvalid}>
                                                <FieldLabel
                                                    htmlFor={field.name}
                                                    className="font-heading font-bold text-secondary"
                                                >
                                                    Current password
                                                </FieldLabel>
                                                <div className="relative">
                                                    <Lock
                                                        aria-hidden
                                                        className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-secondary/35"
                                                    />
                                                    <Input
                                                        id={field.name}
                                                        name={field.name}
                                                        type={
                                                            showCurrent
                                                                ? "text"
                                                                : "password"
                                                        }
                                                        autoComplete="current-password"
                                                        placeholder="Enter your current password"
                                                        value={field.state.value}
                                                        onChange={(e) =>
                                                            field.handleChange(
                                                                e.target.value,
                                                            )
                                                        }
                                                        onBlur={field.handleBlur}
                                                        aria-invalid={isInvalid}
                                                        className={`${inputClass} pl-10`}
                                                    />
                                                    <VisibilityToggle
                                                        visible={showCurrent}
                                                        label="current password"
                                                        onToggle={() =>
                                                            setShowCurrent(
                                                                (v) => !v,
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <AnimatePresence>
                                                    {isInvalid && (
                                                        <motion.div
                                                            key={`${field.name}-error`}
                                                            {...errorMotion}
                                                            className="overflow-hidden"
                                                        >
                                                            <FieldError
                                                                errors={
                                                                    field.state
                                                                        .meta
                                                                        .errors
                                                                }
                                                            />
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </Field>
                                        </motion.div>
                                    );
                                }}
                            </form.Field>

                            {/* New + confirm: stack on mobile, split on sm+ */}
                            <div className="grid gap-5 md:grid-cols-2 md:items-start">
                                <form.Field name="newPassword">
                                    {(field) => {
                                        const isInvalid =
                                            field.state.meta.isTouched &&
                                            !field.state.meta.isValid;
                                        return (
                                            <motion.div variants={itemVariants}>
                                                <Field data-invalid={isInvalid}>
                                                    <FieldLabel
                                                        htmlFor={field.name}
                                                        className="font-heading font-bold text-secondary"
                                                    >
                                                        New password
                                                    </FieldLabel>
                                                    <div className="relative">
                                                        <Input
                                                            id={field.name}
                                                            name={field.name}
                                                            type={
                                                                showNew
                                                                    ? "text"
                                                                    : "password"
                                                            }
                                                            autoComplete="new-password"
                                                            placeholder="Create a strong password"
                                                            value={
                                                                field.state.value
                                                            }
                                                            onChange={(e) =>
                                                                field.handleChange(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            onBlur={
                                                                field.handleBlur
                                                            }
                                                            aria-invalid={
                                                                isInvalid
                                                            }
                                                            aria-describedby="change-password-requirements"
                                                            className={inputClass}
                                                        />
                                                        <VisibilityToggle
                                                            visible={showNew}
                                                            label="new password"
                                                            onToggle={() =>
                                                                setShowNew(
                                                                    (v) => !v,
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    <AnimatePresence>
                                                        {isInvalid &&
                                                            !field.state
                                                                .value && (
                                                                <motion.div
                                                                    key={`${field.name}-empty`}
                                                                    {...errorMotion}
                                                                    className="overflow-hidden"
                                                                >
                                                                    <FieldError>
                                                                        Password
                                                                        is
                                                                        required
                                                                    </FieldError>
                                                                </motion.div>
                                                            )}
                                                    </AnimatePresence>
                                                    <PasswordStrength
                                                        id="change-password-requirements"
                                                        password={
                                                            field.state.value
                                                        }
                                                        showErrors={isInvalid}
                                                        className="mt-3"
                                                    />
                                                </Field>
                                            </motion.div>
                                        );
                                    }}
                                </form.Field>

                                <form.Field
                                    name="confirmPassword"
                                    validators={{
                                        onChangeListenTo: ["newPassword"],
                                    }}
                                >
                                    {(field) => {
                                        const isInvalid =
                                            field.state.meta.isTouched &&
                                            !field.state.meta.isValid;
                                        const confirmValue =
                                            field.state.value ?? "";
                                        const newValue =
                                            field.form.state.values
                                                .newPassword ?? "";
                                        const matches =
                                            confirmValue.length > 0 &&
                                            confirmValue === newValue;
                                        return (
                                            <motion.div variants={itemVariants}>
                                                <Field data-invalid={isInvalid}>
                                                    <FieldLabel
                                                        htmlFor={field.name}
                                                        className="font-heading font-bold text-secondary"
                                                    >
                                                        Confirm new password
                                                    </FieldLabel>
                                                    <div className="relative">
                                                        <Input
                                                            id={field.name}
                                                            name={field.name}
                                                            type={
                                                                showConfirm
                                                                    ? "text"
                                                                    : "password"
                                                            }
                                                            autoComplete="new-password"
                                                            placeholder="Repeat your new password"
                                                            value={
                                                                field.state.value
                                                            }
                                                            onChange={(e) =>
                                                                field.handleChange(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            onBlur={
                                                                field.handleBlur
                                                            }
                                                            aria-invalid={
                                                                isInvalid
                                                            }
                                                            className={inputClass}
                                                        />
                                                        <VisibilityToggle
                                                            visible={showConfirm}
                                                            label="password confirmation"
                                                            onToggle={() =>
                                                                setShowConfirm(
                                                                    (v) => !v,
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    <AnimatePresence>
                                                        {isInvalid ? (
                                                            <motion.div
                                                                key={`${field.name}-error`}
                                                                {...errorMotion}
                                                                className="overflow-hidden"
                                                            >
                                                                <FieldError
                                                                    errors={
                                                                        field
                                                                            .state
                                                                            .meta
                                                                            .errors
                                                                    }
                                                                />
                                                            </motion.div>
                                                        ) : (
                                                            matches && (
                                                                <motion.p
                                                                    key={`${field.name}-match`}
                                                                    initial={{
                                                                        opacity: 0,
                                                                        height: 0,
                                                                    }}
                                                                    animate={{
                                                                        opacity: 1,
                                                                        height: "auto",
                                                                    }}
                                                                    exit={{
                                                                        opacity: 0,
                                                                        height: 0,
                                                                    }}
                                                                    transition={{
                                                                        duration: 0.2,
                                                                    }}
                                                                    className="flex items-center gap-1.5 overflow-hidden pt-1.5 text-xs font-semibold text-emerald-700"
                                                                >
                                                                    <span className="grid size-4 place-items-center rounded-full bg-emerald-600 text-white">
                                                                        <Check
                                                                            className="size-3"
                                                                            strokeWidth={
                                                                                3
                                                                            }
                                                                        />
                                                                    </span>
                                                                    Passwords
                                                                    match
                                                                </motion.p>
                                                            )
                                                        )}
                                                    </AnimatePresence>
                                                </Field>
                                            </motion.div>
                                        );
                                    }}
                                </form.Field>
                            </div>

                            {/* Actions */}
                            <motion.div
                                variants={itemVariants}
                                className="flex flex-col-reverse gap-2.5 pt-1 sm:flex-row sm:items-center"
                            >
                                <Button
                                    type="submit"
                                    disabled={isPending}
                                    className="h-11 flex-1 rounded-xl bg-brand-orange px-5 font-heading text-sm font-bold text-brand-ink shadow-[0_12px_28px_-12px_var(--color-brand-orange)] transition hover:brightness-110 active:scale-[0.99] disabled:opacity-70 sm:flex-none sm:px-8"
                                >
                                    <AnimatePresence
                                        initial={false}
                                        mode="popLayout"
                                    >
                                        {isPending ? (
                                            <motion.span
                                                key="pending"
                                                {...labelSwapMotion}
                                                className="inline-flex items-center gap-2"
                                            >
                                                <Loader2 className="size-4 animate-spin" />
                                                Updating…
                                            </motion.span>
                                        ) : (
                                            <motion.span
                                                key="idle"
                                                {...labelSwapMotion}
                                                className="inline-flex items-center gap-2"
                                            >
                                                <KeyRound className="size-4" />
                                                Update password
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </Button>
                                <form.Subscribe
                                    selector={(state) => [
                                        state.values.currentPassword,
                                        state.values.newPassword,
                                        state.values.confirmPassword,
                                    ]}
                                >
                                    {([current, next, confirm]) => (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            disabled={
                                                isPending ||
                                                (!current &&
                                                    !next &&
                                                    !confirm)
                                            }
                                            onClick={() => {
                                                form.reset();
                                                setJustUpdated(false);
                                            }}
                                            className="h-11 rounded-xl border-secondary/15 font-heading text-sm font-bold text-secondary hover:bg-secondary/5 hover:text-secondary"
                                        >
                                            <RotateCcw className="size-4" />
                                            Clear
                                        </Button>
                                    )}
                                </form.Subscribe>
                                <p className="text-xs text-secondary/60 sm:ml-auto">
                                    Make it at least 8 characters with a mix of
                                    cases, numbers &amp; symbols.
                                </p>
                            </motion.div>
                        </FieldGroup>
                    </form>
                </div>
            </motion.section>
        </MotionConfig>
    );
}
