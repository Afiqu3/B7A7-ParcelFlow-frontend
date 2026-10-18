import { MapPin } from "lucide-react";
import { Container, Eyebrow } from "@/components/modules/landing/decor";
import { Reveal } from "@/components/modules/landing/motion";

/** The company story and why ParcelFlow exists. */
export default function OurStory() {
  return (
    <section
      aria-labelledby="about-story-heading"
      className="bg-accent py-20 sm:py-24 lg:py-28"
    >
      <Container className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
        <Reveal amount={0.3}>
          <div className="group relative">
            <div className="overflow-hidden rounded-3xl shadow-[0_28px_56px_-32px_rgba(15,32,86,0.5)] ring-1 ring-secondary/10 dark:ring-white/10 dark:shadow-[0_28px_56px_-32px_rgba(0,0,0,0.85)]">
              {/* biome-ignore lint/performance/noImgElement: static export (output: "export") has no image optimizer; explicit width/height keeps CLS at zero. */}
              <img
                src="/assets/about-us.jpg"
                alt="A delivery van in motion on a tree-lined street"
                width={6240}
                height={4160}
                loading="lazy"
                decoding="async"
                className="aspect-3/2 w-full object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out motion-safe:group-hover:scale-[1.03]"
              />
            </div>

            {/* Floating badge pinned over the photo's bottom edge */}
            <div
              aria-hidden
              className="absolute -bottom-5 left-5 flex items-center gap-3 rounded-2xl bg-white py-3 pr-5 pl-3 shadow-[0_20px_45px_-24px_rgba(15,32,86,0.55)] ring-1 ring-secondary/10 sm:left-7 dark:bg-card dark:ring-white/10 dark:shadow-[0_20px_45px_-24px_rgba(0,0,0,0.85)]"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-orange text-brand-ink">
                <MapPin className="size-5" strokeWidth={2.25} />
              </span>
              <span>
                <span className="block font-heading text-sm font-bold text-secondary">
                  Dhaka to every district
                </span>
                <span className="block text-xs text-secondary/60">
                  Nationwide coverage
                </span>
              </span>
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <Eyebrow>Our story</Eyebrow>
            <h2
              id="about-story-heading"
              className="mt-4 max-w-lg font-heading text-4xl leading-[1.02] font-bold tracking-[-0.04em] text-secondary sm:text-5xl"
            >
              Built in Dhaka, delivering everywhere.
            </h2>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="mt-6 grid max-w-lg gap-4 text-[17px] leading-relaxed text-secondary/70">
              <p>
                ParcelFlow started with a simple frustration: sending a parcel
                across town shouldn’t need a phone call, a guess at the price,
                or a day spent waiting. So we built a courier platform where
                merchants create a parcel, see the exact price before booking,
                and follow it from pickup to the customer’s door.
              </p>
              <p>
                Today our riders move parcels between merchants, hubs and
                doorsteps across Bangladesh — prepaid with bKash or cash on
                delivery, tracked at every handoff, insured, and re-attempted up
                to three times before anything goes back.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.16}>
            <blockquote className="mt-8 max-w-lg rounded-2xl border-l-4 border-brand-orange bg-white p-5 ring-1 ring-secondary/10 dark:bg-card dark:ring-white/10">
              <p className="font-heading text-[17px] font-bold tracking-tight text-secondary">
                “Every parcel is a promise someone is waiting for.”
              </p>
              <footer className="mt-2 text-sm text-secondary/60">
                The ParcelFlow team
              </footer>
            </blockquote>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
