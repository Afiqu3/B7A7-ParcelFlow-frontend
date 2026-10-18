import type { Metadata } from "next";
import Contact from "@/components/modules/contact/Contact";
import SupportAside from "@/components/modules/contact/SupportAside";
import CtaLink from "@/components/modules/landing/CtaLink";
import FinalCta from "@/components/modules/landing/FinalCta";
import PageHero from "@/components/shared/PageHero";
import { SECTION_IDS, SUPPORT } from "@/constants";

export const metadata: Metadata = {
  title: "Contact — ParcelFlow",
  description:
    "Questions about pricing, delivery, payouts or riding with ParcelFlow? Send a message — we reply within 12 hours on average.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        headingId="contact-heading"
        eyebrow="Contact us"
        lines={[
          { text: "Questions, feedback," },
          { text: "or a big idea?", accent: true },
        ]}
        description={
          <p>
            Whether you ship one parcel a week or a thousand, we want to hear
            from you. Send a message and the right person on our team will get
            back to you.
          </p>
        }
        actions={
          <>
            <CtaLink href={`#${SECTION_IDS.contactForm}`} arrow>
              Send a message
            </CtaLink>
            <CtaLink href={`mailto:${SUPPORT.email}`} variant="outline">
              Email support
            </CtaLink>
          </>
        }
        aside={<SupportAside />}
      />
      <Contact />
      <FinalCta />
    </>
  );
}
