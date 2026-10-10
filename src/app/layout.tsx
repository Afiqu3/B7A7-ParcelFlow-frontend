import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import Providers from "@/providers";

const instrumentSansHeading = Instrument_Sans({
    subsets: ["latin"],
    variable: "--font-heading",
});

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "ParcelFlow",
    description:
        "Courier and payments for Bangladeshi merchants — book pickups, pay with bKash or cash on delivery, and track every parcel.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html
            lang="en"
            className={cn(
                "h-full",
                "antialiased",
                geistSans.variable,
                geistMono.variable,
                instrumentSansHeading.variable,
            )}
            suppressHydrationWarning={true}
        >
            <body
                className="min-h-full flex flex-col"
                suppressHydrationWarning={true}
            >
                <Providers>
                    {children}
                    <Toaster />
                </Providers>
            </body>
        </html>
    );
}
