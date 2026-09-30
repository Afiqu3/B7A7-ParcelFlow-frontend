import Link from "next/link";
import { SOCIAL_ICONS } from "@/assets/svg/SocialIcons";
import BrandMark from "@/components/shared/BrandMark";
import { ROUTES, SOCIAL_LINKS, SUPPORT } from "@/constants";

const LINK_GROUPS = [
  {
    title: "Merchants",
    links: [
      { label: "Create account", href: ROUTES.register },
      { label: "Log in", href: ROUTES.login },
      { label: "Pricing", href: ROUTES.pricing },
    ],
  },
  {
    title: "Riders",
    links: [
      { label: "Apply to ride", href: ROUTES.riderApply },
      { label: "Rider log in", href: ROUTES.login },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: ROUTES.about },
      { label: "Contact", href: ROUTES.contact },
      { label: "Terms", href: ROUTES.terms },
      { label: "Privacy", href: ROUTES.privacy },
    ],
  },
];

const linkClass =
  "rounded-sm text-[15px] text-brand-muted outline-none transition-colors hover:text-white focus-visible:ring-3 focus-visible:ring-brand-orange/50";

export default function Footer() {
  return (
    <footer className="bg-brand-deep text-brand-muted">
      <div className="mx-auto w-full max-w-6xl px-5 pt-16 pb-8 sm:px-8 sm:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr] lg:gap-10">
          <div>
            <BrandMark />
            <p className="mt-5 max-w-xs text-[15px] leading-relaxed">
              Courier and payments for merchants across Bangladesh.
            </p>
            <address className="mt-5 flex flex-col items-start gap-1 not-italic">
              <a href={`mailto:${SUPPORT.email}`} className={linkClass}>
                {SUPPORT.email}
              </a>
              <a href={`tel:${SUPPORT.phone}`} className={linkClass}>
                {SUPPORT.phone}
              </a>
            </address>

            <ul
              aria-label="ParcelFlow on social media"
              className="mt-7 flex flex-wrap gap-2.5"
            >
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
                      className="grid size-10 place-items-center rounded-full bg-white/5 text-brand-muted ring-1 ring-white/10 outline-none transition-[background-color,color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-brand-orange hover:text-brand-ink hover:ring-brand-orange focus-visible:ring-3 focus-visible:ring-brand-orange/60"
                    >
                      <Icon className="size-4.5" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {LINK_GROUPS.map((group) => (
              <nav key={group.title} aria-label={group.title}>
                <h3 className="font-heading text-[13px] font-bold tracking-[0.2em] text-white uppercase">
                  {group.title}
                </h3>
                <ul className="mt-5 flex flex-col items-start gap-3">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className={linkClass}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-white/10 pt-6 text-[13px] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} ParcelFlow</p>
          <p>Online payments via bKash</p>
        </div>
      </div>
    </footer>
  );
}
