"use client";

import { useLogin } from "@/hooks";
import { useForm } from "@tanstack/react-form";
import { ArrowRight, Eye, EyeClosed } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
// import GoogleLoginComponent from "../modules/google-login/GoogleLogin";
import { Button } from "../ui/button";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "../ui/field";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";
import Link from "next/link";
import { loginSchema } from "@/validation";
import { Marker, MarkerContent } from "../ui/marker";

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const { mutate: login, isPending: loginPending } = useLogin();

    const form = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
        validators: {
            onSubmit: loginSchema,
        },
        onSubmit: ({ value }) => {
            const loginData = {
                email: value.email,
                password: value.password,
            };

            login(loginData, {
                onSuccess: (res) => {
                    toast.success("Login Success", {
                        description: "Welcome back",
                    });
                    router.push("/");
                },
                onError: (err) => {
                    toast.error("Authorization failure", {
                        description:
                            err.message ||
                            "Something went wrong. Please try again",
                    });
                },
            });
        },
    });

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-extrabold font-heading tracking-tight text-secondary">
                    Log in
                </h1>
                <p className="text-balance text-sm text-secondary/80">
                    Merchants, riders and admins all sign in here.
                </p>
            </div>

            <form
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
                                            field.handleChange(e.target.value)
                                        }
                                        onBlur={field.handleBlur}
                                        value={field.state.value}
                                        aria-invalid={isInvalid}
                                        className="border-2 border-gray-400"
                                    />
                                    {isInvalid && (
                                        <FieldError
                                            errors={field.state.meta.errors}
                                        />
                                    )}
                                </Field>
                            );
                        }}
                    </form.Field>

                    <form.Field name="password">
                        {(field) => {
                            const isInvalid =
                                field.state.meta.isTouched &&
                                !field.state.meta.isValid;

                            return (
                                <Field data-invalid={isInvalid}>
                                    <div className="flex items-center">
                                        <FieldLabel
                                            htmlFor={field.name}
                                            className="text-secondary font-heading font-bold"
                                        >
                                            Password
                                        </FieldLabel>
                                        <Link
                                            href="#"
                                            className="ml-auto text-chart-3 font-bold font-heading text-sm underline hover:underline"
                                        >
                                            Forgot password?
                                        </Link>
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
                                            onBlur={field.handleBlur}
                                            value={field.state.value}
                                            className="border-2 border-gray-400"
                                            aria-invalid={isInvalid}
                                        />
                                        <button
                                            className="absolute right-3 top-1/2 -translate-y-1/2"
                                            type="button"
                                            onClick={() =>
                                                setShowPassword((prev) => !prev)
                                            }
                                        >
                                            {showPassword ? (
                                                <EyeClosed className="size-4" />
                                            ) : (
                                                <Eye className="size-4" />
                                            )}
                                        </button>
                                    </div>
                                    {isInvalid && (
                                        <FieldError
                                            errors={field.state.meta.errors}
                                        />
                                    )}
                                </Field>
                            );
                        }}
                    </form.Field>

                    <Button
                        className="bg-chart-3 text-secondary font-heading font-bold py-5 hover:bg-chart-2"
                        disabled={loginPending}
                        type="submit"
                    >
                        {loginPending ? (
                            <>
                                <Spinner /> Logging
                            </>
                        ) : (
                            <>
                                Log in
                                <ArrowRight />
                            </>
                        )}
                    </Button>
                </FieldGroup>
            </form>

            <Marker variant="separator">
                <MarkerContent>or</MarkerContent>
            </Marker>

            {/* <GoogleLoginComponent /> */}

            <div className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link
                    href="/register"
                    className="font-medium underline underline-offset-4 hover:text-primary"
                >
                    Register
                </Link>
            </div>
        </div>
    );
}
