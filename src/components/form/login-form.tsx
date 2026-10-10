"use client";

import { useLogin } from "@/hooks";
import { useForm } from "@tanstack/react-form";
import { ArrowRight, Eye, EyeClosed } from "lucide-react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";
import Link from "next/link";
import { loginSchema } from "@/validation";
import { completePasswordLogin, resolveNextPath } from "@/utils";
import { Marker, MarkerContent } from "../ui/marker";
import GoogleLoginComponent from "../modules/authentication/GoogleLogin";
import DemoLogins from "../modules/authentication/DemoLogins";
import type { FetchError } from "ofetch";
import {
    containerVariants,
    EASE_OUT,
    errorMotion,
    itemVariants,
    useShake,
} from "./form-motion";
import { ROUTES } from "@/constants";

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    // Deep link the guard saved (?next=); validated same-origin on use.
    const next = resolveNextPath(searchParams.get("next"));
    const [formScope, shakeForm] = useShake<HTMLFormElement>();

    const { mutate: login, isPending: loginPending } = useLogin();

    const form = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
        validators: {
            onSubmit: loginSchema,
        },
        onSubmitInvalid: () => {
            shakeForm();
        },
        onSubmit: ({ value }) => {
            const loginData = {
                email: value.email,
                password: value.password,
            };

            login(loginData, {
                onSuccess: (res) => {
                    completePasswordLogin(res, {
                        push: (url) => router.push(url),
                        next,
                    });
                },
                onError: (err: FetchError) => {
                    shakeForm();
                    toast.error("Authorization failure", {
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
                        <h1 className="text-4xl font-extrabold font-heading tracking-tight text-secondary">
                            Log in
                        </h1>
                        <p className="text-balance text-sm text-secondary/80">
                            Merchants, riders and admins all sign in here.
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
                            <form.Field name="email">
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
                                                    Email
                                                </FieldLabel>
                                                <Input
                                                    id={field.name}
                                                    name={field.name}
                                                    onChange={(e) =>
                                                        field.handleChange(
                                                            e.target.value,
                                                        )
                                                    }
                                                    onBlur={field.handleBlur}
                                                    value={field.state.value}
                                                    aria-invalid={isInvalid}
                                                    placeholder="you@mail.com"
                                                    className="border-2 border-gray-400"
                                                />
                                                <AnimatePresence>
                                                    {isInvalid && (
                                                        <motion.div
                                                            key="email-error"
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

                            <form.Field name="password">
                                {(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched &&
                                        !field.state.meta.isValid;

                                    return (
                                        <motion.div variants={itemVariants}>
                                            <Field data-invalid={isInvalid}>
                                                <div className="flex items-center">
                                                    <FieldLabel
                                                        htmlFor={field.name}
                                                        className="text-secondary font-heading font-bold"
                                                    >
                                                        Password
                                                    </FieldLabel>
                                                    <Button
                                                        type="button"
                                                        onClick={() => {
                                                            const params =
                                                                new URLSearchParams(
                                                                    {
                                                                        email: form
                                                                            .state
                                                                            .values
                                                                            .email,
                                                                    },
                                                                );
                                                            router.push(
                                                                `/forgot-password?${params.toString()}`,
                                                            );
                                                        }}
                                                        className="ml-auto text-chart-3 font-bold font-heading text-sm underline hover:underline bg-transparent hover:bg-transparent"
                                                    >
                                                        Forgot password?
                                                    </Button>
                                                </div>
                                                <div className="relative">
                                                    <Input
                                                        id={field.name}
                                                        name={field.name}
                                                        type={
                                                            showPassword
                                                                ? "text"
                                                                : "password"
                                                        }
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
                                                        placeholder="Enter your password"
                                                        className="border-2 border-gray-400"
                                                        aria-invalid={isInvalid}
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
                                                                initial={{
                                                                    opacity: 0,
                                                                    scale: 0.6,
                                                                    rotate: -45,
                                                                }}
                                                                animate={{
                                                                    opacity: 1,
                                                                    scale: 1,
                                                                    rotate: 0,
                                                                }}
                                                                exit={{
                                                                    opacity: 0,
                                                                    scale: 0.6,
                                                                    rotate: 45,
                                                                }}
                                                                transition={{
                                                                    duration: 0.15,
                                                                }}
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
                                                    {isInvalid && (
                                                        <motion.div
                                                            key="password-error"
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

                            <motion.div
                                variants={itemVariants}
                                className="flex flex-col"
                            >
                                <Button
                                    className="relative overflow-hidden bg-chart-2 text-secondary font-heading font-bold py-5 hover:bg-chart-3"
                                    disabled={loginPending}
                                    type="submit"
                                >
                                    <AnimatePresence
                                        initial={false}
                                        mode="popLayout"
                                    >
                                        {loginPending ? (
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
                                                <Spinner /> Logging in
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
                                                Log in
                                                <ArrowRight className="transition-transform duration-200 group-hover/button:translate-x-1" />
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </Button>
                            </motion.div>
                        </FieldGroup>
                    </form>

                    <motion.div variants={itemVariants}>
                        <Marker variant="separator">
                            <MarkerContent>or</MarkerContent>
                        </Marker>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <GoogleLoginComponent
                            text="continue_with"
                            next={next}
                        />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <DemoLogins next={next} />
                    </motion.div>
                </div>

                <motion.div
                    variants={itemVariants}
                    className="mt-2 text-center text-xs text-secondary"
                >
                    <p>Google sign-in is for merchant accounts.</p>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <div className="mt-4"></div>

                    <Marker variant="border"></Marker>

                    <div className="mt-3 text-sm text-secondary">
                        <p>
                            New to ParcelFlow?{" "}
                            <Link
                                href={"/register"}
                                className="text-chart-3 font-bold font-heading text-sm underline hover:underline"
                            >
                                Create a merchant account
                            </Link>
                        </p>
                    </div>

                    <div className="mt-3 text-sm text-secondary">
                        <p>
                            Want to deliver parcels?{" "}
                            <Link
                                href={ROUTES.riderApply}
                                className="text-chart-3 font-bold font-heading text-sm underline hover:underline"
                            >
                                Apply as a rider
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </MotionConfig>
    );
}
