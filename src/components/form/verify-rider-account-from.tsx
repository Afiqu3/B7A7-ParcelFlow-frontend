"use client";

import { ROUTES } from "@/constants";
import { useVerifyRiderAccount } from "@/hooks";
import { emailVerifySchema } from "@/validation";
import { useForm } from "@tanstack/react-form";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import {
    ArrowLeft,
    ArrowRight,
    Clock,
    Mail,
    TriangleAlert,
} from "lucide-react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FetchError } from "ofetch";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Field, FieldError, FieldGroup } from "../ui/field";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { Spinner } from "../ui/spinner";
import {
    containerVariants,
    EASE_OUT,
    errorMotion,
    itemVariants,
    useShake,
} from "./form-motion";

const RESEND_COOLDOWN = 60 * 60;

export default function VerifyRiderAccountForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [formScope, shakeForm] = useShake<HTMLFormElement>();
    const [resendTimer, setResendTimer] = useState(RESEND_COOLDOWN);

    const { mutate: verify, isPending: VerifyPending } =
        useVerifyRiderAccount();

    const email = searchParams.get("email") || "";

    useEffect(() => {
        if (!email) {
            router.push("/");
        }
    }, [email, router]);

    useEffect(() => {
        if (resendTimer <= 0) {
            return;
        }

        const timer = setInterval(() => {
            setResendTimer((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [resendTimer]);

    const mm = String(Math.floor(resendTimer / 60)).padStart(2, "0");
    const ss = String(resendTimer % 60).padStart(2, "0");

    const form = useForm({
        defaultValues: {
            otp: "",
        },
        validators: {
            onSubmit: emailVerifySchema,
        },
        onSubmitInvalid: () => {
            shakeForm();
        },
        onSubmit: ({ value }) => {
            const verifyData = {
                email,
                otp: value.otp,
            };

            verify(verifyData, {
                onSuccess: (res) => {
                    if (!res.success) {
                        toast.error("Server Failure", {
                            description:
                                "Something went wrong. Please try again",
                        });
                        return;
                    }
                    toast.success("Verifying Successfully", {
                        description: "Welcome to ParcelFlow",
                    });
                    router.push("/");
                },
                onError: (err: FetchError) => {
                    shakeForm();
                    toast.error("Verification failure", {
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
                            <ArrowLeft size={17} /> Back to login
                        </Link>

                        <div className="text-brand-orange p-4 bg-brand-orange/20 max-w-17 rounded-lg flex items-center justify-center">
                            <Mail />
                        </div>

                        <h1 className="text-4xl font-extrabold font-heading tracking-tight text-secondary">
                            Check your email
                        </h1>

                        <p className="text-balance text-sm text-secondary/80">
                            We sent a 6-digit code and a temporary password to{" "}
                            <span className="font-extrabold">{email}</span>.
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

                            <motion.div
                                variants={itemVariants}
                                className="flex flex-col"
                            >
                                <Button
                                    className="relative overflow-hidden bg-chart-2 text-secondary font-heading font-bold py-5 hover:bg-chart-3"
                                    disabled={VerifyPending}
                                    type="submit"
                                >
                                    <AnimatePresence
                                        initial={false}
                                        mode="popLayout"
                                    >
                                        {VerifyPending ? (
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
                                                <Spinner /> Verifying
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
                                                Verify & continue
                                                <ArrowRight className="transition-transform duration-200 group-hover/button:translate-x-1" />
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </Button>
                            </motion.div>

                            <motion.div
                                variants={itemVariants}
                                className="flex flex-row justify-between items-center"
                            >
                                <p className="flex flex-row gap-2 items-center text-sm text-secondary">
                                    <Clock size={15} /> Code expires in {mm}:
                                    {ss}
                                </p>
                            </motion.div>
                        </FieldGroup>
                    </form>
                </div>

                <motion.div variants={itemVariants} className="mt-5">
                    <Card className="bg-brand-orange/40">
                        <CardContent className="flex flex-row gap-2 text-xs text-secondary">
                            <TriangleAlert size={20} />{" "}
                            <p>
                                If the code expires, your application is removed
                                and you'll need to apply again.
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </MotionConfig>
    );
}
