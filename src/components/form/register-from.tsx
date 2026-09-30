"use client";

import Link from "next/link";
import GoogleLoginComponent from "../modules/authentication/GoogleLogin";
import { Marker, MarkerContent } from "../ui/marker";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { useForm } from "@tanstack/react-form";
import { Input } from "../ui/input";
import { useState } from "react";
import { ArrowRight, Eye, EyeClosed } from "lucide-react";
import { Button } from "../ui/button";
import { useRegistration } from "@/hooks";
import { Spinner } from "../ui/spinner";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: registration, isPending: registerPending } =
    useRegistration();

  const form = useForm({
    defaultValues: {
      name: "",
      businessName: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  return (
    <div>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
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
        </div>

        <GoogleLoginComponent text="signup_with" />

        <Marker variant="separator">
          <MarkerContent>or sign up with email</MarkerContent>
        </Marker>

        <FieldGroup>
          <div className="grid gap-5 sm:grid-cols-2">
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
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
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
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
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
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
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
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
          </div>

          <form.Field name="password">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
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
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      value={field.state.value}
                      placeholder="Enter your password"
                      className="border-2 border-gray-400"
                      aria-invalid={isInvalid}
                    />
                    <button
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? (
                        <EyeClosed className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <Button
            className="relative overflow-hidden bg-chart-2 text-secondary font-heading font-bold py-5 hover:bg-chart-3"
            disabled={registerPending}
            type="submit"
          >
            {registerPending ? (
              <span key="pending" className="inline-flex items-center gap-1.5">
                <Spinner /> Creating
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5">
                Create account
                <ArrowRight className="transition-transform duration-200 group-hover/button:translate-x-1" />
              </span>
            )}
          </Button>
        </FieldGroup>
      </div>

      <div className="mt-2 text-xs text-secondary">
        <p>We'll email you a 6-digit code to verify your address.By creating an account you agree to the Terms and Privacy Policy.</p>
      </div>
    </div>
  );
}
