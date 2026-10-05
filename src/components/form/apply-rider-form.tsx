"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import {
    containerVariants,
    errorMotion,
    itemVariants,
    labelSwapMotion,
    useShake,
} from "./form-motion";
import Link from "next/link";
import { useForm } from "@tanstack/react-form";
import {
    Field,
    FieldContent,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "../ui/field";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { Marker } from "../ui/marker";
import {
    ArrowRight,
    Bike,
    BikeIcon,
    FileText,
    FileUp,
    Truck,
    X,
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Button } from "../ui/button";
import { MAX_FILE_SIZE, riderApplicationSchema } from "@/validation";
import { formatFileSize } from "@/utils";
import { useRouter } from "next/navigation";
import { useApplyAsRider } from "@/hooks";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";
import { ApplyAsRiderData, VehicleType } from "@/types";
import { FetchError } from "ofetch";

const vehicles = [
    {
        value: "BIKE",
        label: "Bike",
        icon: Bike,
    },
    {
        value: "BICYCLE",
        label: "Bicycle",
        icon: BikeIcon,
    },
    {
        value: "VAN",
        label: "Van",
        icon: Truck,
    },
];

export default function ApplyRiderForm() {
    const router = useRouter();
    const { mutate: apply, isPending: applyPending } = useApplyAsRider();
    const [formScope, shakeForm] = useShake<HTMLFormElement>();

    const form = useForm({
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            address: "",
            nid: "",
            licenseNumber: "",
            vehicleType: "",
            vehiclePaper: null as File | null,
        },

        validators: {
            onSubmit: riderApplicationSchema,
        },

        onSubmitInvalid: () => {
            shakeForm();
        },

        onSubmit: async ({ value }) => {
            const riderData: ApplyAsRiderData = {
                user: {
                    name: value.name.trim(),
                    email: value.email.trim(),
                },
                riderProfile: {
                    phone: value.phone.trim(),
                    address: value.address.trim(),
                    nid: value.nid.trim(),
                    licenseNumber: value.licenseNumber.trim(),
                    vehicleType: value.vehicleType as VehicleType,
                },
            };

            apply(
                {
                    data: riderData,
                    vehiclePaper: value.vehiclePaper as File,
                },
                {
                    onSuccess: (res) => {
                        if (!res.success) {
                            toast.error("Server Failure", {
                                description:
                                    "Something went wrong. Please try again",
                            });
                            return;
                        }

                        toast.success("Application Submitted", {
                            description: "Please verify your account",
                        });
                        const params = new URLSearchParams({
                            email: riderData.user.email,
                        });
                        router.push(
                            `/apply-rider/verify?${params.toString()}`,
                        );
                    },
                    onError: (err: FetchError) => {
                        shakeForm();
                        toast.error("Application failure", {
                            description:
                                err.data?.message ||
                                err.message ||
                                "Something went wrong. Please try again",
                        });
                    },
                },
            );
        },
    });
    return (
        <MotionConfig reducedMotion="user">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="flex flex-col gap-5">
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-row justify-between items-center"
                    >
                        <h1 className="text-4xl font-extrabold font-heading tracking-tight text-secondary">
                            Apply as a rider
                        </h1>
                        <p className="text-balance text-sm text-secondary/80">
                            Already applied?{" "}
                            <Link
                                href={"/login"}
                                className="text-chart-3 font-bold font-heading underline hover:underline"
                            >
                                Log in
                            </Link>
                        </p>
                    </motion.div>

                    <Card>
                        <CardContent>
                            <form
                                ref={formScope}
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    form.handleSubmit();
                                }}
                            >
                                <FieldGroup>
                                    <h4 className="text-secondary font-heading font-extrabold text-xl">
                                        Personal details
                                    </h4>
                                    <motion.div
                                        variants={itemVariants}
                                        className="grid gap-5 sm:grid-cols-2"
                                    >
                                        <form.Field name="name">
                                            {(field) => {
                                                const isInvalid =
                                                    field.state.meta
                                                        .isTouched &&
                                                    !field.state.meta.isValid;

                                                return (
                                                    <Field
                                                        data-invalid={isInvalid}
                                                    >
                                                        <FieldLabel
                                                            htmlFor={field.name}
                                                            className="text-secondary font-heading font-bold"
                                                        >
                                                            Full name
                                                        </FieldLabel>
                                                        <Input
                                                            id={field.name}
                                                            name={field.name}
                                                            onChange={(e) =>
                                                                field.handleChange(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            onBlur={
                                                                field.handleBlur
                                                            }
                                                            value={
                                                                field.state
                                                                    .value
                                                            }
                                                            aria-invalid={
                                                                isInvalid
                                                            }
                                                            placeholder="Your name"
                                                            className="border-2 border-gray-400"
                                                        />
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
                                                );
                                            }}
                                        </form.Field>

                                        <form.Field name="email">
                                            {(field) => {
                                                const isInvalid =
                                                    field.state.meta
                                                        .isTouched &&
                                                    !field.state.meta.isValid;

                                                return (
                                                    <Field
                                                        data-invalid={isInvalid}
                                                    >
                                                        <FieldLabel
                                                            htmlFor={field.name}
                                                            className="text-secondary font-heading font-bold"
                                                        >
                                                            Email
                                                        </FieldLabel>
                                                        <Input
                                                            id={field.name}
                                                            name={field.name}
                                                            onChange={(e) =>
                                                                field.handleChange(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            onBlur={
                                                                field.handleBlur
                                                            }
                                                            value={
                                                                field.state
                                                                    .value
                                                            }
                                                            aria-invalid={
                                                                isInvalid
                                                            }
                                                            placeholder="you@mail.com"
                                                            className="border-2 border-gray-400"
                                                        />
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
                                                );
                                            }}
                                        </form.Field>
                                    </motion.div>

                                    <motion.div
                                        variants={itemVariants}
                                        className="grid gap-5 sm:grid-cols-2"
                                    >
                                        <form.Field name="phone">
                                            {(field) => {
                                                const isInvalid =
                                                    field.state.meta
                                                        .isTouched &&
                                                    !field.state.meta.isValid;

                                                return (
                                                    <Field
                                                        data-invalid={isInvalid}
                                                    >
                                                        <FieldLabel
                                                            htmlFor={field.name}
                                                            className="text-secondary font-heading font-bold"
                                                        >
                                                            Phone
                                                        </FieldLabel>
                                                        <Input
                                                            id={field.name}
                                                            name={field.name}
                                                            onChange={(e) =>
                                                                field.handleChange(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            onBlur={
                                                                field.handleBlur
                                                            }
                                                            value={
                                                                field.state
                                                                    .value
                                                            }
                                                            aria-invalid={
                                                                isInvalid
                                                            }
                                                            placeholder="01XXXXXXXXX"
                                                            className="border-2 border-gray-400"
                                                        />
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
                                                );
                                            }}
                                        </form.Field>

                                        <form.Field name="address">
                                            {(field) => {
                                                const isInvalid =
                                                    field.state.meta
                                                        .isTouched &&
                                                    !field.state.meta.isValid;

                                                return (
                                                    <Field
                                                        data-invalid={isInvalid}
                                                    >
                                                        <FieldLabel
                                                            htmlFor={field.name}
                                                            className="text-secondary font-heading font-bold"
                                                        >
                                                            Address
                                                            <span className="text-brand/40">
                                                                (optional)
                                                            </span>
                                                        </FieldLabel>
                                                        <Input
                                                            id={field.name}
                                                            name={field.name}
                                                            onChange={(e) =>
                                                                field.handleChange(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            onBlur={
                                                                field.handleBlur
                                                            }
                                                            value={
                                                                field.state
                                                                    .value
                                                            }
                                                            aria-invalid={
                                                                isInvalid
                                                            }
                                                            placeholder="Area, city"
                                                            className="border-2 border-gray-400"
                                                        />
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
                                                );
                                            }}
                                        </form.Field>
                                    </motion.div>

                                    <Marker variant={"border"}></Marker>

                                    <h4 className="text-secondary font-heading font-extrabold text-xl">
                                        Identity
                                    </h4>

                                    <motion.div
                                        variants={itemVariants}
                                        className="grid gap-5 sm:grid-cols-2"
                                    >
                                        <form.Field name="nid">
                                            {(field) => {
                                                const isInvalid =
                                                    field.state.meta
                                                        .isTouched &&
                                                    !field.state.meta.isValid;

                                                return (
                                                    <Field
                                                        data-invalid={isInvalid}
                                                    >
                                                        <FieldLabel
                                                            htmlFor={field.name}
                                                            className="text-secondary font-heading font-bold"
                                                        >
                                                            NID number
                                                        </FieldLabel>
                                                        <Input
                                                            id={field.name}
                                                            name={field.name}
                                                            onChange={(e) =>
                                                                field.handleChange(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            onBlur={
                                                                field.handleBlur
                                                            }
                                                            value={
                                                                field.state
                                                                    .value
                                                            }
                                                            aria-invalid={
                                                                isInvalid
                                                            }
                                                            placeholder="NID number"
                                                            className="border-2 border-gray-400"
                                                        />
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
                                                );
                                            }}
                                        </form.Field>

                                        <form.Field name="licenseNumber">
                                            {(field) => {
                                                const isInvalid =
                                                    field.state.meta
                                                        .isTouched &&
                                                    !field.state.meta.isValid;

                                                return (
                                                    <Field
                                                        data-invalid={isInvalid}
                                                    >
                                                        <FieldLabel
                                                            htmlFor={field.name}
                                                            className="text-secondary font-heading font-bold"
                                                        >
                                                            Driving license
                                                            number
                                                        </FieldLabel>
                                                        <Input
                                                            id={field.name}
                                                            name={field.name}
                                                            onChange={(e) =>
                                                                field.handleChange(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            onBlur={
                                                                field.handleBlur
                                                            }
                                                            value={
                                                                field.state
                                                                    .value
                                                            }
                                                            aria-invalid={
                                                                isInvalid
                                                            }
                                                            placeholder="As printed on your license"
                                                            className="border-2 border-gray-400"
                                                        />
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
                                                );
                                            }}
                                        </form.Field>
                                    </motion.div>

                                    <Marker variant={"border"}></Marker>

                                    <h4 className="text-secondary font-heading font-extrabold text-xl">
                                        Your vehicle
                                    </h4>

                                    <form.Field name="vehicleType">
                                        {(field) => {
                                            const isInvalid =
                                                field.state.meta.isTouched &&
                                                !field.state.meta.isValid;
                                            return (
                                                <Field data-invalid={isInvalid}>
                                                    <RadioGroup
                                                        defaultValue="BIKE"
                                                        className="grid grid-cols-3 gap-3"
                                                    >
                                                        {vehicles.map(
                                                            (vehicle) => {
                                                                const Icon =
                                                                    vehicle.icon;

                                                                return (
                                                                    <motion.div
                                                                        key={
                                                                            vehicle.value
                                                                        }
                                                                        variants={
                                                                            itemVariants
                                                                        }
                                                                    >
                                                                        <FieldLabel
                                                                            key={
                                                                                vehicle.value
                                                                            }
                                                                            htmlFor={
                                                                                vehicle.value
                                                                            }
                                                                            className="cursor-pointer rounded-xl border p-3 transition has-data-[state=checked]:bg-secondary has-data-[state=checked]:text-white"
                                                                        >
                                                                            <Field
                                                                                orientation="vertical"
                                                                                className="hover:text-secondary"
                                                                            >
                                                                                <div className="flex items-center justify-between">
                                                                                    <Icon
                                                                                        className="size-6"
                                                                                        color="#FF6B2D"
                                                                                    />

                                                                                    <RadioGroupItem
                                                                                        value={
                                                                                            vehicle.value
                                                                                        }
                                                                                        id={
                                                                                            vehicle.value
                                                                                        }
                                                                                        className="sr-only"
                                                                                    />
                                                                                </div>

                                                                                <FieldContent>
                                                                                    <span className="text-sm font-semibold">
                                                                                        {
                                                                                            vehicle.label
                                                                                        }
                                                                                    </span>
                                                                                </FieldContent>
                                                                            </Field>
                                                                        </FieldLabel>
                                                                    </motion.div>
                                                                );
                                                            },
                                                        )}
                                                    </RadioGroup>
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
                                            );
                                        }}
                                    </form.Field>

                                    <Marker variant={"border"}></Marker>

                                    <h4 className="text-secondary font-heading font-extrabold text-xl">
                                        Vehicle paper
                                    </h4>

                                    <form.Field name="vehiclePaper">
                                        {(field) => {
                                            const isInvalid =
                                                field.state.meta.isTouched &&
                                                !field.state.meta.isValid;
                                            const file = field.state.value;
                                            return (
                                                <motion.div
                                                    variants={itemVariants}
                                                >
                                                    <Field
                                                        data-invalid={isInvalid}
                                                    >
                                                        <div className="flex flex-wrap items-center gap-3">
                                                            <Button
                                                                asChild
                                                                variant="outline"
                                                                className="p-10"
                                                            >
                                                                <label
                                                                    htmlFor={
                                                                        field.name
                                                                    }
                                                                    className="cursor-pointer"
                                                                >
                                                                    <FileUp color="#FF6B2D" />
                                                                    Upload
                                                                    vehicle
                                                                    paper
                                                                </label>
                                                            </Button>
                                                            <input
                                                                id={field.name}
                                                                type="file"
                                                                className="sr-only"
                                                                name={
                                                                    field.name
                                                                }
                                                                onChange={(
                                                                    e,
                                                                ) => {
                                                                    const selected =
                                                                        e.target
                                                                            .files?.[0] ??
                                                                        null;

                                                                    field.handleChange(
                                                                        selected,
                                                                    );
                                                                    e.target.value =
                                                                        "";
                                                                }}
                                                            />
                                                            {file ? (
                                                                <span className="inline-flex max-w-full items-center gap-2 rounded-lg bg-muted px-2.5 py-1 text-sm">
                                                                    <FileText className="size-4 shrink-0 text-primary" />
                                                                    <span className="truncate">
                                                                        {
                                                                            file.name
                                                                        }
                                                                    </span>
                                                                    <span className="text-xs text-muted-foreground">
                                                                        {formatFileSize(
                                                                            file.size,
                                                                        )}
                                                                    </span>
                                                                    <button
                                                                        type="button"
                                                                        aria-label="Remove resume"
                                                                        onClick={() => {
                                                                            field.handleChange(
                                                                                null,
                                                                            );
                                                                            field.handleBlur();
                                                                        }}
                                                                        className="text-muted-foreground transition-colors hover:text-destructive focus:outline-none"
                                                                    >
                                                                        <X className="size-4" />
                                                                    </button>
                                                                </span>
                                                            ) : (
                                                                <span className="text-xs text-muted-foreground">
                                                                    PDF, DOC,
                                                                    DOCX or
                                                                    image up to{" "}
                                                                    {
                                                                        MAX_FILE_SIZE
                                                                    }{" "}
                                                                    MB
                                                                </span>
                                                            )}
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

                                    <motion.div
                                        variants={itemVariants}
                                        className="flex flex-col"
                                    >
                                        <Button
                                            className="relative overflow-hidden bg-chart-2 text-secondary font-heading font-bold py-5 hover:bg-chart-3"
                                            disabled={applyPending}
                                            type="submit"
                                        >
                                            <AnimatePresence
                                                initial={false}
                                                mode="popLayout"
                                            >
                                                {applyPending ? (
                                                    <motion.span
                                                        key="pending"
                                                        {...labelSwapMotion}
                                                        className="inline-flex items-center gap-1.5"
                                                    >
                                                        <Spinner /> Submitting
                                                    </motion.span>
                                                ) : (
                                                    <motion.span
                                                        key="idle"
                                                        {...labelSwapMotion}
                                                        className="inline-flex items-center gap-1.5"
                                                    >
                                                        Submit application
                                                        <ArrowRight className="transition-transform duration-200 group-hover/button:translate-x-1" />
                                                    </motion.span>
                                                )}
                                            </AnimatePresence>
                                        </Button>
                                    </motion.div>
                                </FieldGroup>
                            </form>
                            <motion.div variants={itemVariants}>
                                <p className="mt-3 text-center text-xs w-0.8">
                                    We'll email a verification code and a
                                    temporary password to this address. Verify
                                    within 60 minutes or the application is
                                    removed.
                                </p>
                            </motion.div>
                        </CardContent>
                    </Card>
                </div>
            </motion.div>
        </MotionConfig>
    );
}
