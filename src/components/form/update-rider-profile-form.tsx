"use client";

import { useForm } from "@tanstack/react-form";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import {
    CircleAlert,
    Loader2,
    MapPin,
    Phone,
    RefreshCw,
    RotateCcw,
    Save,
    UserRound,
    UserRoundPen,
} from "lucide-react";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { FetchError } from "ofetch";
import { useGetRiderProfile, useUpdateRiderProfile } from "@/hooks";
import type { RiderProfileData, RiderUpdatePayload } from "@/types";
import { updateRiderValidationSchema } from "@/validation";
import {
    containerVariants,
    errorMotion,
    itemVariants,
    labelSwapMotion,
    useShake,
} from "./form-motion";
import { Button } from "../ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";
import { Textarea } from "../ui/textarea";

const inputClass =
    "h-11 rounded-xl border-secondary/15 bg-background text-secondary shadow-none placeholder:text-secondary/40 focus-visible:border-brand-orange focus-visible:ring-3 focus-visible:ring-brand-orange/30 aria-invalid:border-destructive/60";

const textAreaClass =
    "min-h-20 rounded-xl border-secondary/15 bg-background text-secondary shadow-none placeholder:text-secondary/40 focus-visible:border-brand-orange focus-visible:ring-3 focus-visible:ring-brand-orange/30 aria-invalid:border-destructive/60";

// The API accepts a partial payload, but this form always carries all
// three values (prefilled), so validate them as complete while reusing
// the shared rules.
const updateRiderFormSchema = updateRiderValidationSchema.required();

/** Rider update-profile form: prefills, PATCHes only changed fields. */
export default function UpdateRiderProfileForm() {
    const {
        data,
        isPending: profilePending,
        isError,
        error,
        refetch,
        isFetching,
    } = useGetRiderProfile();

    if (profilePending) return <UpdateRiderSkeleton />;

    if (isError || !data?.data) {
        return (
            <div className="flex flex-col items-center gap-3 rounded-2xl bg-card px-6 py-12 text-center ring-1 ring-secondary/10 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300">
                <span className="grid size-12 place-items-center rounded-2xl bg-destructive/10 text-destructive">
                    <CircleAlert className="size-6" strokeWidth={2} />
                </span>
                <div>
                    <h2 className="font-heading text-lg font-extrabold tracking-tight text-secondary">
                        Couldn&apos;t load your profile
                    </h2>
                    <p className="mx-auto mt-1 max-w-sm text-sm text-secondary/65">
                        {(error as Error)?.message ||
                            "Something went wrong while fetching your details. Please try again."}
                    </p>
                </div>
                <Button
                    type="button"
                    onClick={() => refetch()}
                    disabled={isFetching}
                    className="h-10 rounded-xl bg-brand px-5 font-heading text-sm font-bold text-white transition hover:brightness-125 active:scale-[0.99] disabled:opacity-70"
                >
                    <RefreshCw
                        className={`size-4 ${isFetching ? "animate-spin" : ""}`}
                    />
                    {isFetching ? "Retrying…" : "Try again"}
                </Button>
            </div>
        );
    }

    return <RiderEditCard profile={data.data} />;
}

function RiderEditCard({ profile }: { profile: RiderProfileData }) {
    const router = useRouter();
    const [formScope, shakeForm] = useShake<HTMLFormElement>();
    const { mutate: update, isPending } = useUpdateRiderProfile();

    const details = profile.riderProfile;
    const initial = useMemo(
        () => ({
            name: profile.name,
            phone: details.phone,
            address: details.address ?? "",
        }),
        [profile, details],
    );

    const form = useForm({
        defaultValues: initial,
        validators: {
            onSubmit: updateRiderFormSchema,
        },
        onSubmitInvalid: () => {
            shakeForm();
        },
        onSubmit: ({ value }) => {
            // Partial update: only send fields the rider actually changed.
            const payload: RiderUpdatePayload = {};
            const name = value.name.trim();
            const phone = value.phone.trim();
            const address = value.address.trim();
            if (name !== profile.name) payload.name = name;
            if (phone !== details.phone) payload.phone = phone;
            if (address !== (details.address ?? "")) payload.address = address;

            if (Object.keys(payload).length === 0) {
                toast.info("No changes to save", {
                    description: "Your profile is already up to date.",
                });
                return;
            }

            update(payload, {
                onSuccess: (res) => {
                    if (
                        res &&
                        typeof res === "object" &&
                        "success" in res &&
                        !res.success
                    ) {
                        shakeForm();
                        toast.error("Could not update profile", {
                            description:
                                "Something went wrong. Please try again.",
                        });
                        return;
                    }
                    toast.success("Profile updated", {
                        description: "Your changes are now live.",
                    });
                    router.push("/rider-dashboard/profile");
                },
                onError: (err: FetchError) => {
                    shakeForm();
                    toast.error("Could not update profile", {
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
                aria-labelledby="update-rider-profile-title"
                className="overflow-hidden rounded-2xl bg-card text-card-foreground ring-1 ring-secondary/10 shadow-[0_24px_48px_-32px_rgba(15,32,86,0.35)]"
            >
                {/* Card header */}
                <motion.div
                    variants={itemVariants}
                    className="flex flex-col gap-4 border-b border-secondary/8 bg-gradient-to-r from-brand-cream via-brand-cream/40 to-transparent px-5 py-5 sm:flex-row sm:items-center sm:px-6"
                >
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand text-white shadow-[0_12px_24px_-12px_rgba(15,32,86,0.7)]">
                        <UserRoundPen className="size-5" strokeWidth={2.25} />
                    </span>
                    <div className="min-w-0">
                        <h2
                            id="update-rider-profile-title"
                            className="font-heading text-lg font-extrabold tracking-tight text-secondary"
                        >
                            Edit your details
                        </h2>
                        <p className="mt-0.5 truncate text-sm text-secondary/70">
                            Updating profile for {profile.email}
                        </p>
                    </div>
                </motion.div>

                <div className="px-5 py-5 sm:px-6 sm:py-6">
                    <form
                        ref={formScope}
                        noValidate
                        onSubmit={(e) => {
                            e.preventDefault();
                            form.handleSubmit();
                        }}
                    >
                        <FieldGroup>
                            <div className="grid gap-5 sm:grid-cols-2 sm:items-start">
                                <form.Field name="name">
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
                                                            placeholder="Your name"
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
                                                            className={`${inputClass} pl-10`}
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

                                <form.Field name="phone">
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
                                                        Phone
                                                    </FieldLabel>
                                                    <div className="relative">
                                                        <Phone
                                                            aria-hidden
                                                            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-secondary/35"
                                                        />
                                                        <Input
                                                            id={field.name}
                                                            name={field.name}
                                                            type="tel"
                                                            autoComplete="tel"
                                                            placeholder="01XXXXXXXXX"
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
                                                            className={`${inputClass} pl-10`}
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

                            <form.Field name="address">
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
                                                    Address{" "}
                                                    <span className="font-medium text-secondary/45">
                                                        (optional)
                                                    </span>
                                                </FieldLabel>
                                                <div className="relative">
                                                    <MapPin
                                                        aria-hidden
                                                        className="pointer-events-none absolute top-3.5 left-3.5 size-4 text-secondary/35"
                                                    />
                                                    <Textarea
                                                        id={field.name}
                                                        name={field.name}
                                                        autoComplete="street-address"
                                                        placeholder="Area, city"
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
                                                        className={`${textAreaClass} pl-10`}
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

                            {/* Actions */}
                            <motion.div
                                variants={itemVariants}
                                className="flex flex-col-reverse gap-2.5 pt-1 sm:flex-row sm:items-center"
                            >
                                <form.Subscribe
                                    selector={(state) => [
                                        state.values.name,
                                        state.values.phone,
                                        state.values.address,
                                    ]}
                                >
                                    {([name, phone, address]) => {
                                        const pristine =
                                            name === initial.name &&
                                            phone === initial.phone &&
                                            address === initial.address;
                                        return (
                                            <>
                                                <Button
                                                    type="submit"
                                                    disabled={
                                                        isPending || pristine
                                                    }
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
                                                                Saving…
                                                            </motion.span>
                                                        ) : (
                                                            <motion.span
                                                                key="idle"
                                                                {...labelSwapMotion}
                                                                className="inline-flex items-center gap-2"
                                                            >
                                                                <Save className="size-4" />
                                                                Save changes
                                                            </motion.span>
                                                        )}
                                                    </AnimatePresence>
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    disabled={
                                                        isPending || pristine
                                                    }
                                                    onClick={() =>
                                                        form.reset()
                                                    }
                                                    className="h-11 rounded-xl border-secondary/15 font-heading text-sm font-bold text-secondary hover:bg-secondary/5 hover:text-secondary"
                                                >
                                                    <RotateCcw className="size-4" />
                                                    Reset
                                                </Button>
                                            </>
                                        );
                                    }}
                                </form.Subscribe>
                                <p className="text-xs text-secondary/60 sm:ml-auto">
                                    Only changed fields are sent.
                                </p>
                            </motion.div>
                        </FieldGroup>
                    </form>
                </div>
            </motion.section>
        </MotionConfig>
    );
}

function UpdateRiderSkeleton() {
    return (
        <div
            aria-hidden
            className="overflow-hidden rounded-2xl bg-card ring-1 ring-secondary/10"
        >
            <div className="border-b border-secondary/8 px-5 py-5 sm:px-6">
                <div className="flex items-center gap-4">
                    <Skeleton className="size-11 rounded-xl" />
                    <div className="flex-1">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="mt-2 h-4 w-56" />
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-5 px-5 py-5 sm:px-6 sm:py-6">
                <div className="grid gap-5 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-11 w-full rounded-xl" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-11 w-full rounded-xl" />
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-20 w-full rounded-xl" />
                </div>
                <div className="flex flex-col-reverse gap-2.5 sm:flex-row">
                    <Skeleton className="h-11 w-full rounded-xl sm:w-40" />
                    <Skeleton className="h-11 w-full rounded-xl sm:w-28" />
                </div>
            </div>
        </div>
    );
}
