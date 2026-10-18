import type { Metadata } from "next";
import AboutUs from "@/components/modules/landing/AboutUs";
import FeatureMarquee from "@/components/modules/landing/FeatureMarquee";
import Features from "@/components/modules/landing/Features";
import FinalCta from "@/components/modules/landing/FinalCta";
import Hero from "@/components/modules/landing/Hero";
import HowItWorks from "@/components/modules/landing/HowItWorks";
import RideWithUs from "@/components/modules/landing/RideWithUs";
import WhyChooseUs from "@/components/modules/landing/WhyChooseUs";
import FAQ from "@/components/modules/landing/FAQ";

export const metadata: Metadata = {
    title: {
        absolute: "ParcelFlow — Courier & payments for Bangladeshi merchants",
    },
    description:
        "Book a pickup, prepay with bKash or collect cash on delivery, and follow every parcel from your door to your customer's.",
};

export default function HomePage() {
    return (
        <>
            <Hero />
            <FeatureMarquee />
            <AboutUs />
            <HowItWorks />
            <Features />
            <RideWithUs />
            <WhyChooseUs />
            <FAQ />
            <FinalCta />
        </>
    );
}
