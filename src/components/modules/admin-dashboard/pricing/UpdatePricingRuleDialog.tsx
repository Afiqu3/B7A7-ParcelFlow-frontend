"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import type { PricingRule } from "@/types";
import PricingRuleForm from "./PricingRuleForm";

/** Update dialog hosting the shared rule form, keyed per rule. */
export default function UpdatePricingRuleDialog({
    rule,
    onClose,
}: {
    rule: PricingRule | null;
    onClose: () => void;
}) {
    return (
        <Dialog
            open={rule !== null}
            onOpenChange={(open) => {
                if (!open) onClose();
            }}
        >
            <DialogContent className="max-h-[85svh] overflow-y-auto p-5 sm:max-w-2xl sm:p-6">
                {rule ? (
                    <>
                        <DialogHeader>
                            <DialogTitle className="font-heading text-base font-extrabold tracking-tight">
                                Update pricing rule
                            </DialogTitle>
                            <DialogDescription>
                                Editing{" "}
                                <span className="font-semibold">
                                    {rule.name}
                                </span>
                                . Changes take effect on new bookings.
                            </DialogDescription>
                        </DialogHeader>
                        <PricingRuleForm
                            key={rule.id}
                            rule={rule}
                            onSuccess={onClose}
                        />
                    </>
                ) : null}
            </DialogContent>
        </Dialog>
    );
}
