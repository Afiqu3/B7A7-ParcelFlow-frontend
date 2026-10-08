import CreateAdminForm from "@/components/form/create-admin-from";
import { KeyRound, MailCheck, UserRoundPlus } from "lucide-react";

const tips = [
    {
        icon: MailCheck,
        title: "Double-check the email",
        body: "The login email is the account identity — typos lock people out.",
    },
    {
        icon: KeyRound,
        title: "Strong, unique password",
        body: "Admin accounts guard every merchant, rider and parcel.",
    },
];

export default function CreateAdminPage() {
    return (
        <div className="flex flex-col gap-5 sm:gap-6">
            {/* Page header */}
            <div className="flex flex-col gap-3 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                    <p className="inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1 font-heading text-[11px] font-bold tracking-[0.14em] text-white uppercase">
                        <UserRoundPlus
                            className="size-3.5 text-brand-orange"
                            strokeWidth={2.5}
                        />
                        Configuration · Create admin
                    </p>
                    <h1 className="mt-2.5 font-heading text-2xl font-extrabold tracking-tight text-balance text-secondary sm:text-[28px] sm:leading-[1.15]">
                        Create admin
                    </h1>
                    <p className="mt-1.5 max-w-xl text-sm text-pretty text-secondary/70">
                        Grant dashboard access to a teammate — they&apos;ll
                        sign in with these credentials.
                    </p>
                </div>
            </div>

            {/* Content grid: form + side tips */}
            <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
                <div
                    className="min-w-0 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 motion-safe:fill-mode-backwards"
                    style={{ animationDelay: "80ms" }}
                >
                    <CreateAdminForm />
                </div>

                <aside className="flex min-w-0 flex-col gap-5">
                    {/* Navy tips card */}
                    <div
                        className="relative overflow-hidden rounded-2xl bg-brand p-5 text-white ring-1 ring-white/10 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 motion-safe:fill-mode-backwards sm:p-6"
                        style={{ animationDelay: "140ms" }}
                    >
                        <div
                            aria-hidden
                            className="pointer-events-none absolute -top-16 -right-16 size-44 rounded-full bg-brand-orange/30 blur-3xl"
                        />
                        <div
                            aria-hidden
                            className="pointer-events-none absolute -bottom-20 -left-10 size-44 rounded-full bg-white/10 blur-3xl"
                        />
                        <div className="relative">
                            <h2 className="font-heading text-base font-extrabold tracking-tight">
                                Handle with care
                            </h2>
                            <p className="mt-1 text-[13px] leading-relaxed text-white/70">
                                Admin accounts carry full responsibility.
                            </p>
                            <ul className="mt-4 flex flex-col gap-3">
                                {tips.map((tip) => (
                                    <li
                                        key={tip.title}
                                        className="flex items-start gap-3 rounded-xl bg-white/6 px-3 py-2.5 ring-1 ring-white/10 ring-inset transition-colors hover:bg-white/10"
                                    >
                                        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-orange/15 text-brand-orange ring-1 ring-brand-orange/25 ring-inset">
                                            <tip.icon
                                                className="size-4"
                                                strokeWidth={2.25}
                                            />
                                        </span>
                                        <span className="min-w-0">
                                            <span className="block font-heading text-[13px] font-bold">
                                                {tip.title}
                                            </span>
                                            <span className="block text-xs leading-relaxed text-white/65">
                                                {tip.body}
                                            </span>
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
