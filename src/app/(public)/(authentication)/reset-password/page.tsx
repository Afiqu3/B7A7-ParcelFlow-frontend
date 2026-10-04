import Logo from "@/assets/svg/Logo";
import ResetPasswordForm from "@/components/form/reset-password-form";
import LeftSide from "@/components/modules/authentication/LeftSide";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Reset Password-ParcelFlow",
};

export default function ResetPasswordPage() {
    return (
        <div className="grid min-h-svh lg:grid-cols-5">
            <div className="lg:block bg-brand p-6 md:p-10 hidden col-span-2">
                <LeftSide
                    headingTextOne="Almost"
                    headingTextTwo="there."
                    descriptionText="Pick a strong new password and you're back to shipping."
                />
            </div>

            <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-accent col-span-3">
                <div className="flex justify-start w-full ml-8">
                    <Link
                        href="/"
                        className="lg:hidden flex items-center gap-2 mt-10 font-medium group text-start"
                    >
                        <span className="flex size-9 items-center justify-center rounded-xl text-primary-foreground transition-transform duration-300 group-hover:-rotate-6">
                            <Logo />
                        </span>
                        <span className="font-heading text-lg font-bold tracking-tight text-secondary">
                            Parcel<span className="text-chart-2">Flow</span>
                        </span>
                    </Link>
                </div>

                <div className="w-full lg:max-w-xl md:max-w-md max-w-2xs">
                    <Suspense fallback={<p></p>}>
                        <ResetPasswordForm />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
