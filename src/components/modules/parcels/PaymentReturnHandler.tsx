"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { ROUTES } from "@/constants";

/**
 * Handles the bKash return redirect (`/dashboard/parcels?status=success`
 * or `?status=failure`): shows the matching toast once, then drops the
 * query param so refresh/back never re-toasts. Renders nothing.
 */
export default function PaymentReturnHandler() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const handledRef = useRef(false);

    useEffect(() => {
        if (handledRef.current) return;
        const status = searchParams.get("status");
        if (status !== "success" && status !== "failure") return;
        handledRef.current = true;

        if (status === "success") {
            toast.success("Payment successful", {
                description: "Your parcel payment is confirmed.",
            });
        } else {
            toast.error("Payment failed", {
                description:
                    "The payment didn't go through — your parcel is still booked. Please try Pay now again.",
            });
        }

        router.replace(ROUTES.parcels, { scroll: false });
    }, [searchParams, router]);

    return null;
}
