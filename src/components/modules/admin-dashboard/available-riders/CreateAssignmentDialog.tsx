"use client";

import { useForm } from "@tanstack/react-form";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { ClipboardList, Loader2, Package, Truck } from "lucide-react";
import { toast } from "sonner";
import type { FetchError } from "ofetch";
import SegmentedControl from "@/components/modules/pricing/SegmentedControl";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useCreateAssignment } from "@/hooks";
import type { AssignmentLeg, Rider } from "@/types";
import { createAssignmentSchema } from "@/validation";
import {
    containerVariants,
    errorMotion,
    itemVariants,
    labelSwapMotion,
    useShake,
} from "@/components/form/form-motion";

const inputClass =
    "h-11 rounded-xl border-secondary/15 bg-background font-mono text-sm text-secondary shadow-none placeholder:font-sans placeholder:text-secondary/40 focus-visible:border-brand-orange focus-visible:ring-3 focus-visible:ring-brand-orange/30 aria-invalid:border-destructive/60";

const LEG_OPTIONS: { value: AssignmentLeg; label: string; hint: string }[] = [
    { value: "PICKUP", label: "Pickup", hint: "Collect from merchant" },
    { value: "DELIVERY", label: "Delivery", hint: "Deliver to customer" },
];

/** Assign-a-parcel dialog for one available rider. */
export default function CreateAssignmentDialog({
    rider,
    onClose,
}: {
    rider: Rider | null;
    onClose: () => void;
}) {
    return (
        <Dialog
            open={rider !== null}
            onOpenChange={(open) => {
                if (!open) onClose();
            }}
        >
            <DialogContent className="max-h-[85svh] overflow-y-auto p-5 sm:max-w-lg sm:p-6">
                {rider ? (
                    <AssignmentForm
                        key={rider.id}
                        rider={rider}
                        onDone={onClose}
                    />
                ) : null}
            </DialogContent>
        </Dialog>
    );
}

function AssignmentForm({
    rider,
    onDone,
}: {
    rider: Rider;
    onDone: () => void;
}) {
    const [formScope, shakeForm] = useShake<HTMLFormElement>();
    const { mutate: assign, isPending } = useCreateAssignment();

    const form = useForm({
        defaultValues: {
            parcelId: "",
            riderId: rider.id,
            leg: "PICKUP" as AssignmentLeg,
        },
        validators: {
            onSubmit: createAssignmentSchema,
        },
        onSubmitInvalid: () => {
            shakeForm();
        },
        onSubmit: ({ value }) => {
            assign(
                {
                    parcelId: value.parcelId.trim(),
                    riderId: value.riderId,
                    leg: value.leg,
                },
                {
                    onSuccess: (res) => {
                        if (
                            res &&
                            typeof res === "object" &&
                            "success" in res &&
                            !res.success
                        ) {
                            shakeForm();
                            toast.error("Could not create assignment", {
                                description:
                                    "Something went wrong. Please try again.",
                            });
                            return;
                        }
                        toast.success("Assignment created", {
                            description: `${rider.name} · ${value.leg === "PICKUP" ? "pickup" : "delivery"}`,
                        });
                        onDone();
                    },
                    onError: (err: FetchError) => {
                        shakeForm();
                        toast.error("Could not create assignment", {
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
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2.5 font-heading text-base font-extrabold tracking-tight">
                        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand text-white">
                            <ClipboardList
                                className="size-4"
                                strokeWidth={2.25}
                            />
                        </span>
                        Create assignment
                    </DialogTitle>
                    <DialogDescription>
                        Assigning to{" "}
                        <span className="font-semibold">{rider.name}</span> ·{" "}
                        {rider.phone}
                    </DialogDescription>
                </DialogHeader>

                <form
                    ref={formScope}
                    noValidate
                    className="mt-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.handleSubmit();
                    }}
                >
                    <FieldGroup>
                        <form.Field name="parcelId">
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
                                                Parcel ID
                                            </FieldLabel>
                                            <div className="relative">
                                                <Package
                                                    aria-hidden
                                                    className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-secondary/35"
                                                />
                                                <Input
                                                    id={field.name}
                                                    name={field.name}
                                                    autoComplete="off"
                                                    spellCheck={false}
                                                    placeholder="Paste the parcel ID"
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
                                                                field.state.meta
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

                        <form.Field name="leg">
                            {(field) => (
                                <motion.div variants={itemVariants}>
                                    <Field
                                        data-invalid={
                                            field.state.meta.isTouched &&
                                            !field.state.meta.isValid
                                        }
                                    >
                                        <FieldLabel
                                            htmlFor={field.name}
                                            className="font-heading font-bold text-secondary"
                                        >
                                            Assignment leg
                                        </FieldLabel>
                                        <SegmentedControl
                                            aria-label="Assignment leg"
                                            value={field.state.value}
                                            onValueChange={(next) => {
                                                field.handleChange(next);
                                                field.handleBlur();
                                            }}
                                            options={LEG_OPTIONS.map(
                                                (option) => ({
                                                    ...option,
                                                    icon:
                                                        option.value ===
                                                        "PICKUP"
                                                            ? Truck
                                                            : Package,
                                                }),
                                            )}
                                        />
                                        <AnimatePresence>
                                            {field.state.meta.isTouched &&
                                                !field.state.meta.isValid && (
                                                    <motion.div
                                                        key={`${field.name}-error`}
                                                        {...errorMotion}
                                                        className="overflow-hidden"
                                                    >
                                                        <FieldError
                                                            errors={
                                                                field.state.meta
                                                                    .errors
                                                            }
                                                        />
                                                    </motion.div>
                                                )}
                                        </AnimatePresence>
                                    </Field>
                                </motion.div>
                            )}
                        </form.Field>

                        <motion.div
                            variants={itemVariants}
                            className="flex flex-col-reverse gap-2.5 pt-1 sm:flex-row sm:justify-end"
                        >
                            <DialogClose asChild>
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={isPending}
                                    className="h-11 rounded-xl border-secondary/15 font-heading text-sm font-bold text-secondary hover:bg-secondary/5 hover:text-secondary"
                                >
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="h-11 rounded-xl bg-brand-orange px-6 font-heading text-sm font-bold text-brand-ink shadow-[0_12px_28px_-12px_var(--color-brand-orange)] transition hover:brightness-110 active:scale-[0.99] disabled:opacity-70"
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
                                                Assigning…
                                            </motion.span>
                                        ) : (
                                            <motion.span
                                                key="idle"
                                                {...labelSwapMotion}
                                                className="inline-flex items-center gap-2"
                                            >
                                                <ClipboardList className="size-4" />
                                                Create assignment
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </Button>
                        </motion.div>
                    </FieldGroup>
                </form>
            </motion.div>
        </MotionConfig>
    );
}
