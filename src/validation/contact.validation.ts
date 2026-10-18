import z from "zod";
import { BD_PHONE_REGEX } from "./auth.validation";

/** Topics a contact message can be routed to. Drives the form's chips. */
export const CONTACT_TOPICS = [
  "Merchant support",
  "Billing & payouts",
  "Rider support",
  "Partnership",
  "Something else",
] as const;

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please tell us your name")
    .max(60, "That name looks a little too long"),
  email: z.email("Enter a valid email so we can reply"),
  phone: z
    .string()
    .trim()
    .pipe(
      z.union([
        z.literal(""),
        z.string().regex(BD_PHONE_REGEX, "Enter a valid Bangladeshi number"),
      ]),
    ),
  topic: z.enum(CONTACT_TOPICS, {
    error: "Pick a topic so we can route this to the right team",
  }),
  message: z
    .string()
    .trim()
    .min(20, "Give us at least 20 characters so we can help properly")
    .max(1200, "Please keep it under 1,200 characters"),
});
