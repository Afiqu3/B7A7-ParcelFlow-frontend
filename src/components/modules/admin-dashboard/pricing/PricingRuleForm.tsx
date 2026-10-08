"use client";

import { useForm } from "@tanstack/react-form";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { Loader2, Plus, Save } from "lucide-react";
import { toast } from "sonner";
import type { FetchError } from "ofetch";
import type z from "zod";
import SegmentedControl from "@/components/modules/pricing/SegmentedControl";
import {
    CATEGORIES,
    CATEGORY_ORDER,
    ZONE_ORDER,
    ZONES,
} from "@/components/modules/pricing/pricing-meta";
import { useCreatePricingRule, useUpdatePricingRule } from "@/hooks";
import type {
    CreatePricingRulePayload,
    PricingRule,
    UpdatePricingRulePayload,
} from "@/types";
import {
    createPricingRuleSchema,
    PARCEL_CATEGORIES,
    ZONE_TYPES,
} from "@/validation";
import {
    containerVariants,
    errorMotion,
    itemVariants,
    labelSwapMotion,
    useShake,
} from "@/components/form/form-motion";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { ReactNode } from "react";

type PricingRuleFormValues = Omit<
    z.input<typeof createPricingRuleSchema>,
    "baseCharge" | "perKgCharge"
> & {
    baseCharge: number | undefined;
    perKgCharge: number | undefined;
};

const inputClass =
    "h-11 rounded-xl border-secondary/15 bg-background text-secondary shadow-none placeholder:text-secondary/40 focus-visible:border-brand-orange focus-visible:ring-3 focus-visible:ring-brand-orange/30 aria-invalid:border-destructive/60 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

/** Empty or invalid decimal text → undefined (never NaN: NaN breaks
 *  referential equality in store selectors, and the schema reports
 *  `undefined` as required). */
function parseDecimal(raw: string): number | undefined {
    const cleaned = raw.replace(/[^\d.]/g, "");
    if (!cleaned) return undefined;
    const [whole = "", ...rest] = cleaned.split(".");
    const out = rest.length
        ? `${whole}.${rest.join("").slice(0, 2)}`
        : whole;
    if (out === "" || out === ".") return undefined;
    const value = Number(out);
    return Number.isFinite(value) ? value : undefined;
}

const displayNumber = (value: number | undefined) =>
    value === undefined || Number.isNaN(value) ? "" : String(value);

function FieldShell({
    label,
    htmlFor,
    optional,
    invalid,
    errors,
    hint,
    children,
}: {
    label: string;
    htmlFor: string;
    optional?: boolean;
    invalid: boolean;
    errors: React.ComponentProps<typeof FieldError>["errors"];
    hint?: string;
    children: ReactNode;
}) {
    return (
        <Field data-invalid={invalid}>
            <FieldLabel
                htmlFor={htmlFor}
                className="font-heading font-bold text-secondary"
            >
                {label}{" "}
                {optional && (
                    <span className="font-medium text-secondary/45">
                        (optional)
                    </span>
                )}
            </FieldLabel>
            {children}
            {hint && !invalid ? (
                <p className="text-xs text-secondary/55">{hint}</p>
            ) : null}
            <AnimatePresence>
                {invalid && (
                    <motion.div
                        key={`${htmlFor}-error`}
                        {...errorMotion}
                        className="overflow-hidden"
                    >
                        <FieldError errors={errors} />
                    </motion.div>
                )}
            </AnimatePresence>
        </Field>
    );
}

type NumberFieldApi = {
    state: {
        value: number | undefined;
        meta: {
            isTouched: boolean;
            isValid: boolean;
            errors: React.ComponentProps<typeof FieldError>["errors"];
        };
    };
    handleChange: (value: number | undefined) => void;
    handleBlur: () => void;
    name: string;
};

function NumberField({
    form,
    name,
    label,
    optional,
    hint,
    prefix,
    min,
}: {
    // biome-ignore lint/suspicious/noExplicitAny: narrow helper over one form shape
    form: any;
    name:
        | "baseWeightKg"
        | "baseCharge"
        | "perKgCharge"
        | "expressSurcharge"
        | "sameDaySurcharge"
        | "riderPickupCharge"
        | "codFeePercent";
    label: string;
    optional?: boolean;
    hint?: string;
    prefix?: string;
    min?: number;
}) {
    return (
        <form.Field name={name}>
            {(field: NumberFieldApi) => {
                const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                    <motion.div variants={itemVariants}>
                        <FieldShell
                            label={label}
                            htmlFor={field.name}
                            optional={optional}
                            invalid={isInvalid}
                            errors={field.state.meta.errors}
                            hint={hint}
                        >
                            <div className="relative">
                                {prefix ? (
                                    <span
                                        aria-hidden
                                        className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 font-heading text-sm font-bold text-secondary/40"
                                    >
                                        {prefix}
                                    </span>
                                ) : null}
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    type="number"
                                    inputMode="decimal"
                                    min={min ?? 0}
                                    step="any"
                                    placeholder="0"
                                    value={displayNumber(field.state.value)}
                                    onChange={(e) =>
                                        field.handleChange(
                                            parseDecimal(e.target.value),
                                        )
                                    }
                                    onBlur={field.handleBlur}
                                    aria-invalid={isInvalid}
                                    className={
                                        prefix
                                            ? `${inputClass} pl-9`
                                            : inputClass
                                    }
                                />
                            </div>
                        </FieldShell>
                    </motion.div>
                );
            }}
        </form.Field>
    );
}

/**
 * Shared pricing-rule form. Without `rule` it creates; with `rule` it
 * updates (full defined payload) and notifies via `onSuccess`.
 */
export default function PricingRuleForm({
    rule,
    onSuccess,
}: {
    rule?: PricingRule;
    onSuccess?: () => void;
}) {
    const [formScope, shakeForm] = useShake<HTMLFormElement>();
    const { mutate: createRule, isPending: creating } = useCreatePricingRule();
    const { mutate: updateRule, isPending: updating } = useUpdatePricingRule(
        rule?.id ?? "",
    );
    const isPending = creating || updating;
    const isUpdate = Boolean(rule);

    const defaultValues: PricingRuleFormValues = rule
        ? {
              name: rule.name,
              zoneType: rule.zoneType,
              parcelCategory: rule.parcelCategory,
              baseWeightKg: rule.baseWeightKg,
              baseCharge: rule.baseCharge,
              perKgCharge: rule.perKgCharge,
              expressSurcharge: rule.expressSurcharge,
              sameDaySurcharge: rule.sameDaySurcharge,
              riderPickupCharge: rule.riderPickupCharge,
              codFeePercent: rule.codFeePercent,
              isActive: rule.isActive,
          }
        : {
              name: "",
              zoneType: ZONE_TYPES[0],
              parcelCategory: PARCEL_CATEGORIES[1],
              baseWeightKg: undefined,
              baseCharge: undefined,
              perKgCharge: undefined,
              expressSurcharge: undefined,
              sameDaySurcharge: undefined,
              riderPickupCharge: undefined,
              codFeePercent: undefined,
              isActive: true,
          };

    const form = useForm({
        defaultValues,
        validators: {
            onSubmit: createPricingRuleSchema,
        },
        onSubmitInvalid: () => {
            shakeForm();
        },
        onSubmit: ({ value }) => {
            const failure = (message: string) => {
                shakeForm();
                toast.error(message, {
                    description: "Something went wrong. Please try again.",
                });
            };

            // Unreachable: the schema rejects missing charges before
            // submitting, but this narrows the types honestly.
            const { baseCharge, perKgCharge } = value;
            if (baseCharge === undefined || perKgCharge === undefined) {
                shakeForm();
                return;
            }

            if (isUpdate) {
                const payload: UpdatePricingRulePayload = {
                    name: value.name.trim(),
                    zoneType: value.zoneType,
                    parcelCategory: value.parcelCategory,
                    baseWeightKg: value.baseWeightKg,
                    baseCharge,
                    perKgCharge,
                    expressSurcharge: value.expressSurcharge,
                    sameDaySurcharge: value.sameDaySurcharge,
                    riderPickupCharge: value.riderPickupCharge,
                    codFeePercent: value.codFeePercent,
                    isActive: value.isActive ?? true,
                };
                updateRule(payload, {
                    onSuccess: (res) => {
                        if (
                            res &&
                            typeof res === "object" &&
                            "success" in res &&
                            !res.success
                        ) {
                            failure("Could not update pricing rule");
                            return;
                        }
                        toast.success("Pricing rule updated", {
                            description: value.name.trim(),
                        });
                        onSuccess?.();
                    },
                    onError: (err: FetchError) => {
                        shakeForm();
                        toast.error("Could not update pricing rule", {
                            description:
                                err.data?.message ||
                                err.message ||
                                "Something went wrong. Please try again.",
                        });
                    },
                });
                return;
            }

            const payload: CreatePricingRulePayload = {
                name: value.name.trim(),
                zoneType: value.zoneType,
                parcelCategory: value.parcelCategory,
                baseWeightKg: value.baseWeightKg,
                baseCharge,
                perKgCharge,
                expressSurcharge: value.expressSurcharge,
                sameDaySurcharge: value.sameDaySurcharge,
                riderPickupCharge: value.riderPickupCharge,
                codFeePercent: value.codFeePercent,
                isActive: value.isActive ?? true,
            };
            createRule(payload, {
                onSuccess: (res) => {
                    if (
                        res &&
                        typeof res === "object" &&
                        "success" in res &&
                        !res.success
                    ) {
                        failure("Could not create pricing rule");
                        return;
                    }
                    toast.success("Pricing rule created", {
                        description: value.name.trim(),
                    });
                    form.reset();
                    onSuccess?.();
                },
                onError: (err: FetchError) => {
                    shakeForm();
                    toast.error("Could not create pricing rule", {
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
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <form
                    ref={formScope}
                    noValidate
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.handleSubmit();
                    }}
                >
                    <FieldGroup>
                        <form.Field name="name">
                            {(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched &&
                                    !field.state.meta.isValid;
                                return (
                                    <motion.div variants={itemVariants}>
                                        <FieldShell
                                            label="Rule name"
                                            htmlFor={field.name}
                                            invalid={isInvalid}
                                            errors={field.state.meta.errors}
                                            hint="e.g. Inside City · Parcel"
                                        >
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                autoComplete="off"
                                                placeholder="Give this rate a name"
                                                value={field.state.value}
                                                onChange={(e) =>
                                                    field.handleChange(
                                                        e.target.value,
                                                    )
                                                }
                                                onBlur={field.handleBlur}
                                                aria-invalid={isInvalid}
                                                className={inputClass}
                                            />
                                        </FieldShell>
                                    </motion.div>
                                );
                            }}
                        </form.Field>

                        <div className="grid gap-5 sm:grid-cols-2 sm:items-start">
                            <form.Field name="zoneType">
                                {(field) => (
                                    <motion.div variants={itemVariants}>
                                        <FieldShell
                                            label="Zone"
                                            htmlFor={field.name}
                                            invalid={
                                                field.state.meta.isTouched &&
                                                !field.state.meta.isValid
                                            }
                                            errors={field.state.meta.errors}
                                        >
                                            <SegmentedControl
                                                aria-label="Zone type"
                                                value={field.state.value}
                                                onValueChange={(next) => {
                                                    field.handleChange(next);
                                                    field.handleBlur();
                                                }}
                                                options={ZONE_TYPES.map(
                                                    (zone) => ({
                                                        value: zone,
                                                        label: ZONES[zone]
                                                            .label,
                                                    }),
                                                )}
                                            />
                                        </FieldShell>
                                    </motion.div>
                                )}
                            </form.Field>

                            <form.Field name="parcelCategory">
                                {(field) => (
                                    <motion.div variants={itemVariants}>
                                        <FieldShell
                                            label="Category"
                                            htmlFor={field.name}
                                            invalid={
                                                field.state.meta.isTouched &&
                                                !field.state.meta.isValid
                                            }
                                            errors={field.state.meta.errors}
                                        >
                                            <SegmentedControl
                                                aria-label="Parcel category"
                                                value={field.state.value}
                                                onValueChange={(next) => {
                                                    field.handleChange(next);
                                                    field.handleBlur();
                                                }}
                                                options={PARCEL_CATEGORIES.map(
                                                    (category) => ({
                                                        value: category,
                                                        label: CATEGORIES[
                                                            category
                                                        ].label,
                                                        icon: CATEGORIES[
                                                            category
                                                        ].icon,
                                                    }),
                                                )}
                                            />
                                        </FieldShell>
                                    </motion.div>
                                )}
                            </form.Field>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2 sm:items-start">
                            <NumberField
                                form={form}
                                name="baseWeightKg"
                                label="Base weight (kg)"
                                optional
                                hint="Included before per-kg billing."
                            />
                            <NumberField
                                form={form}
                                name="baseCharge"
                                label="Base charge"
                                prefix="৳"
                            />
                            <NumberField
                                form={form}
                                name="perKgCharge"
                                label="Per-kg charge"
                                prefix="৳"
                                hint="Each extra kg or part of one."
                            />
                            <NumberField
                                form={form}
                                name="expressSurcharge"
                                label="Express surcharge"
                                optional
                                prefix="৳"
                            />
                            <NumberField
                                form={form}
                                name="sameDaySurcharge"
                                label="Same-day surcharge"
                                optional
                                prefix="৳"
                            />
                            <NumberField
                                form={form}
                                name="riderPickupCharge"
                                label="Rider pickup charge"
                                optional
                                prefix="৳"
                                hint="Skipped on hub drop-offs."
                            />
                            <NumberField
                                form={form}
                                name="codFeePercent"
                                label="COD fee (%)"
                                optional
                                hint="Percent of cash collected."
                            />
                            <form.Field name="isActive">
                                {(field) => {
                                    const value = field.state.value ?? true;
                                    return (
                                        <motion.div variants={itemVariants}>
                                            <FieldShell
                                                label="Rule status"
                                                htmlFor={field.name}
                                                invalid={
                                                    field.state.meta
                                                        .isTouched &&
                                                    !field.state.meta.isValid
                                                }
                                                errors={
                                                    field.state.meta.errors
                                                }
                                            >
                                                <SegmentedControl
                                                    aria-label="Rule status"
                                                    value={
                                                        value
                                                            ? "active"
                                                            : "inactive"
                                                    }
                                                    onValueChange={(next) => {
                                                        field.handleChange(
                                                            next === "active",
                                                        );
                                                        field.handleBlur();
                                                    }}
                                                    options={[
                                                        {
                                                            value: "active",
                                                            label: "Active",
                                                        },
                                                        {
                                                            value: "inactive",
                                                            label: "Inactive",
                                                        },
                                                    ]}
                                                />
                                            </FieldShell>
                                        </motion.div>
                                    );
                                }}
                            </form.Field>
                        </div>

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
                                            {isUpdate
                                                ? "Saving…"
                                                : "Creating…"}
                                        </motion.span>
                                    ) : (
                                        <motion.span
                                            key="idle"
                                            {...labelSwapMotion}
                                            className="inline-flex items-center gap-2"
                                        >
                                            {isUpdate ? (
                                                <Save className="size-4" />
                                            ) : (
                                                <Plus className="size-4" />
                                            )}
                                            {isUpdate
                                                ? "Save changes"
                                                : "Create rule"}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </Button>
                            {!isUpdate ? (
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={isPending}
                                    onClick={() => form.reset()}
                                    className="h-11 rounded-xl border-secondary/15 font-heading text-sm font-bold text-secondary hover:bg-secondary/5 hover:text-secondary"
                                >
                                    Clear
                                </Button>
                            ) : null}
                        </motion.div>
                    </FieldGroup>
                </form>
            </motion.div>
        </MotionConfig>
    );
}
