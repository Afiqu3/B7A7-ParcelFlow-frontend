import Logo from "@/assets/svg/Logo";
import ApplyRiderForm from "@/components/form/apply-rider-form";
import LeftSide from "@/components/modules/authentication/LeftSide";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Apply Rider-ParcelFlow",
};

export default function ApplyRiderPage() {
    return (
        <div className="grid min-h-svh lg:grid-cols-5">
            <div className="lg:block bg-brand p-6 md:p-10 hidden col-span-2">
                <LeftSide
                    headingTextOne="Ride with"
                    headingTextTwo="ParcelFlow."
                    descriptionText="Pick up and deliver parcels in your area. Our team reviews every application."
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
                    <ApplyRiderForm />
                </div>
            </div>
        </div>
    );
}
