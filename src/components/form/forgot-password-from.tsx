"use client";

import { ROUTES } from "@/constants";
import { useForgotPassword } from "@/hooks";
import { forgotPasswordSchema } from "@/validation";
import { useForm } from "@tanstack/react-form";
import { ArrowLeft, ArrowRight, Info, Lock } from "lucide-react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FetchError } from "ofetch";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";
import {
    containerVariants,
    EASE_OUT,
    errorMotion,
    itemVariants,
    useShake,
} from "./form-motion";

export default function ForgotPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";

    const [formScope, shakeForm] = useShake<HTMLFormElement>();

    const { mutate: forgot, isPending: forgotPending } = useForgotPassword();

    const form = useForm({
        defaultValues: {
            email: email,
        },
        validators: {
            onSubmit: forgotPasswordSchema,
        },
        onSubmitInvalid: () => {
            shakeForm();
        },
        onSubmit: ({ value }) => {
            const forgotPasswordData = {
                email: value.email,
            };

            forgot(forgotPasswordData, {
                onSuccess: (res) => {
                    toast.success("OTP sent", {
                        description: "Please check your email",
                    });
                    const params = new URLSearchParams({
                        email: forgotPasswordData.email,
                    });
                    router.push(`/reset-password?${params.toString()}`);
                },
                onError: (err: FetchError) => {
                    shakeForm();
                    toast.error("Forget password failure", {
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
                            href={ROUTES.login}
                            className="flex flex-row gap-2 items-center text-sm mb-7 text-brand-orange font-extrabold max-w-40"
                        >
                            <ArrowLeft size={17} /> Back to log in
                        </Link>

                        <div className="text-brand-orange p-4 bg-brand-orange/20 max-w-17 rounded-lg flex items-center justify-center">
                            <Lock />
                        </div>

                        <h1 className="text-4xl font-extrabold font-heading tracking-tight text-secondary">
                            Forgot your password?
                        </h1>

                        <p className="text-balance text-sm text-secondary/80">
                            Enter the email on your account and we'll send you a
                            6-digit code to reset it.
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

                            <motion.div
                                variants={itemVariants}
                                className="flex flex-col"
                            >
                                <Button
                                    className="relative overflow-hidden bg-chart-2 text-secondary font-heading font-bold py-5 hover:bg-chart-3"
                                    disabled={forgotPending}
                                    type="submit"
                                >
                                    <AnimatePresence
                                        initial={false}
                                        mode="popLayout"
                                    >
                                        {forgotPending ? (
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
                                                <Spinner /> Sending
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
                                                Send reset code
                                                <ArrowRight className="transition-transform duration-200 group-hover/button:translate-x-1" />
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </Button>
                            </motion.div>
                        </FieldGroup>
                    </form>
                </div>

                <motion.div variants={itemVariants} className="mt-5">
                    <Card>
                        <CardContent className="flex flex-row gap-2 text-xs text-secondary">
                            <Info size={23} />{" "}
                            <p>
                                Signed up with Google? Your account doesn't have
                                a password. Use Continue with Google on the
                                log-in page instead.
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </MotionConfig>
    );
}
