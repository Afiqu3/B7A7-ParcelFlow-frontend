"use client";

import { ROUTES } from "@/constants";
import { resetPasswordSchema } from "@/validation";
import { useForm } from "@tanstack/react-form";
import { ArrowLeft, ArrowRight, Eye, EyeClosed } from "lucide-react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import {
    containerVariants,
    EASE_OUT,
    errorMotion,
    iconSwapMotion,
    itemVariants,
    useShake,
} from "./form-motion";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import PasswordStrength from "../modules/authentication/PasswordStrength";
import { useResetPassword } from "@/hooks";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";
import { FetchError } from "ofetch";

export default function ResetPasswordForm() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";

    const [formScope, shakeForm] = useShake<HTMLFormElement>();

    const { mutate: reset, isPending:ResetPending } = useResetPassword();

    useEffect(() => {
        if (!email) {
            router.push("/");
        }
    }, [email, router]);

    const form = useForm({
        defaultValues: {
            otp: "",
            email,
            newPassword: "",
            confirmPassword: "",
        },
        validators: {
            onSubmit: resetPasswordSchema,
        },
        onSubmitInvalid: () => {
            shakeForm();
        },
        onSubmit: ({ value }) => {
            const resetPasswordData = {
                email,
                otp: value.otp,
                newPassword: value.newPassword,
            };

            reset(resetPasswordData, {
                onSuccess: (res) => {
                    if (!res.success) {
                        toast.error("Server Failure", {
                            description:
                                "Something went wrong. Please try again",
                        });
                        return;
                    }
                    toast.success("Password reset successfully", {
                        description: "Login with new password",
                    });
                    router.push(ROUTES.login);
                },
                onError: (err: FetchError) => {
                    shakeForm();
                    toast.error("Reset password failure", {
                        description:
                            err.data?.message ||
                            err.message ||
                            "Something went wrong. Please try again",
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
                <div className="flex flex-col gap-5">
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col gap-2"
                    >
                        <Link
                            href={ROUTES.forgotPassword}
                            className="flex flex-row gap-2 items-center text-sm mb-7 text-brand-orange font-extrabold max-w-60"
                        >
                            <ArrowLeft size={17} /> Use a different email
                        </Link>

                        <h1 className="text-4xl font-extrabold font-heading tracking-tight text-secondary">
                            Set a new password
                        </h1>

                        <p className="text-balance text-sm text-secondary/80">
                            Enter the code we sent to {email}. It expires in 5
                            minutes.
                        </p>
                    </motion.div>

                    <form
                        ref={formScope}
                        onSubmit={(e) => {
                            e.preventDefault();
                            form.handleSubmit();
                        }}
                    >
                        <FieldGroup>
                            <form.Field name="otp">
                                {(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched &&
                                        !field.state.meta.isValid;

                                    return (
                                        <motion.div variants={itemVariants}>
                                            <Field data-invalid={isInvalid}>
                                                <FieldLabel
                                                    htmlFor={field.name}
                                                    className="text-secondary font-heading font-bold"
                                                >
                                                    Reset code
                                                </FieldLabel>
                                                <InputOTP
                                                    maxLength={6}
                                                    onChange={(e) =>
                                                        field.handleChange(e)
                                                    }
                                                    onBlur={field.handleBlur}
                                                    value={field.state.value}
                                                    aria-invalid={isInvalid}
                                                    name={field.name}
                                                    id={field.name}
                                                    pattern={REGEXP_ONLY_DIGITS}
                                                >
                                                    <InputOTPGroup className="flex flex-row gap-2">
                                                        <InputOTPSlot
                                                            className="rounded-sm sm:h-13 sm:w-12"
                                                            index={0}
                                                        />
                                                        <InputOTPSlot
                                                            className="rounded-sm sm:h-13 sm:w-12"
                                                            index={1}
                                                        />
                                                        <InputOTPSlot
                                                            className="rounded-sm sm:h-13 sm:w-12"
                                                            index={2}
                                                        />
                                                        <InputOTPSlot
                                                            className="rounded-sm sm:h-13 sm:w-12"
                                                            index={3}
                                                        />
                                                        <InputOTPSlot
                                                            className="rounded-sm sm:h-13 sm:w-12"
                                                            index={4}
                                                        />
                                                        <InputOTPSlot
                                                            className="rounded-sm sm:h-13 sm:w-12"
                                                            index={5}
                                                        />
                                                    </InputOTPGroup>
                                                </InputOTP>

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
                                                    className="text-secondary font-heading font-bold"
                                                >
                                                    New Password
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
                                                        onChange={(e) =>
                                                            field.handleChange(
                                                                e.target.value,
                                                            )
                                                        }
                                                        onBlur={
                                                            field.handleBlur
                                                        }
                                                        value={
                                                            field.state.value
                                                        }
                                                        placeholder="Create a strong password"
                                                        className="border-2 border-gray-400 pr-10"
                                                        aria-invalid={isInvalid}
                                                        aria-describedby="password-requirements"
                                                    />
                                                    <button
                                                        className="absolute right-3 top-1/2 -translate-y-1/2"
                                                        type="button"
                                                        aria-label={
                                                            showPassword
                                                                ? "Hide password"
                                                                : "Show password"
                                                        }
                                                        aria-pressed={
                                                            showPassword
                                                        }
                                                        onClick={() =>
                                                            setShowPassword(
                                                                (prev) => !prev,
                                                            )
                                                        }
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
                                                {/* The checklist already shows which rules failed, so
                                                    only the "empty" case needs its own error message. */}
                                                <AnimatePresence>
                                                    {isInvalid &&
                                                        !field.state.value && (
                                                            <motion.div
                                                                key={`${field.name}-error`}
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
                                                {/* <PasswordStrength
                                                id="password-requirements"
                                                password={field.state.value}
                                                showErrors={isInvalid}
                                                className="mt-1"
                                            /> */}
                                            </Field>
                                        </motion.div>
                                    );
                                }}
                            </form.Field>

                            <form.Field name="confirmPassword">
                                {(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched &&
                                        !field.state.meta.isValid;

                                    return (
                                        <motion.div variants={itemVariants}>
                                            <Field data-invalid={isInvalid}>
                                                <FieldLabel
                                                    htmlFor={field.name}
                                                    className="text-secondary font-heading font-bold"
                                                >
                                                    Confirm new password
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
                                                        onChange={(e) =>
                                                            field.handleChange(
                                                                e.target.value,
                                                            )
                                                        }
                                                        onBlur={
                                                            field.handleBlur
                                                        }
                                                        value={
                                                            field.state.value
                                                        }
                                                        placeholder="Create a strong password"
                                                        className="border-2 border-gray-400 pr-10"
                                                        aria-invalid={isInvalid}
                                                        aria-describedby="password-requirements"
                                                    />
                                                </div>
                                                {/* The checklist already shows which rules failed, so
                                                    only the "empty" case needs its own error message. */}
                                                <AnimatePresence>
                                                    {isInvalid &&
                                                        !field.state.value && (
                                                            <motion.div
                                                                key={`${field.name}-error`}
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
                                                    id="password-requirements"
                                                    password={field.state.value}
                                                    showErrors={isInvalid}
                                                    className="mt-1"
                                                />
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
                                    disabled={ResetPending}
                                    type="submit"
                                >
                                    <AnimatePresence
                                        initial={false}
                                        mode="popLayout"
                                    >
                                        {ResetPending ? (
                                            <motion.span
                                                key="pending"
                                                initial={{ opacity: 0, y: 14 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -14 }}
                                                transition={{
                                                    duration: 0.2,
                                                    ease: EASE_OUT,
                                                }}
                                                className="inline-flex items-center gap-1.5"
                                            >
                                                <Spinner /> Updating
                                            </motion.span>
                                        ) : (
                                            <motion.span
                                                key="idle"
                                                initial={{ opacity: 0, y: 14 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -14 }}
                                                transition={{
                                                    duration: 0.2,
                                                    ease: EASE_OUT,
                                                }}
                                                className="inline-flex items-center gap-1.5"
                                            >
                                                Update password
                                                <ArrowRight className="transition-transform duration-200 group-hover/button:translate-x-1" />
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </Button>
                            </motion.div>
                        </FieldGroup>
                    </form>
                </div>

                <motion.div
                    variants={itemVariants}
                    className="mt-5"
                ></motion.div>
            </motion.div>
        </MotionConfig>
    );
}
