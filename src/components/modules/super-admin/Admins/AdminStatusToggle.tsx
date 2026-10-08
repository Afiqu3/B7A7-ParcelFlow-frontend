"use client";

import { AnimatePresence, motion } from "motion/react";
import { Ban, CheckCircle2, Loader2, Repeat2, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { FetchError } from "ofetch";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
} from "@/components/ui/dialog";
import { useToggleAdminUserStatus } from "@/hooks";
import { cn } from "@/lib/utils";
import type { Admin } from "@/types";

type ToggleIntent = "block" | "unblock" | "switch";

function intentFor(status: Admin["status"]): ToggleIntent {
    if (status === "ACTIVE") return "block";
    if (status === "BLOCKED") return "unblock";
    return "switch";
}

const intentCopy: Record<
    ToggleIntent,
    { title: string; body: string; confirm: string }
> = {
    block: {
        title: "Block this admin?",
        body: "Their account status will change to blocked.",
        confirm: "Block admin",
    },
    unblock: {
        title: "Unblock this admin?",
        body: "Their account status will change to active.",
        confirm: "Unblock admin",
    },
    switch: {
        title: "Change this admin's status?",
        body: "Their account status will be toggled.",
        confirm: "Change status",
    },
};

/** Status toggle button + confirm dialog for one admin row. */
export default function AdminStatusToggle({ admin }: { admin: Admin }) {
    const [confirming, setConfirming] = useState(false);
    const { mutate: toggle, isPending } = useToggleAdminUserStatus(admin.id);

    const intent = intentFor(admin.status);
    const copy = intentCopy[intent];

    const close = () => {
        if (isPending) return;
        setConfirming(false);
    };

    const confirm = () =>
        toggle(undefined, {
            onSuccess: (res) => {
                if (
                    res &&
                    typeof res === "object" &&
                    "success" in res &&
                    !res.success
                ) {
                    toast.error("Could not update status", {
                        description:
                            "Something went wrong. Please try again.",
                    });
                    return;
                }
                toast.success(
                    intent === "block"
                        ? "Admin blocked"
                        : intent === "unblock"
                          ? "Admin unblocked"
                          : "Status updated",
                    { description: admin.name },
                );
                setConfirming(false);
            },
            onError: (err: FetchError) => {
                toast.error("Could not update status", {
                    description:
                        err.data?.message ||
                        err.message ||
                        "Something went wrong. Please try again.",
                });
            },
        });

    return (
        <>
            <button
                type="button"
                onClick={() => setConfirming(true)}
                title={
                    intent === "block"
                        ? `Block ${admin.name}`
                        : intent === "unblock"
                          ? `Unblock ${admin.name}`
                          : `Change status of ${admin.name}`
                }
                aria-label={
                    intent === "block"
                        ? `Block ${admin.name}`
                        : intent === "unblock"
                          ? `Unblock ${admin.name}`
                          : `Change status of ${admin.name}`
                }
                className={cn(
                    "grid size-9 place-items-center rounded-xl outline-none transition-all focus-visible:ring-2 focus-visible:ring-brand-orange/50 active:scale-95",
                    intent === "block" &&
                        "text-amber-700 hover:bg-amber-500/10",
                    intent === "unblock" &&
                        "text-emerald-700 hover:bg-emerald-600/10",
                    intent === "switch" &&
                        "text-secondary/60 hover:bg-secondary/8 hover:text-secondary",
                )}
            >
                {intent === "block" ? (
                    <Ban className="size-4" strokeWidth={2.25} />
                ) : intent === "unblock" ? (
                    <CheckCircle2 className="size-4" strokeWidth={2.25} />
                ) : (
                    <Repeat2 className="size-4" strokeWidth={2.25} />
                )}
            </button>

            <Dialog
                open={confirming}
                onOpenChange={(open) => {
                    if (!open) close();
                }}
            >
                <DialogContent className="p-5 sm:max-w-md sm:p-6">
                    <div className="flex items-start gap-3">
                        <span
                            className={cn(
                                "grid size-11 shrink-0 place-items-center rounded-xl ring-1 ring-inset",
                                intent === "block"
                                    ? "bg-amber-500/10 text-amber-700 ring-amber-600/25"
                                    : intent === "unblock"
                                      ? "bg-emerald-600/10 text-emerald-700 ring-emerald-600/20"
                                      : "bg-secondary/8 text-secondary ring-secondary/15",
                            )}
                        >
                            <TriangleAlert
                                className="size-5"
                                strokeWidth={2.25}
                            />
                        </span>
                        <div className="min-w-0">
                            <DialogTitle className="font-heading text-base font-extrabold tracking-tight">
                                {copy.title}
                            </DialogTitle>
                            <DialogDescription className="mt-1">
                                <span className="font-semibold">
                                    {admin.name}
                                </span>{" "}
                                · {copy.body}
                            </DialogDescription>
                        </div>
                    </div>

                    <DialogFooter
                        showCloseButton={false}
                        className="gap-2.5"
                    >
                        <Button
                            type="button"
                            variant="outline"
                            disabled={isPending}
                            onClick={close}
                            className="h-10 rounded-xl border-secondary/15 font-heading text-sm font-bold text-secondary hover:bg-secondary/5 hover:text-secondary"
                        >
                            Keep as is
                        </Button>
                        <Button
                            type="button"
                            disabled={isPending}
                            onClick={confirm}
                            className={cn(
                                "h-10 rounded-xl px-5 font-heading text-sm font-bold text-white transition active:scale-[0.99] disabled:opacity-70",
                                intent === "unblock"
                                    ? "bg-emerald-700 hover:brightness-110"
                                    : intent === "block"
                                      ? "bg-amber-600 hover:brightness-110"
                                      : "bg-brand hover:brightness-125",
                            )}
                        >
                            <AnimatePresence initial={false} mode="popLayout">
                                {isPending ? (
                                    <motion.span
                                        key="pending"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="inline-flex items-center gap-2"
                                    >
                                        <Loader2 className="size-4 animate-spin" />
                                        Updating…
                                    </motion.span>
                                ) : (
                                    <motion.span
                                        key="idle"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="inline-flex items-center gap-2"
                                    >
                                        {copy.confirm}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
