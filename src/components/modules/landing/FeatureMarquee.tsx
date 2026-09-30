import { Sparkle } from "./decor";

const ITEMS = [
  "bKash checkout",
  "Cash on delivery",
  "Doorstep pickup",
  "PDF invoices",
  "Live parcel status",
];

// Each half holds the list twice so it's always wider than the screen;
// the track slides by exactly one half for a seamless loop.
const HALF = [...ITEMS, ...ITEMS];

export default function FeatureMarquee() {
  return (
    <section
      aria-label="What ParcelFlow includes"
      className="overflow-hidden bg-brand-orange py-5 text-brand-ink sm:py-6"
    >
      <div className="flex w-max hover:paused motion-safe:animate-marquee motion-reduce:w-full motion-reduce:justify-center">
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy === 1 ? true : undefined}
            className={
              copy === 1
                ? "flex shrink-0 items-center motion-reduce:hidden"
                : "flex shrink-0 items-center motion-reduce:w-full motion-reduce:shrink motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-2 motion-reduce:px-5"
            }
          >
            {HALF.map((item, i) => (
              <li
                // biome-ignore lint/suspicious/noArrayIndexKey: list repeats by design
                key={`${item}-${i}`}
                aria-hidden={i >= ITEMS.length ? true : undefined}
                className={
                  i >= ITEMS.length
                    ? "flex items-center gap-8 pr-8 font-heading text-xl font-bold tracking-tight whitespace-nowrap motion-reduce:hidden sm:gap-10 sm:pr-10 sm:text-2xl"
                    : "flex items-center gap-8 pr-8 font-heading text-xl font-bold tracking-tight whitespace-nowrap sm:gap-10 sm:pr-10 sm:text-2xl"
                }
              >
                {item}
                <Sparkle className="size-3.5 sm:size-4" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}
