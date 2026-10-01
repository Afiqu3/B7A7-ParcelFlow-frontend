"use client";

import Link from "next/link";
import GoogleLoginComponent from "../modules/authentication/GoogleLogin";
import PasswordStrength from "../modules/authentication/PasswordStrength";
import { Marker, MarkerContent } from "../ui/marker";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { useForm } from "@tanstack/react-form";
import { Input } from "../ui/input";
import { useState } from "react";
import { ArrowRight, Eye, EyeClosed } from "lucide-react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { Button } from "../ui/button";
import { useRegistration } from "@/hooks";
import { Spinner } from "../ui/spinner";
import { useRouter } from "next/navigation";
import { merchantRegistrationSchema } from "@/validation";
import z from "zod";
import { toast } from "sonner";
import { FetchError } from "ofetch";
import {
  containerVariants,
  errorMotion,
  iconSwapMotion,
  itemVariants,
  labelSwapMotion,
  useShake,
} from "./form-motion";

export default function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formScope, shakeForm] = useShake<HTMLFormElement>();

  const { mutate: registration, isPending: registerPending } =
    useRegistration();

  type MerchantDefaultValues = z.infer<typeof merchantRegistrationSchema>;

  const defaultValues: MerchantDefaultValues = {
    name: "",
    email: "",
    businessName: "",
    phone: "",
    password: "",
  };

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: merchantRegistrationSchema,
    },
    onSubmitInvalid: () => {
      shakeForm();
    },

    onSubmit: async ({ value }) => {
      const businessName = value.businessName.trim();
      
      const registrationData = {
        name: value.name,
        email: value.email,
        password: value.password,
        merchantProfile: {
          phone: value.phone,
          ...(businessName && { businessName }),
        },
      };

      registration(registrationData, {
        onSuccess: (res) => {
          if (!res.success) {
            toast.error("Server Failure", {
              description: "Something went wrong. Please try again",
            });
          }

          toast.success("Registration Successful", {
            description: "Please verify your account",
          });
          const params = new URLSearchParams({
            email: registrationData.email,
          });
          router.push(`/register/verify-account?${params.toString()}`);
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
          <motion.div variants={itemVariants} className="flex flex-col gap-2">
            <h1 className="text-4xl font-extrabold font-heading tracking-tight text-secondary">
              Create your merchant account
            </h1>
            <p className="text-balance text-sm text-secondary/80">
              Already have an account?{" "}
              <Link
                href={"/login"}
                className="text-chart-3 font-bold font-heading underline hover:underline"
              >
                Log in
              </Link>
            </p>
          </motion.div>

          {/* empty:hidden collapses the slot when Google sign-in is disabled. */}
          <motion.div variants={itemVariants} className="empty:hidden">
            <GoogleLoginComponent text="signup_with" />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Marker variant="separator">
              <MarkerContent>or sign up with email</MarkerContent>
            </Marker>
          </motion.div>

          <form
            ref={formScope}
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <motion.div
                variants={itemVariants}
                className="grid gap-5 sm:grid-cols-2"
              >
                <form.Field name="name">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel
                          htmlFor={field.name}
                          className="text-secondary font-heading font-bold"
                        >
                          Name
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          value={field.state.value}
                          aria-invalid={isInvalid}
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
                              <FieldError errors={field.state.meta.errors} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Field>
                    );
                  }}
                </form.Field>

                <form.Field name="businessName">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel
                          htmlFor={field.name}
                          className="text-secondary font-heading font-bold"
                        >
                          Business Name{" "}
                          <span className="text-brand/40">(optional)</span>
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          value={field.state.value}
                          aria-invalid={isInvalid}
                          placeholder="Your shop or brand"
                          className="border-2 border-gray-400"
                        />
                        <AnimatePresence>
                          {isInvalid && (
                            <motion.div
                              key={`${field.name}-error`}
                              {...errorMotion}
                              className="overflow-hidden"
                            >
                              <FieldError errors={field.state.meta.errors} />
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
                <form.Field name="email">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
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
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          value={field.state.value}
                          aria-invalid={isInvalid}
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
                              <FieldError errors={field.state.meta.errors} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Field>
                    );
                  }}
                </form.Field>

                <form.Field name="phone">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel
                          htmlFor={field.name}
                          className="text-secondary font-heading font-bold"
                        >
                          Phone
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          value={field.state.value}
                          aria-invalid={isInvalid}
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
                              <FieldError errors={field.state.meta.errors} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Field>
                    );
                  }}
                </form.Field>
              </motion.div>

              <form.Field name="password">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <motion.div variants={itemVariants}>
                      <Field data-invalid={isInvalid}>
                        <FieldLabel
                          htmlFor={field.name}
                          className="text-secondary font-heading font-bold"
                        >
                          Password
                        </FieldLabel>
                        <div className="relative">
                          <Input
                            id={field.name}
                            name={field.name}
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            value={field.state.value}
                            placeholder="Create a strong password"
                            className="border-2 border-gray-400 pr-10"
                            aria-invalid={isInvalid}
                            aria-describedby="password-requirements"
                          />
                          <button
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                            type="button"
                            aria-label={
                              showPassword ? "Hide password" : "Show password"
                            }
                            aria-pressed={showPassword}
                            onClick={() => setShowPassword((prev) => !prev)}
                          >
                            <AnimatePresence initial={false} mode="wait">
                              <motion.span
                                key={showPassword ? "hide" : "show"}
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
                          {isInvalid && !field.state.value && (
                            <motion.div
                              key="password-error"
                              {...errorMotion}
                              className="overflow-hidden"
                            >
                              <FieldError>Password is required</FieldError>
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

              <motion.div variants={itemVariants} className="flex flex-col">
                <Button
                  className="relative overflow-hidden bg-chart-2 text-secondary font-heading font-bold py-5 hover:bg-chart-3"
                  disabled={registerPending}
                  type="submit"
                >
                  <AnimatePresence initial={false} mode="popLayout">
                    {registerPending ? (
                      <motion.span
                        key="pending"
                        {...labelSwapMotion}
                        className="inline-flex items-center gap-1.5"
                      >
                        <Spinner /> Creating
                      </motion.span>
                    ) : (
                      <motion.span
                        key="idle"
                        {...labelSwapMotion}
                        className="inline-flex items-center gap-1.5"
                      >
                        Create account
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
          className="mt-2 text-xs text-secondary"
        >
          <p>
            We'll email you a 6-digit code to verify your address.By creating an
            account you agree to the Terms and Privacy Policy.
          </p>
        </motion.div>
      </motion.div>
    </MotionConfig>
  );
}
