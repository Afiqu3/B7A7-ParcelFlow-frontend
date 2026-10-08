"use client";

import { useForm } from "@tanstack/react-form";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import {
    AtSign,
    CheckCircle2,
    Eye,
    EyeClosed,
    Loader2,
    Mail,
    RotateCcw,
    UserRound,
    UserRoundPlus,
    UserRoundSearch,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { FetchError } from "ofetch";
import PasswordStrength from "@/components/modules/authentication/PasswordStrength";
import { useCreateAdmin } from "@/hooks";
import type { AdminCreatePayload } from "@/types";
import { createAdminSchema } from "@/validation";
import {
    containerVariants,
    errorMotion,
    iconSwapMotion,
    itemVariants,
    labelSwapMotion,
    useShake,
} from "./form-motion";
import { Button } from "../ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

const inputClass =
    "h-11 rounded-xl border-secondary/15 bg-background pr-11 text-secondary shadow-none placeholder:text-secondary/40 focus-visible:border-brand-orange focus-visible:ring-3 focus-visible:ring-brand-orange/30 aria-invalid:border-destructive/60";

const inputLeadingIconClass = `${inputClass} pl-10`;

/** Create-admin form: name, login + personal emails, strong password. */
export default function CreateAdminForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [formScope, shakeForm] = useShake<HTMLFormElement>();
    const [createdEmail, setCreatedEmail] = useState<string | null>(null);
    const { mutate: create, isPending } = useCreateAdmin();

    const form = useForm({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            personalEmail: "",
        },
        validators: {
            onSubmit: createAdminSchema,
        },
        onSubmitInvalid: () => {
            setCreatedEmail(null);
            shakeForm();
        },
        onSubmit: ({ value }) => {
            setCreatedEmail(null);
            const payload: AdminCreatePayload = {
                name: value.name.trim(),
                email: value.email.trim(),
                password: value.password,
                personalEmail: value.personalEmail.trim(),
            };

            create(payload, {
                onSuccess: (res) => {
                    if (
                        res &&
                        typeof res === "object" &&
                        "success" in res &&
                        !res.success
                    ) {
                        shakeForm();
                        toast.error("Could not create admin", {
                            description:
                                "Something went wrong. Please try again.",
                        });
                        return;
                    }
                    toast.success("Admin created", {
                        description: `${payload.email} can now sign in.`,
                    });
                    setCreatedEmail(payload.email);
                    form.reset();
                    setShowPassword(false);
                },
                onError: (err: FetchError) => {
                    shakeForm();
                    toast.error("Could not create admin", {
                        description:
                            err.data?.message ||
                            err.message ||
                            "Something went wrong. Please try again.",
                    });
                },
            });
        },
    });

    return (
        <MotionConfig reducedMotion="user">
            <motion.section
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                aria-labelledby="create-admin-title"
                className="overflow-hidden rounded-2xl bg-card text-card-foreground ring-1 ring-secondary/10 shadow-[0_24px_48px_-32px_rgba(15,32,86,0.35)]"
            >
                {/* Card header */}
                <motion.div
                    variants={itemVariants}
                    className="flex flex-col gap-4 border-b border-secondary/8 bg-linear-to-r from-brand-cream via-brand-cream/40 to-transparent px-5 py-5 sm:flex-row sm:items-center sm:px-6"
                >
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand text-white shadow-[0_12px_24px_-12px_rgba(15,32,86,0.7)]">
                        <UserRoundPlus className="size-5" strokeWidth={2.25} />
                    </span>
                    <div className="min-w-0">
                        <h2
                            id="create-admin-title"
                            className="font-heading text-lg font-extrabold tracking-tight text-secondary"
                        >
                            New admin account
                        </h2>
                        <p className="mt-0.5 text-sm text-secondary/70">
                            They&apos;ll sign in with this email and password.
                        </p>
                    </div>
                    <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-brand-orange/12 px-3 py-1 font-heading text-[11px] font-bold tracking-wide text-brand-orange-ink uppercase sm:ml-auto">
                        Admin only
                    </span>
                </motion.div>

                <div className="px-5 py-5 sm:px-6 sm:py-6">
                    {/* Success banner */}
                    <AnimatePresence initial={false}>
                        {createdEmail !== null && (
                            <motion.div
                                key="admin-created"
                                initial={{
                                    opacity: 0,
                                    height: 0,
                                    marginBottom: 0,
                                }}
                                animate={{
                                    opacity: 1,
                                    height: "auto",
                                    marginBottom: 16,
                                }}
                                exit={{
                                    opacity: 0,
                                    height: 0,
                                    marginBottom: 0,
                                }}
                                transition={{
                                    duration: 0.28,
                                    ease: "easeOut",
                                }}
                                className="overflow-hidden"
                            >
                                <output className="flex flex-col gap-3 rounded-xl bg-emerald-600/10 px-3.5 py-3 text-sm font-medium text-emerald-800 ring-1 ring-emerald-600/20 ring-inset sm:flex-row sm:items-center">
                                    <span className="flex min-w-0 flex-1 items-start gap-2.5">
                                        <CheckCircle2
                                            className="mt-0.5 size-4.5 shrink-0 text-emerald-600"
                                            strokeWidth={2.25}
                                        />
                                        <span className="min-w-0">
                                            Admin account created.
                                            <span className="block truncate font-mono text-[13px]">
                                                {createdEmail}
                                            </span>
                                        </span>
                                    </span>
                                    <Button
                                        type="button"
                                        onClick={() => setCreatedEmail(null)}
                                        className="h-9 shrink-0 rounded-xl bg-emerald-700 px-4 font-heading text-xs font-bold text-white transition hover:brightness-125 active:scale-[0.99]"
                                    >
                                        <UserRoundPlus className="size-4" />
                                        Create another
                                    </Button>
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
                            {/* Name */}
                            <form.Field name="name">
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
                                                    Full name
                                                </FieldLabel>
                                                <div className="relative">
                                                    <UserRound
                                                        aria-hidden
                                                        className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-secondary/35"
                                                    />
                                                    <Input
                                                        id={field.name}
                                                        name={field.name}
                                                        autoComplete="name"
                                                        placeholder="New admin's name"
                                                        value={field.state.value}
                                                        onChange={(e) =>
                                                            field.handleChange(
                                                                e.target.value,
                                                            )
                                                        }
                                                        onBlur={field.handleBlur}
                                                        aria-invalid={isInvalid}
                                                        className={
                                                            inputLeadingIconClass
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

                            {/* Emails */}
                            <div className="grid gap-5 sm:grid-cols-2 sm:items-start">
                                <form.Field name="email">
                                    {(field) => {
                                        const isInvalid =
                                            field.state.meta.isTouched &&
                                            !field.state.meta.isValid;
                                        return (
                                            <motion.div
                                                variants={itemVariants}
                                            >
                                                <Field data-invalid={isInvalid}>
                                                    <FieldLabel
                                                        htmlFor={field.name}
                                                        className="font-heading font-bold text-secondary"
                                                    >
                                                        Login email
                                                    </FieldLabel>
                                                    <div className="relative">
                                                        <AtSign
                                                            aria-hidden
                                                            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-secondary/35"
                                                        />
                                                        <Input
                                                            id={field.name}
                                                            name={field.name}
                                                            type="email"
                                                            autoComplete="off"
                                                            placeholder="admin@mail.com"
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
                                                            className={
                                                                inputLeadingIconClass
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
                                                                        field
                                                                            .state
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

                                <form.Field name="personalEmail">
                                    {(field) => {
                                        const isInvalid =
                                            field.state.meta.isTouched &&
                                            !field.state.meta.isValid;
                                        return (
                                            <motion.div
                                                variants={itemVariants}
                                            >
                                                <Field data-invalid={isInvalid}>
                                                    <FieldLabel
                                                        htmlFor={field.name}
                                                        className="font-heading font-bold text-secondary"
                                                    >
                                                        Personal email
                                                    </FieldLabel>
                                                    <div className="relative">
                                                        <Mail
                                                            aria-hidden
                                                            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-secondary/35"
                                                        />
                                                        <Input
                                                            id={field.name}
                                                            name={field.name}
                                                            type="email"
                                                            autoComplete="off"
                                                            placeholder="name@mail.com"
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
                                                            className={
                                                                inputLeadingIconClass
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
                                                                        field
                                                                            .state
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
                            </div>

                            {/* Password */}
                            <form.Field name="password">
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
                                                    Temporary password
                                                </FieldLabel>
                                                <div className="relative">
                                                    <Input
                                                        id={field.name}
                                                        name={field.name}
                                                        type={
                                                            showPassword
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
                                                                e.target.value,
                                                            )
                                                        }
                                                        onBlur={
                                                            field.handleBlur
                                                        }
                                                        aria-invalid={isInvalid}
                                                        aria-describedby="create-admin-requirements"
                                                        className={inputClass}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setShowPassword(
                                                                (visible) =>
                                                                    !visible,
                                                            )
                                                        }
                                                        aria-label={
                                                            showPassword
                                                                ? "Hide password"
                                                                : "Show password"
                                                        }
                                                        aria-pressed={
                                                            showPassword
                                                        }
                                                        className="absolute top-1/2 right-3 grid size-7 -translate-y-1/2 place-items-center rounded-lg text-secondary/50 outline-none transition-colors hover:bg-secondary/8 hover:text-secondary focus-visible:ring-2 focus-visible:ring-brand-orange/50"
                                                    >
                                                        <AnimatePresence
                                                            initial={false}
                                                            mode="wait"
                                                        >
                                                            <motion.span
                                                                key={
                                                                    showPassword
                                                                        ? "hide"
                                                                        : "show"
                                                                }
                                                                {...iconSwapMotion}
                                                                className="flex"
                                                            >
                                                                {showPassword ? (
                                                                    <EyeClosed className="size-4" />
                                                                ) : (
                                                                    <Eye className="size-4" />
                                                                )}
                                                            </motion.span>
                                                        </AnimatePresence>
                                                    </button>
                                                </div>
                                                <AnimatePresence>
                                                    {isInvalid &&
                                                        !field.state.value && (
                                                            <motion.div
                                                                key={`${field.name}-empty`}
                                                                {...errorMotion}
                                                                className="overflow-hidden"
                                                            >
                                                                <FieldError>
                                                                    Password is
                                                                    required
                                                                </FieldError>
                                                            </motion.div>
                                                        )}
                                                </AnimatePresence>
                                                <PasswordStrength
                                                    id="create-admin-requirements"
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
                                                Creating…
                                            </motion.span>
                                        ) : (
                                            <motion.span
                                                key="idle"
                                                {...labelSwapMotion}
                                                className="inline-flex items-center gap-2"
                                            >
                                                <UserRoundPlus className="size-4" />
                                                Create admin
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={isPending}
                                    onClick={() => {
                                        form.reset();
                                        setCreatedEmail(null);
                                        setShowPassword(false);
                                    }}
                                    className="h-11 rounded-xl border-secondary/15 font-heading text-sm font-bold text-secondary hover:bg-secondary/5 hover:text-secondary"
                                >
                                    <RotateCcw className="size-4" />
                                    Clear
                                </Button>
                                <p className="flex items-center gap-1.5 text-xs text-secondary/60 sm:ml-auto">
                                    <UserRoundSearch
                                        aria-hidden
                                        className="size-3.5"
                                    />
                                    Share the password securely with its owner.
                                </p>
                            </motion.div>
                        </FieldGroup>
                    </form>
                </div>
            </motion.section>
        </MotionConfig>
    );
}
