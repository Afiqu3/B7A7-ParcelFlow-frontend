import {
  ArrowUpRight,
  type LucideIcon,
  Mail,
  Phone,
  Share2,
} from "lucide-react";
import { SOCIAL_ICONS } from "@/assets/svg/SocialIcons";
import { Container, Eyebrow } from "@/components/modules/landing/decor";
import {
  Reveal,
  RevealGroup,
  RevealItem,
} from "@/components/modules/landing/motion";
import { SOCIAL_LINKS, SUPPORT } from "@/constants";

type Channel = {
  title: string;
  body: string;
  icon: LucideIcon;
  /** Headline link (mailto:, tel: …). The social card has none. */
  value?: { text: string; href: string };
  note?: string;
};

const CHANNELS: Channel[] = [
  {
    title: "Email us",
    body: "The best place for order issues, claims and account questions — attach anything useful.",
    icon: Mail,
    value: { text: SUPPORT.email, href: `mailto:${SUPPORT.email}` },
    note: "Replies within 12 hours on average.",
  },
  {
    title: "Call the hotline",
    body: "For urgent deliveries and pickups that can’t wait for an email to be answered.",
    icon: Phone,
    value: {
      text: SUPPORT.phone,
      href: `tel:${SUPPORT.phone.replace(/\s+/g, "")}`,
    },
    note: "Saturday–Thursday, 9 am–7 pm.",
  },
  {
    title: "Follow along",
    body: "Product updates, delivery stories and rider spotlights, posted as they happen.",
    icon: Share2,
  },
];

/** Contact options below the hero: email, phone and social channels. */
export default function ContactChannels() {
  return (
    <section
      aria-labelledby="contact-channels-heading"
      className="bg-accent py-20 sm:py-24"
    >
      <Container>
        <Reveal>
          <div className="max-w-3xl">
            <Eyebrow>Reach us</Eyebrow>
            <h2
              id="contact-channels-heading"
              className="mt-4 font-heading text-4xl leading-[1.02] font-bold tracking-[-0.04em] text-secondary sm:text-5xl"
            >
              Pick the channel
              <br />
              <span className="text-brand-orange">that suits you.</span>
            </h2>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-secondary/70">
              Merchants, riders and partners all reach the same team — choose
              whatever is easiest for you.
            </p>
          </div>
        </Reveal>

        <RevealGroup
          className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
          interval={0.1}
        >
          {CHANNELS.map((channel) => (
            <RevealItem key={channel.title}>
              <article className="group flex h-full flex-col rounded-3xl bg-white p-6 ring-1 ring-secondary/10 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgba(15,32,86,0.35)] hover:ring-brand-orange/30 sm:p-7 dark:bg-card dark:ring-white/10 dark:hover:shadow-[0_24px_48px_-24px_rgba(0,0,0,0.8)]">
                <span className="grid size-12 place-items-center rounded-xl bg-brand-orange text-brand-ink">
                  <channel.icon
                    aria-hidden
                    className="size-5.5"
                    strokeWidth={2.25}
                  />
                </span>
                <h3 className="mt-5 font-heading text-xl font-bold tracking-tight text-secondary">
                  {channel.title}
                </h3>

                {channel.value ? (
                  <a
                    href={channel.value.href}
                    className="mt-2 inline-flex w-fit max-w-full items-center gap-1.5 rounded-sm font-heading text-[15px] font-bold break-all text-brand-orange-ink underline-offset-4 outline-none transition-colors hover:text-brand-orange hover:underline focus-visible:ring-3 focus-visible:ring-brand-orange/40"
                  >
                    {channel.value.text}
                    <ArrowUpRight
                      aria-hidden
                      className="size-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      strokeWidth={2.5}
                    />
                  </a>
                ) : null}

                <p className="mt-3 text-[15px] leading-relaxed text-secondary/70">
                  {channel.body}
                </p>

                {channel.note ? (
                  <p className="mt-auto pt-5 text-sm text-secondary/55">
                    {channel.note}
                  </p>
                ) : (
                  <ul className="mt-auto flex gap-2 pt-5">
                    {SOCIAL_LINKS.map(({ platform, label, href }) => {
                      const Icon = SOCIAL_ICONS[platform];
                      return (
                        <li key={platform}>
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${label} (opens in a new tab)`}
                            title={label}
                            className="grid size-10 place-items-center rounded-full bg-accent text-secondary/70 ring-1 ring-secondary/10 outline-none transition-[background-color,color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-brand-orange hover:text-brand-ink hover:ring-brand-orange focus-visible:ring-3 focus-visible:ring-brand-orange/50"
                          >
                            <Icon className="size-4.5" />
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
