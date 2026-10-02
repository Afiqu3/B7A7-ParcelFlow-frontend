// The four merchant steps. Shared by the hero's step index and the
// timeline so their titles can't drift apart.

export type MerchantStepId =
  | "step-create"
  | "step-pay"
  | "step-pickup"
  | "step-deliver";

export const MERCHANT_STEPS: {
  id: MerchantStepId;
  title: string;
  /** One-liner for the hero's step index. */
  short: string;
  body: string;
}[] = [
  {
    id: "step-create",
    title: "Create a parcel",
    short: "Your price shows instantly",
    body: "Enter pickup and delivery details. Your price appears instantly, worked out from weight, zone and speed.",
  },
  {
    id: "step-pay",
    title: "Pay your way",
    short: "bKash or cash on delivery",
    body: "Prepay with bKash, or choose cash on delivery and we collect from your customer at the door.",
  },
  {
    id: "step-pickup",
    title: "We pick it up",
    short: "Rider pickup or hub drop-off",
    body: "A rider collects from your address — or drop it at our hub yourself and skip the pickup charge.",
  },
  {
    id: "step-deliver",
    title: "Delivered & tracked",
    short: "Tracked live, up to 3 attempts",
    body: "Follow every status change live. If nobody’s home, we try again — up to 3 attempts.",
  },
];
