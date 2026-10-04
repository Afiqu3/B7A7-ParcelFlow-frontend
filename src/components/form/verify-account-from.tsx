"use client";

import { ROUTES } from "@/constants";
import { useVerifyAccount } from "@/hooks";
import { emailVerifySchema } from "@/validation";
import { useForm } from "@tanstack/react-form";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { ArrowLeft, ArrowRight, Clock, Info, Mail } from "lucide-react";
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

const RESEND_COOLDOWN = 300;

export default function VerifyAccountForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [formScope, shakeForm] = useShake<HTMLFormElement>();
    const [resendTimer, setResendTimer] = useState(RESEND_COOLDOWN);

    const { mutate: verify, isPending: VerifyPending } = useVerifyAccount();

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
                            href={ROUTES.register}
                            className="flex flex-row gap-2 items-center text-sm mb-7 text-brand-orange font-extrabold"
                        >
                            <ArrowLeft size={17} /> Back to sign-up
                        </Link>

                        <div className="text-brand-orange p-4 bg-brand-orange/20 max-w-17 rounded-lg flex items-center justify-center">
                            <Mail />
                        </div>

                        <h1 className="text-4xl font-extrabold font-heading tracking-tight text-secondary">
                            Verify your email
                        </h1>

                        <p className="text-balance text-sm text-secondary/80">
                            Enter the 6-digit code we sent to{" "}
                            <span className="font-extrabold">
                                {email}
                            </span>
                            .
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
                                                            className="rounded-sm h-13 w-12"
                                                            index={0}
                                                        />
                                                        <InputOTPSlot
                                                            className="rounded-sm h-13 w-12"
                                                            index={1}
                                                        />
                                                        <InputOTPSlot
                                                            className="rounded-sm h-13 w-12"
                                                            index={2}
                                                        />
                                                        <InputOTPSlot
                                                            className="rounded-sm h-13 w-12"
                                                            index={3}
                                                        />
                                                        <InputOTPSlot
                                                            className="rounded-sm h-13 w-12"
                                                            index={4}
                                                        />
                                                        <InputOTPSlot
                                                            className="rounded-sm h-13 w-12"
                                                            index={5}
                                                        />
                                                    </InputOTPGroup>
                                                </InputOTP>
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
                                className="flex flex-row justify-between items-center"
                            >
                                <p className="flex flex-row gap-2 items-center text-sm text-secondary">
                                    <Clock size={15} /> Code expires in {mm}:{ss}
                                </p>

                                <Button
                                    disabled={resendTimer > 0}
                                    className="text-sm font-extrabold text-brand-orange"
                                >
                                    Resend code
                                </Button>
                            </motion.div>

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
                        </FieldGroup>
                    </form>
                </div>

                <motion.div variants={itemVariants} className="mt-5">
                    <Card>
                        <CardContent className="flex flex-row gap-2 text-xs text-secondary">
                            <Info size={23} />{" "}
                            <p>
                                Can't find it? Check your spam folder. You can
                                request a new code for up to 20 minutes after
                                signing up.
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </MotionConfig>
    );
}
