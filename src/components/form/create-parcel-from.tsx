"use client";

import { useForm } from "@tanstack/react-form";
import {
    Check,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Loader2,
    Mail,
    MapPinned,
    Package,
    PackageCheck,
    PackagePlus,
    Phone,
    RotateCcw,
    UserRound,
    Wallet,
} from "lucide-react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import type { FetchError } from "ofetch";
import { Select as SelectPrimitive } from "radix-ui";
import { type ReactNode, useState } from "react";
import { toast } from "sonner";
import type z from "zod";
import {
    CATEGORIES,
    CATEGORY_ORDER,
    PAYMENT_METHODS,
    PICKUP_METHODS,
    SPEED_ORDER,
    SPEEDS,
} from "@/components/modules/pricing/pricing-meta";
import SegmentedControl from "@/components/modules/pricing/SegmentedControl";
import {
    useCreateParcel,
    useGetAllCities,
    useGetAllDistricts,
    useGetAllDivisions,
} from "@/hooks";
import type { CreateParcelPayload } from "@/types";
import {
    CreateParcelZodValidationSchema,
    DeliveryType,
    ParcelCategory,
    PaymentType,
    PickupMode,
} from "@/validation";
import { Button } from "../ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
    containerVariants,
    errorMotion,
    itemVariants,
    labelSwapMotion,
    useShake,
} from "./form-motion";

type ParcelFormValues = Omit<
    z.input<typeof CreateParcelZodValidationSchema>,
    "weightKg"
> & {
    weightKg: number | undefined;
};

const COD_PRESETS = [500, 1000, 2500, 5000];

const inputClass =
    "h-11 rounded-xl border-secondary/15 bg-background text-secondary shadow-none placeholder:text-secondary/40 focus-visible:border-brand-orange focus-visible:ring-3 focus-visible:ring-brand-orange/30 aria-invalid:border-destructive/60 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

const textAreaClass =
    "min-h-20 rounded-xl border-secondary/15 bg-background text-secondary shadow-none placeholder:text-secondary/40 focus-visible:border-brand-orange focus-visible:ring-3 focus-visible:ring-brand-orange/30 aria-invalid:border-destructive/60";

const LOCATION_PARAMS = { page: 1, limit: 100 };

type LocationOption = {
    id: string;
    name: string;
};

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

function parseIntAmount(raw: string): number | undefined {
    const cleaned = raw.replace(/\D/g, "").slice(0, 5);
    if (cleaned === "") return undefined;
    const value = Number(cleaned);
    return Number.isFinite(value) ? value : undefined;
}

const displayNumber = (value: number | undefined) =>
    value === undefined || Number.isNaN(value) ? "" : String(value);

function Section({
    icon: Icon,
    step,
    title,
    desc,
    children,
}: {
    icon: typeof Package;
    step: string;
    title: string;
    desc: string;
    children: ReactNode;
}) {
    return (
        <motion.section
            variants={itemVariants}
            aria-label={title}
            className="rounded-2xl bg-card p-5 ring-1 ring-secondary/10 sm:p-6"
        >
            <div className="flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand text-white shadow-[0_10px_20px_-12px_rgba(15,32,86,0.7)]">
                    <Icon className="size-5" strokeWidth={2.25} />
                </span>
                <div className="min-w-0">
                    <p className="font-heading text-[11px] font-bold tracking-[0.16em] text-brand-orange-ink uppercase">
                        {step}
                    </p>
                    <h2 className="font-heading text-base font-extrabold tracking-tight text-secondary">
                        {title}
                    </h2>
                </div>
            </div>
            <p className="mt-2 text-[13px] text-secondary/60">{desc}</p>
            <div className="mt-4 grid gap-5">{children}</div>
        </motion.section>
    );
}

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

function LocationSelect({
    name,
    label,
    value,
    options,
    placeholder,
    disabled,
    isLoading,
    isError,
    invalid = false,
    errors = [],
    onChange,
    onBlur,
    onRetry,
}: {
    name: string;
    label: string;
    value: string;
    options: LocationOption[];
    placeholder: string;
    disabled?: boolean;
    isLoading?: boolean;
    isError?: boolean;
    invalid?: boolean;
    errors?: React.ComponentProps<typeof FieldError>["errors"];
    onChange: (value: string) => void;
    onBlur?: () => void;
    onRetry?: () => void;
}) {
    return (
        <FieldShell
            label={label}
            htmlFor={name}
            invalid={invalid}
            errors={errors}
        >
            <SelectPrimitive.Root
                value={value}
                onValueChange={onChange}
                disabled={disabled || isLoading || isError}
            >
                <SelectPrimitive.Trigger
                    id={name}
                    name={name}
                    onBlur={onBlur}
                    aria-invalid={invalid || isError}
                    aria-busy={isLoading}
                    className="group flex h-11 w-full items-center justify-between gap-3 rounded-xl border border-secondary/15 bg-background px-3.5 text-left text-sm text-secondary shadow-sm outline-none transition-[border-color,box-shadow,background-color] hover:border-secondary/25 hover:bg-accent/35 focus-visible:border-brand-orange focus-visible:ring-3 focus-visible:ring-brand-orange/25 aria-invalid:border-destructive/60 aria-invalid:focus-visible:ring-destructive/20 disabled:cursor-not-allowed disabled:opacity-55"
                >
                    <SelectPrimitive.Value placeholder={placeholder} />
                    <SelectPrimitive.Icon asChild>
                        <ChevronDown
                            aria-hidden
                            className="size-4 shrink-0 text-secondary/45 transition-transform duration-200 group-data-[state=open]:rotate-180 group-hover:text-brand-orange-ink"
                        />
                    </SelectPrimitive.Icon>
                </SelectPrimitive.Trigger>
                <SelectPrimitive.Portal>
                    <SelectPrimitive.Content
                        position="popper"
                        sideOffset={6}
                        collisionPadding={12}
                        className="z-50 max-h-[min(20rem,var(--radix-select-content-available-height))] min-w-(--radix-select-trigger-width) overflow-hidden rounded-xl border border-secondary/10 bg-popover text-popover-foreground shadow-xl ring-1 ring-secondary/8 data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
                    >
                        <SelectPrimitive.ScrollUpButton className="flex h-8 cursor-default items-center justify-center bg-popover text-secondary/50">
                            <ChevronUp aria-hidden className="size-4" />
                        </SelectPrimitive.ScrollUpButton>
                        <SelectPrimitive.Viewport className="max-h-[min(20rem,var(--radix-select-content-available-height))] overflow-y-auto p-1.5">
                            {options.map((option) => (
                                <SelectPrimitive.Item
                                    key={option.id}
                                    value={option.id}
                                    textValue={option.name}
                                    className="relative flex min-h-10 cursor-default items-center rounded-lg py-2 pr-9 pl-3 font-heading text-[13px] font-semibold text-secondary outline-none transition-colors data-highlighted:bg-brand/8 data-highlighted:text-secondary data-[state=checked]:bg-brand-orange/10 data-[state=checked]:text-brand-orange-ink"
                                >
                                    <SelectPrimitive.ItemText>
                                        {option.name}
                                    </SelectPrimitive.ItemText>
                                    <span className="absolute right-3 flex size-4 items-center justify-center text-brand-orange-ink">
                                        <SelectPrimitive.ItemIndicator>
                                            <Check
                                                aria-hidden
                                                className="size-4"
                                                strokeWidth={2.5}
                                            />
                                        </SelectPrimitive.ItemIndicator>
                                    </span>
                                </SelectPrimitive.Item>
                            ))}
                        </SelectPrimitive.Viewport>
                        <SelectPrimitive.ScrollDownButton className="flex h-8 cursor-default items-center justify-center bg-popover text-secondary/50">
                            <ChevronDown aria-hidden className="size-4" />
                        </SelectPrimitive.ScrollDownButton>
                    </SelectPrimitive.Content>
                </SelectPrimitive.Portal>
            </SelectPrimitive.Root>
            {isLoading ? (
                <output className="text-xs text-secondary/55">
                    Loading {label.toLowerCase()}...
                </output>
            ) : null}
            {isError ? (
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <p role="alert" className="text-xs text-destructive">
                        Could not load {label.toLowerCase()}.
                    </p>
                    {onRetry ? (
                        <Button
                            type="button"
                            variant="link"
                            size="sm"
                            onClick={onRetry}
                            className="h-auto p-0 text-xs text-brand-orange"
                        >
                            Try again
                        </Button>
                    ) : null}
                </div>
            ) : null}
        </FieldShell>
    );
}

const defaultValues: ParcelFormValues = {
    pickupContactName: "",
    pickupContactPhone: "",
    pickupAddressLine: "",
    pickupCityId: "",
    pickupMode: PickupMode.RIDER_PICKUP,
    note: "",
    recipientName: "",
    recipientPhone: "",
    recipientEmail: "",
    deliveryAddressLine: "",
    deliveryCityId: "",
    parcelCategory: ParcelCategory.PARCEL,
    weightKg: 1,
    itemDescription: "",
    itemQuantity: 1,
    declaredValue: undefined,
    deliveryType: DeliveryType.REGULAR,
    paymentType: PaymentType.PREPAID,
    codAmount: undefined,
};

function extractTrackingRef(res: unknown): string | null {
    if (!res || typeof res !== "object") return null;
    const data = (res as { data?: unknown }).data;
    if (!data || typeof data !== "object") return null;
    const record = data as Record<string, unknown>;
    for (const key of ["trackingId", "trackingNumber", "trackingCode", "id"]) {
        const value = record[key];
        if (typeof value === "string" && value.length > 0) return value;
    }
    return null;
}

export default function CreateParcelForm() {
    const [formScope, shakeForm] = useShake<HTMLFormElement>();
    const [bookingRef, setBookingRef] = useState<string | null>(null);
    const [pickupDivisionId, setPickupDivisionId] = useState("");
    const [pickupDistrictId, setPickupDistrictId] = useState("");
    const [deliveryDivisionId, setDeliveryDivisionId] = useState("");
    const [deliveryDistrictId, setDeliveryDistrictId] = useState("");
    const { mutate: create, isPending } = useCreateParcel();
    const divisionsQuery = useGetAllDivisions();
    const pickupDistrictsQuery = useGetAllDistricts(
        pickupDivisionId,
        LOCATION_PARAMS,
    );
    const pickupCitiesQuery = useGetAllCities(
        pickupDistrictId,
        LOCATION_PARAMS,
    );
    const deliveryDistrictsQuery = useGetAllDistricts(
        deliveryDivisionId,
        LOCATION_PARAMS,
    );
    const deliveryCitiesQuery = useGetAllCities(
        deliveryDistrictId,
        LOCATION_PARAMS,
    );
    const divisions = divisionsQuery.data?.data ?? [];
    const pickupDistricts = pickupDistrictsQuery.data?.data ?? [];
    const pickupCities = pickupCitiesQuery.data?.data ?? [];
    const deliveryDistricts = deliveryDistrictsQuery.data?.data ?? [];
    const deliveryCities = deliveryCitiesQuery.data?.data ?? [];

    const form = useForm({
        defaultValues,
        validators: {
            onSubmit: CreateParcelZodValidationSchema,
        },
        onSubmitInvalid: () => {
            setBookingRef(null);
            shakeForm();
        },
        onSubmit: ({ value }) => {
            setBookingRef(null);
            // Unreachable: the schema rejects a missing weight before
            // submitting, but this narrows the type honestly.
            if (value.weightKg === undefined) {
                shakeForm();
                return;
            }
            const payload: CreateParcelPayload = {
                pickupContactName: value.pickupContactName.trim(),
                pickupContactPhone: value.pickupContactPhone.trim(),
                pickupAddressLine: value.pickupAddressLine.trim(),
                pickupCityId: value.pickupCityId,
                pickupMode: value.pickupMode ?? PickupMode.RIDER_PICKUP,
                note: value.note?.trim() || undefined,
                recipientName: value.recipientName.trim(),
                recipientPhone: value.recipientPhone.trim(),
                recipientEmail: value.recipientEmail.trim(),
                deliveryAddressLine: value.deliveryAddressLine.trim(),
                deliveryCityId: value.deliveryCityId,
                parcelCategory: value.parcelCategory,
                weightKg: value.weightKg,
                itemDescription: value.itemDescription.trim(),
                itemQuantity: value.itemQuantity ?? 1,
                declaredValue: value.declaredValue,
                deliveryType: value.deliveryType ?? DeliveryType.REGULAR,
                paymentType: value.paymentType,
                codAmount:
                    value.paymentType === PaymentType.COD
                        ? value.codAmount
                        : undefined,
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
                        toast.error("Could not book parcel", {
                            description:
                                "Something went wrong. Please try again.",
                        });
                        return;
                    }
                    toast.success("Parcel booked", {
                        description: "A rider will be assigned for pickup.",
                    });
                    setBookingRef(extractTrackingRef(res));
                    form.reset();
                    setPickupDivisionId("");
                    setPickupDistrictId("");
                    setDeliveryDivisionId("");
                    setDeliveryDistrictId("");
                },
                onError: (err: FetchError) => {
                    shakeForm();
                    toast.error("Could not book parcel", {
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
                {/* Success banner */}
                <AnimatePresence initial={false}>
                    {bookingRef !== null && (
                        <motion.div
                            key="booking-success"
                            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                            animate={{
                                opacity: 1,
                                height: "auto",
                                marginBottom: 20,
                            }}
                            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                            transition={{ duration: 0.28, ease: "easeOut" }}
                            className="overflow-hidden"
                        >
                            <output className="flex flex-col gap-3 rounded-2xl bg-emerald-600/10 px-4 py-4 ring-1 ring-emerald-600/20 ring-inset sm:flex-row sm:items-center">
                                <span className="flex min-w-0 flex-1 items-start gap-2.5 text-sm font-medium text-emerald-800">
                                    <CheckCircle2
                                        className="mt-0.5 size-4.5 shrink-0 text-emerald-600"
                                        strokeWidth={2.25}
                                    />
                                    <span className="min-w-0">
                                        Parcel booked successfully.
                                        {bookingRef ? (
                                            <span className="block truncate font-mono text-[13px]">
                                                Ref: {bookingRef}
                                            </span>
                                        ) : null}
                                    </span>
                                </span>
                                <Button
                                    type="button"
                                    onClick={() => setBookingRef(null)}
                                    className="h-9 shrink-0 rounded-xl bg-emerald-700 px-4 font-heading text-xs font-bold text-white transition hover:brightness-125 active:scale-[0.99]"
                                >
                                    <PackagePlus className="size-4" />
                                    Book another
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
                    <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
                        <FieldGroup className="min-w-0">
                            {/* ── 1 · Pickup ─────────────────────────── */}
                            <Section
                                icon={MapPinned}
                                step="Step 1 of 4"
                                title="Pickup details"
                                desc="Where should the rider collect the parcel?"
                            >
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <form.Field name="pickupContactName">
                                        {(field) => {
                                            const isInvalid =
                                                field.state.meta.isTouched &&
                                                !field.state.meta.isValid;
                                            return (
                                                <FieldShell
                                                    label="Contact name"
                                                    htmlFor={field.name}
                                                    invalid={isInvalid}
                                                    errors={
                                                        field.state.meta.errors
                                                    }
                                                >
                                                    <Input
                                                        id={field.name}
                                                        name={field.name}
                                                        autoComplete="name"
                                                        placeholder="Who hands over the parcel?"
                                                        value={field.state.value}
                                                        onChange={(e) =>
                                                            field.handleChange(
                                                                e.target.value,
                                                            )
                                                        }
                                                        onBlur={
                                                            field.handleBlur
                                                        }
                                                        aria-invalid={isInvalid}
                                                        className={inputClass}
                                                    />
                                                </FieldShell>
                                            );
                                        }}
                                    </form.Field>

                                    <form.Field name="pickupContactPhone">
                                        {(field) => {
                                            const isInvalid =
                                                field.state.meta.isTouched &&
                                                !field.state.meta.isValid;
                                            return (
                                                <FieldShell
                                                    label="Contact phone"
                                                    htmlFor={field.name}
                                                    invalid={isInvalid}
                                                    errors={
                                                        field.state.meta.errors
                                                    }
                                                >
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
                                                </FieldShell>
                                            );
                                        }}
                                    </form.Field>
                                </div>

                                <form.Field name="pickupAddressLine">
                                    {(field) => {
                                        const isInvalid =
                                            field.state.meta.isTouched &&
                                            !field.state.meta.isValid;
                                        return (
                                            <FieldShell
                                                label="Pickup address"
                                                htmlFor={field.name}
                                                invalid={isInvalid}
                                                errors={
                                                    field.state.meta.errors
                                                }
                                            >
                                                <Input
                                                    id={field.name}
                                                    name={field.name}
                                                    autoComplete="street-address"
                                                    placeholder="House, road, area"
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
                                        );
                                    }}
                                </form.Field>

                                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                    <LocationSelect
                                        name="pickupDivisionId"
                                        label="Division"
                                        value={pickupDivisionId}
                                        options={divisions}
                                        placeholder="Select a division"
                                        isLoading={divisionsQuery.isLoading}
                                        isError={divisionsQuery.isError}
                                        onRetry={() => divisionsQuery.refetch()}
                                        onChange={(divisionId) => {
                                            setPickupDivisionId(divisionId);
                                            setPickupDistrictId("");
                                            form.setFieldValue("pickupCityId", "");
                                        }}
                                    />

                                    <LocationSelect
                                        name="pickupDistrictId"
                                        label="District"
                                        value={pickupDistrictId}
                                        options={pickupDistricts}
                                        placeholder={
                                            pickupDivisionId
                                                ? "Select a district"
                                                : "Select a division first"
                                        }
                                        disabled={!pickupDivisionId}
                                        isLoading={pickupDistrictsQuery.isLoading}
                                        isError={pickupDistrictsQuery.isError}
                                        onRetry={() =>
                                            pickupDistrictsQuery.refetch()
                                        }
                                        onChange={(districtId) => {
                                            setPickupDistrictId(districtId);
                                            form.setFieldValue("pickupCityId", "");
                                        }}
                                    />

                                    <form.Field name="pickupCityId">
                                        {(field) => (
                                            <LocationSelect
                                                name={field.name}
                                                label="City"
                                                value={field.state.value}
                                                options={pickupCities}
                                                placeholder={
                                                    pickupDistrictId
                                                        ? "Select a city"
                                                        : "Select a district first"
                                                }
                                                disabled={!pickupDistrictId}
                                                isLoading={pickupCitiesQuery.isLoading}
                                                isError={pickupCitiesQuery.isError}
                                                invalid={
                                                    field.state.meta.isTouched &&
                                                    !field.state.meta.isValid
                                                }
                                                errors={field.state.meta.errors}
                                                onRetry={() =>
                                                    pickupCitiesQuery.refetch()
                                                }
                                                onChange={field.handleChange}
                                                onBlur={field.handleBlur}
                                            />
                                        )}
                                    </form.Field>
                                </div>

                                <form.Field name="pickupMode">
                                    {(field) => {
                                        const isInvalid =
                                            field.state.meta.isTouched &&
                                            !field.state.meta.isValid;
                                        const value =
                                            field.state.value ??
                                            PickupMode.RIDER_PICKUP;
                                        return (
                                            <FieldShell
                                                label="How does the parcel reach us?"
                                                htmlFor={field.name}
                                                invalid={isInvalid}
                                                errors={
                                                    field.state.meta.errors
                                                }
                                            >
                                                <SegmentedControl
                                                    aria-label="Pickup mode"
                                                    value={value}
                                                    onValueChange={(next) => {
                                                        field.handleChange(
                                                            next,
                                                        );
                                                        field.handleBlur();
                                                    }}
                                                    options={[
                                                        {
                                                            value:
                                                                PickupMode.RIDER_PICKUP,
                                                            label: "Rider pickup",
                                                            icon: PICKUP_METHODS
                                                                .RIDER_PICKUP
                                                                .icon,
                                                            hint: "We come to you",
                                                        },
                                                        {
                                                            value:
                                                                PickupMode.MERCHANT_DROP,
                                                            label: "Drop at hub",
                                                            icon: PICKUP_METHODS
                                                                .HUB_DROP_OFF
                                                                .icon,
                                                            hint: "Free",
                                                        },
                                                    ]}
                                                />
                                            </FieldShell>
                                        );
                                    }}
                                </form.Field>

                                <form.Field name="note">
                                    {(field) => {
                                        const isInvalid =
                                            field.state.meta.isTouched &&
                                            !field.state.meta.isValid;
                                        return (
                                            <FieldShell
                                                label="Pickup note"
                                                htmlFor={field.name}
                                                optional
                                                invalid={isInvalid}
                                                errors={
                                                    field.state.meta.errors
                                                }
                                                hint="Gate code, floor, or anything the rider should know."
                                            >
                                                <Textarea
                                                    id={field.name}
                                                    name={field.name}
                                                    placeholder="Optional instructions for pickup"
                                                    value={
                                                        field.state.value ?? ""
                                                    }
                                                    onChange={(e) =>
                                                        field.handleChange(
                                                            e.target.value,
                                                        )
                                                    }
                                                    onBlur={field.handleBlur}
                                                    aria-invalid={isInvalid}
                                                    className={textAreaClass}
                                                />
                                            </FieldShell>
                                        );
                                    }}
                                </form.Field>
                            </Section>

                            {/* ── 2 · Recipient ──────────────────────── */}
                            <Section
                                icon={UserRound}
                                step="Step 2 of 4"
                                title="Recipient & delivery"
                                desc="Who receives it, and where is it going?"
                            >
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <form.Field name="recipientName">
                                        {(field) => {
                                            const isInvalid =
                                                field.state.meta.isTouched &&
                                                !field.state.meta.isValid;
                                            return (
                                                <FieldShell
                                                    label="Recipient name"
                                                    htmlFor={field.name}
                                                    invalid={isInvalid}
                                                    errors={
                                                        field.state.meta.errors
                                                    }
                                                >
                                                    <Input
                                                        id={field.name}
                                                        name={field.name}
                                                        autoComplete="off"
                                                        placeholder="Customer's name"
                                                        value={field.state.value}
                                                        onChange={(e) =>
                                                            field.handleChange(
                                                                e.target.value,
                                                            )
                                                        }
                                                        onBlur={
                                                            field.handleBlur
                                                        }
                                                        aria-invalid={isInvalid}
                                                        className={inputClass}
                                                    />
                                                </FieldShell>
                                            );
                                        }}
                                    </form.Field>

                                    <form.Field name="recipientPhone">
                                        {(field) => {
                                            const isInvalid =
                                                field.state.meta.isTouched &&
                                                !field.state.meta.isValid;
                                            return (
                                                <FieldShell
                                                    label="Recipient phone"
                                                    htmlFor={field.name}
                                                    invalid={isInvalid}
                                                    errors={
                                                        field.state.meta.errors
                                                    }
                                                >
                                                    <div className="relative">
                                                        <Phone
                                                            aria-hidden
                                                            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-secondary/35"
                                                        />
                                                        <Input
                                                            id={field.name}
                                                            name={field.name}
                                                            type="tel"
                                                            autoComplete="off"
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
                                                </FieldShell>
                                            );
                                        }}
                                    </form.Field>
                                </div>

                                <form.Field name="recipientEmail">
                                    {(field) => {
                                        const isInvalid =
                                            field.state.meta.isTouched &&
                                            !field.state.meta.isValid;
                                        return (
                                            <FieldShell
                                                label="Recipient email"
                                                htmlFor={field.name}
                                                invalid={isInvalid}
                                                errors={
                                                    field.state.meta.errors
                                                }
                                                hint="Tracking updates go to this address."
                                            >
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
                                                        placeholder="customer@mail.com"
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
                                                        className={`${inputClass} pl-10`}
                                                    />
                                                </div>
                                            </FieldShell>
                                        );
                                    }}
                                </form.Field>

                                <form.Field name="deliveryAddressLine">
                                    {(field) => {
                                        const isInvalid =
                                            field.state.meta.isTouched &&
                                            !field.state.meta.isValid;
                                        return (
                                            <FieldShell
                                                label="Delivery address"
                                                htmlFor={field.name}
                                                invalid={isInvalid}
                                                errors={
                                                    field.state.meta.errors
                                                }
                                            >
                                                <Input
                                                    id={field.name}
                                                    name={field.name}
                                                    autoComplete="off"
                                                    placeholder="House, road, area"
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
                                        );
                                    }}
                                </form.Field>

                                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                    <LocationSelect
                                        name="deliveryDivisionId"
                                        label="Division"
                                        value={deliveryDivisionId}
                                        options={divisions}
                                        placeholder="Select a division"
                                        isLoading={divisionsQuery.isLoading}
                                        isError={divisionsQuery.isError}
                                        onRetry={() => divisionsQuery.refetch()}
                                        onChange={(divisionId) => {
                                            setDeliveryDivisionId(divisionId);
                                            setDeliveryDistrictId("");
                                            form.setFieldValue("deliveryCityId", "");
                                        }}
                                    />

                                    <LocationSelect
                                        name="deliveryDistrictId"
                                        label="District"
                                        value={deliveryDistrictId}
                                        options={deliveryDistricts}
                                        placeholder={
                                            deliveryDivisionId
                                                ? "Select a district"
                                                : "Select a division first"
                                        }
                                        disabled={!deliveryDivisionId}
                                        isLoading={deliveryDistrictsQuery.isLoading}
                                        isError={deliveryDistrictsQuery.isError}
                                        onRetry={() =>
                                            deliveryDistrictsQuery.refetch()
                                        }
                                        onChange={(districtId) => {
                                            setDeliveryDistrictId(districtId);
                                            form.setFieldValue("deliveryCityId", "");
                                        }}
                                    />

                                    <form.Field name="deliveryCityId">
                                        {(field) => (
                                            <LocationSelect
                                                name={field.name}
                                                label="City"
                                                value={field.state.value}
                                                options={deliveryCities}
                                                placeholder={
                                                    deliveryDistrictId
                                                        ? "Select a city"
                                                        : "Select a district first"
                                                }
                                                disabled={!deliveryDistrictId}
                                                isLoading={deliveryCitiesQuery.isLoading}
                                                isError={deliveryCitiesQuery.isError}
                                                invalid={
                                                    field.state.meta.isTouched &&
                                                    !field.state.meta.isValid
                                                }
                                                errors={field.state.meta.errors}
                                                onRetry={() =>
                                                    deliveryCitiesQuery.refetch()
                                                }
                                                onChange={field.handleChange}
                                                onBlur={field.handleBlur}
                                            />
                                        )}
                                    </form.Field>
                                </div>
                            </Section>

                            {/* ── 3 · Parcel ─────────────────────────── */}
                            <Section
                                icon={Package}
                                step="Step 3 of 4"
                                title="Parcel details"
                                desc="What are you sending, and how fast should it travel?"
                            >
                                <form.Field name="parcelCategory">
                                    {(field) => (
                                        <FieldShell
                                            label="Parcel category"
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
                                                    if (
                                                        next ===
                                                        ParcelCategory.DOCUMENT
                                                    ) {
                                                        field.form.setFieldValue(
                                                            "paymentType",
                                                            PaymentType.PREPAID,
                                                        );
                                                        field.form.setFieldValue(
                                                            "codAmount",
                                                            undefined,
                                                        );
                                                    }
                                                }}
                                                options={CATEGORY_ORDER.map(
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
                                    )}
                                </form.Field>

                                <div className="grid gap-5 sm:grid-cols-2">
                                    <form.Field name="weightKg">
                                        {(field) => {
                                            const isInvalid =
                                                field.state.meta.isTouched &&
                                                !field.state.meta.isValid;
                                            return (
                                                <FieldShell
                                                    label="Weight (kg)"
                                                    htmlFor={field.name}
                                                    invalid={isInvalid}
                                                    errors={
                                                        field.state.meta.errors
                                                    }
                                                >
                                                    <div className="relative">
                                                        <Input
                                                            id={field.name}
                                                            name={field.name}
                                                            type="number"
                                                            inputMode="decimal"
                                                            min={0}
                                                            step="any"
                                                            placeholder="1"
                                                            value={displayNumber(
                                                                field.state
                                                                    .value,
                                                            )}
                                                            onChange={(e) =>
                                                                field.handleChange(
                                                                    parseDecimal(
                                                                        e.target
                                                                            .value,
                                                                    ),
                                                                )
                                                            }
                                                            onBlur={
                                                                field.handleBlur
                                                            }
                                                            aria-invalid={
                                                                isInvalid
                                                            }
                                                            className={`${inputClass} pr-12`}
                                                        />
                                                        <span
                                                            aria-hidden
                                                            className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-xs font-semibold text-secondary/40"
                                                        >
                                                            kg
                                                        </span>
                                                    </div>
                                                </FieldShell>
                                            );
                                        }}
                                    </form.Field>

                                    <form.Field name="itemQuantity">
                                        {(field) => {
                                            const isInvalid =
                                                field.state.meta.isTouched &&
                                                !field.state.meta.isValid;
                                            return (
                                                <FieldShell
                                                    label="Item quantity"
                                                    htmlFor={field.name}
                                                    invalid={isInvalid}
                                                    errors={
                                                        field.state.meta.errors
                                                    }
                                                >
                                                    <Input
                                                        id={field.name}
                                                        name={field.name}
                                                        type="number"
                                                        inputMode="numeric"
                                                        min={1}
                                                        step={1}
                                                        placeholder="1"
                                                        value={displayNumber(
                                                            field.state.value ??
                                                                1,
                                                        )}
                                                        onChange={(e) =>
                                                            field.handleChange(
                                                                parseIntAmount(
                                                                    e.target
                                                                        .value,
                                                                ),
                                                            )
                                                        }
                                                        onBlur={
                                                            field.handleBlur
                                                        }
                                                        aria-invalid={isInvalid}
                                                        className={inputClass}
                                                    />
                                                </FieldShell>
                                            );
                                        }}
                                    </form.Field>
                                </div>

                                <form.Field name="itemDescription">
                                    {(field) => {
                                        const isInvalid =
                                            field.state.meta.isTouched &&
                                            !field.state.meta.isValid;
                                        return (
                                            <FieldShell
                                                label="Item description"
                                                htmlFor={field.name}
                                                invalid={isInvalid}
                                                errors={
                                                    field.state.meta.errors
                                                }
                                            >
                                                <Textarea
                                                    id={field.name}
                                                    name={field.name}
                                                    placeholder="What is inside the parcel?"
                                                    value={field.state.value}
                                                    onChange={(e) =>
                                                        field.handleChange(
                                                            e.target.value,
                                                        )
                                                    }
                                                    onBlur={field.handleBlur}
                                                    aria-invalid={isInvalid}
                                                    className={textAreaClass}
                                                />
                                            </FieldShell>
                                        );
                                    }}
                                </form.Field>

                                <form.Field name="declaredValue">
                                    {(field) => {
                                        const isInvalid =
                                            field.state.meta.isTouched &&
                                            !field.state.meta.isValid;
                                        return (
                                            <FieldShell
                                                label="Declared value"
                                                htmlFor={field.name}
                                                optional
                                                invalid={isInvalid}
                                                errors={
                                                    field.state.meta.errors
                                                }
                                                hint="Item worth, for reference."
                                            >
                                                <div className="relative">
                                                    <span
                                                        aria-hidden
                                                        className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 font-heading text-sm font-bold text-secondary/40"
                                                    >
                                                        ৳
                                                    </span>
                                                    <Input
                                                        id={field.name}
                                                        name={field.name}
                                                        type="number"
                                                        inputMode="decimal"
                                                        min={0}
                                                        step="any"
                                                        placeholder="0"
                                                        value={displayNumber(
                                                            field.state.value,
                                                        )}
                                                        onChange={(e) =>
                                                            field.handleChange(
                                                                e.target.value ===
                                                                    ""
                                                                    ? undefined
                                                                    : parseDecimal(
                                                                          e
                                                                              .target
                                                                              .value,
                                                                      ),
                                                            )
                                                        }
                                                        onBlur={
                                                            field.handleBlur
                                                        }
                                                        aria-invalid={isInvalid}
                                                        className={`${inputClass} pl-9`}
                                                    />
                                                </div>
                                            </FieldShell>
                                        );
                                    }}
                                </form.Field>

                                <form.Field name="deliveryType">
                                    {(field) => {
                                        const value =
                                            field.state.value ??
                                            DeliveryType.REGULAR;
                                        return (
                                            <FieldShell
                                                label="Delivery speed"
                                                htmlFor={field.name}
                                                invalid={
                                                    field.state.meta
                                                        .isTouched &&
                                                    !field.state.meta.isValid
                                                }
                                                errors={field.state.meta.errors}
                                            >
                                                <SegmentedControl
                                                    aria-label="Delivery speed"
                                                    value={value}
                                                    onValueChange={(next) => {
                                                        field.handleChange(
                                                            next,
                                                        );
                                                        field.handleBlur();
                                                    }}
                                                    options={SPEED_ORDER.map(
                                                        (speed) => ({
                                                            value: speed,
                                                            label: SPEEDS[speed]
                                                                .label,
                                                            icon: SPEEDS[speed]
                                                                .icon,
                                                            hint: SPEEDS[speed]
                                                                .eta,
                                                        }),
                                                    )}
                                                />
                                            </FieldShell>
                                        );
                                    }}
                                </form.Field>
                            </Section>

                            {/* ── 4 · Payment ────────────────────────── */}
                            <Section
                                icon={Wallet}
                                step="Step 4 of 4"
                                title="Payment"
                                desc="Prepay now, or collect cash from your customer."
                            >
                                <form.Subscribe
                                    selector={(state) =>
                                        state.values.parcelCategory
                                    }
                                >
                                    {(category) => (
                                        <form.Field name="paymentType">
                                            {(field) => {
                                                const isInvalid =
                                                    field.state.meta
                                                        .isTouched &&
                                                    !field.state.meta.isValid;
                                                const documentOnly =
                                                    category ===
                                                    ParcelCategory.DOCUMENT;
                                                return (
                                                    <FieldShell
                                                        label="Payment type"
                                                        htmlFor={field.name}
                                                        invalid={isInvalid}
                                                        errors={
                                                            field.state.meta
                                                                .errors
                                                        }
                                                        hint={
                                                            documentOnly
                                                                ? "Documents are prepaid only."
                                                                : undefined
                                                        }
                                                    >
                                                        <SegmentedControl
                                                            aria-label="Payment type"
                                                            value={
                                                                field.state.value
                                                            }
                                                            onValueChange={(
                                                                next,
                                                            ) => {
                                                                field.handleChange(
                                                                    next,
                                                                );
                                                                field.handleBlur();
                                                                if (
                                                                    next ===
                                                                    PaymentType.PREPAID
                                                                ) {
                                                                    field.form.setFieldValue(
                                                                        "codAmount",
                                                                        undefined,
                                                                    );
                                                                }
                                                            }}
                                                            options={(
                                                                documentOnly
                                                                    ? [
                                                                          PaymentType.PREPAID,
                                                                      ]
                                                                    : [
                                                                          PaymentType.PREPAID,
                                                                          PaymentType.COD,
                                                                      ]
                                                            ).map((payment) => ({
                                                                value: payment,
                                                                label: PAYMENT_METHODS[
                                                                    payment
                                                                ].label,
                                                                icon: PAYMENT_METHODS[
                                                                    payment
                                                                ].icon,
                                                                hint:
                                                                    payment ===
                                                                    PaymentType.COD
                                                                        ? "Rider collects"
                                                                        : "bKash",
                                                            }))}
                                                        />
                                                    </FieldShell>
                                                );
                                            }}
                                        </form.Field>
                                    )}
                                </form.Subscribe>

                                <form.Subscribe
                                    selector={(state) =>
                                        state.values.paymentType
                                    }
                                >
                                    {(paymentType) => (
                                        <AnimatePresence initial={false}>
                                            {paymentType ===
                                            PaymentType.COD ? (
                                                <motion.div
                                                    key="cod-amount"
                                                    initial={{
                                                        opacity: 0,
                                                        height: 0,
                                                        marginTop: -20,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        height: "auto",
                                                        marginTop: 0,
                                                    }}
                                                    exit={{
                                                        opacity: 0,
                                                        height: 0,
                                                        marginTop: -20,
                                                    }}
                                                    transition={{
                                                        duration: 0.25,
                                                        ease: "easeOut",
                                                    }}
                                                    className="overflow-hidden"
                                                >
                                                    <form.Field name="codAmount">
                                                        {(field) => {
                                                            const isInvalid =
                                                                field.state.meta
                                                                    .isTouched &&
                                                                !field.state.meta
                                                                    .isValid;
                                                            return (
                                                                <FieldShell
                                                                    label="Cash to collect"
                                                                    htmlFor={
                                                                        field.name
                                                                    }
                                                                    invalid={
                                                                        isInvalid
                                                                    }
                                                                    errors={
                                                                        field
                                                                            .state
                                                                            .meta
                                                                            .errors
                                                                    }
                                                                    hint="The rider collects this from your customer."
                                                                >
                                                                    <div className="relative">
                                                                        <span
                                                                            aria-hidden
                                                                            className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 font-heading text-sm font-bold text-secondary/40"
                                                                        >
                                                                            ৳
                                                                        </span>
                                                                        <Input
                                                                            id={
                                                                                field.name
                                                                            }
                                                                            name={
                                                                                field.name
                                                                            }
                                                                            type="number"
                                                                            inputMode="decimal"
                                                                            min={
                                                                                0
                                                                            }
                                                                            step="any"
                                                                            placeholder="0"
                                                                            value={displayNumber(
                                                                                field
                                                                                    .state
                                                                                    .value,
                                                                            )}
                                                                            onChange={(
                                                                                e,
                                                                            ) =>
                                                                                field.handleChange(
                                                                                    e
                                                                                        .target
                                                                                        .value ===
                                                                                        ""
                                                                                        ? undefined
                                                                                        : parseDecimal(
                                                                                              e
                                                                                                  .target
                                                                                                  .value,
                                                                                          ),
                                                                                )
                                                                            }
                                                                            onBlur={
                                                                                field.handleBlur
                                                                            }
                                                                            aria-invalid={
                                                                                isInvalid
                                                                            }
                                                                            className={`${inputClass} pl-9`}
                                                                        />
                                                                    </div>
                                                                    <div className="mt-2.5 flex flex-wrap gap-2">
                                                                        {COD_PRESETS.map(
                                                                            (
                                                                                amount,
                                                                            ) => {
                                                                                const active =
                                                                                    field
                                                                                        .state
                                                                                        .value ===
                                                                                    amount;
                                                                                return (
                                                                                    <button
                                                                                        key={
                                                                                            amount
                                                                                        }
                                                                                        type="button"
                                                                                        aria-pressed={
                                                                                            active
                                                                                        }
                                                                                        onClick={() => {
                                                                                            field.handleChange(
                                                                                                amount,
                                                                                            );
                                                                                            field.handleBlur();
                                                                                        }}
                                                                                        className={`rounded-full px-3 py-1.5 font-heading text-xs font-bold ring-1 outline-none transition-colors focus-visible:ring-3 focus-visible:ring-brand-orange/50 ${
                                                                                            active
                                                                                                ? "bg-brand-orange text-brand-ink ring-brand-orange"
                                                                                                : "text-secondary/65 ring-secondary/15 hover:bg-secondary/5 hover:text-secondary"
                                                                                        }`}
                                                                                    >
                                                                                        ৳
                                                                                        {amount.toLocaleString(
                                                                                            "en-IN",
                                                                                        )}
                                                                                    </button>
                                                                                );
                                                                            },
                                                                        )}
                                                                    </div>
                                                                </FieldShell>
                                                            );
                                                        }}
                                                    </form.Field>
                                                </motion.div>
                                            ) : null}
                                        </AnimatePresence>
                                    )}
                                </form.Subscribe>

                                {/* Actions */}
                                <motion.div
                                    variants={itemVariants}
                                    className="flex flex-col-reverse gap-2.5 border-t border-secondary/8 pt-5 sm:flex-row sm:items-center"
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
                                                    Booking…
                                                </motion.span>
                                            ) : (
                                                <motion.span
                                                    key="idle"
                                                    {...labelSwapMotion}
                                                    className="inline-flex items-center gap-2"
                                                >
                                                    <PackageCheck className="size-4" />
                                                    Book parcel
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
                                            setBookingRef(null);
                                        }}
                                        className="h-11 rounded-xl border-secondary/15 font-heading text-sm font-bold text-secondary hover:bg-secondary/5 hover:text-secondary"
                                    >
                                        <RotateCcw className="size-4" />
                                        Clear
                                    </Button>
                                    <p className="text-xs text-secondary/60 sm:ml-auto">
                                        The exact charge is locked when you
                                        book.
                                    </p>
                                </motion.div>
                            </Section>
                        </FieldGroup>

                        {/* Aside: booking help */}
                        <aside className="flex min-w-0 flex-col gap-5 lg:sticky lg:top-20">
                            <div className="relative overflow-hidden rounded-2xl bg-brand p-5 text-white ring-1 ring-white/10 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 motion-safe:fill-mode-backwards sm:p-6">
                                <div
                                    aria-hidden
                                    className="pointer-events-none absolute -top-16 -right-16 size-44 rounded-full bg-brand-orange/30 blur-3xl"
                                />
                                <div
                                    aria-hidden
                                    className="pointer-events-none absolute -bottom-20 -left-10 size-44 rounded-full bg-white/10 blur-3xl"
                                />
                                <div className="relative">
                                    <h2 className="font-heading text-base font-extrabold tracking-tight">
                                        What happens next
                                    </h2>
                                    <ol className="mt-3 flex flex-col gap-2.5 text-[13px] leading-relaxed text-white/70">
                                        {[
                                            "We validate your details and lock the price.",
                                            "A rider is assigned for pickup.",
                                            "You and your customer get live tracking.",
                                        ].map((step, index) => (
                                            <li
                                                key={step}
                                                className="flex items-start gap-2.5"
                                            >
                                                <span
                                                    aria-hidden
                                                    className="grid size-5.5 shrink-0 place-items-center rounded-full bg-brand-orange/15 font-heading text-[11px] font-extrabold text-brand-orange"
                                                >
                                                    {index + 1}
                                                </span>
                                                {step}
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            </div>
                        </aside>
                    </div>
                </form>
            </motion.div>
        </MotionConfig>
    );
}
