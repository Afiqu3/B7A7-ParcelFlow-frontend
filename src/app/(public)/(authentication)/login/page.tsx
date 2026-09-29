import DeliveryTrajectory from "@/assets/svg/DeliveryTrajectory";
import Logo from "@/assets/svg/Logo";
import CheckIcon from "@/components/layout/authentication/CheckIcon";
import LeftSide from "@/components/layout/authentication/LeftSide";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Login-ParcelFlow",
};

export default function LoginPage() {
  return (
    <div className="grid min-h-svh grid-cols-5">
      <div className="lg:flex flex-col bg-brand gap-4 p-6 md:p-10 hidden col-span-2">
        <LeftSide headingTextOne="Welcome" headingTextTwo="back." descriptionText="Your parcels, payments and deliveries — right where you left them." />
      </div>

      <div className="relative hidden bg-muted col-span-2"></div>
    </div>
  );
}
