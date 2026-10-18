import type { LucideIcon } from "lucide-react";
import {
  Bike,
  HandCoins,
  KeyRound,
  MailCheck,
  NotebookPen,
  Receipt,
  Store,
  UserCheck,
  UserRound,
  UserRoundPen,
  UserRoundPlus,
  Users,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import CreateAdminForm from "@/components/form/create-admin-from";
import UpdateAdminProfileFrom from "@/components/form/update-admin-profile-from";
import Assignments from "@/components/modules/admin-dashboard/assignments/Assignments";
import AvailableRiders from "@/components/modules/admin-dashboard/available-riders/AvailableRiders";
import Merchants from "@/components/modules/admin-dashboard/merchants/Merchants";
import Pricing from "@/components/modules/admin-dashboard/pricing/Pricing";
import Riders from "@/components/modules/admin-dashboard/riders/Riders";
import Transactions from "@/components/modules/admin-dashboard/transactions/Transactions";
import AdminProfile from "@/components/modules/admin-profile/admin-profile";
import Admins from "@/components/modules/admins/Admins";
import SuperAdmins from "@/components/modules/super-admin/Admins/Admins";
import { ROUTES } from "@/constants";

type DashboardPageProps = {
  eyebrow: string;
  title: string;
  description?: string;
  icon: LucideIcon;
  actions?: ReactNode;
  children: ReactNode;
};

function DashboardPage({
  eyebrow,
  title,
  description,
  icon: Icon,
  actions,
  children,
}: DashboardPageProps) {
  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      <div className="flex flex-col gap-3 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1 font-heading text-[11px] font-bold tracking-[0.14em] text-white uppercase">
            <Icon className="size-3.5 text-brand-orange" strokeWidth={2.5} />
            {eyebrow}
          </p>
          <h1 className="mt-2.5 font-heading text-2xl font-extrabold tracking-tight text-balance text-secondary sm:text-[28px] sm:leading-[1.15]">
            {title}
          </h1>
          {description ? (
            <p className="mt-1.5 max-w-xl text-sm text-pretty text-secondary/70">
              {description}
            </p>
          ) : null}
        </div>
        {actions}
      </div>
      {children}
    </div>
  );
}

export function AdminProfilePage() {
  return (
    <DashboardPage eyebrow="Account · Profile" title="Profile" icon={UserRound}>
      <AdminProfile />
    </DashboardPage>
  );
}

export function UpdateAdminProfilePage({
  dashboardBase,
}: {
  dashboardBase: string;
}) {
  return (
    <DashboardPage
      eyebrow="Account · Update profile"
      title="Update profile"
      description="Keep your display name current across the admin dashboard."
      icon={UserRoundPen}
      actions={
        <Link
          href={`${dashboardBase}/profile`}
          className="flex w-fit shrink-0 items-center gap-2 rounded-xl bg-card px-3.5 py-2.5 text-xs font-bold text-secondary ring-1 ring-secondary/10 transition-colors outline-none hover:bg-secondary/5 focus-visible:ring-2 focus-visible:ring-brand-orange/50"
        >
          <UserRound className="size-4 text-brand" strokeWidth={2.25} />
          View profile
        </Link>
      }
    >
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
        <div
          className="min-w-0 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 motion-safe:fill-mode-backwards"
          style={{ animationDelay: "80ms" }}
        >
          <UpdateAdminProfileFrom />
        </div>
        <aside className="flex min-w-0 flex-col gap-5">
          <TipsCard
            title="Good names travel well"
            description="Your name appears across the admin workspace."
            tips={[
              {
                title: "Use your real name",
                body: "Teammates and audit logs reference it.",
              },
              {
                title: "Keep it short",
                body: "Between 3 and 50 characters.",
              },
            ]}
          />
        </aside>
      </div>
    </DashboardPage>
  );
}

export function AvailableRidersPage() {
  return (
    <DashboardPage
      eyebrow="Operations · Available riders"
      title="Available riders"
      description="Riders free right now — search and assign parcels in one go."
      icon={UserCheck}
    >
      <AvailableRiders />
    </DashboardPage>
  );
}

export function AssignmentsPage() {
  return (
    <DashboardPage
      eyebrow="Operations · Assignments"
      title="Assignments"
      description="Rider jobs across every parcel — filter by status or cancel what's still in motion."
      icon={NotebookPen}
    >
      <Assignments />
    </DashboardPage>
  );
}

export function PricingRulesPage() {
  return (
    <DashboardPage
      eyebrow="Configuration · Pricing rules"
      title="Pricing rules"
      description="One rate per zone and parcel category — create new ones or update live rates."
      icon={Receipt}
      actions={
        <Link
          href={ROUTES.pricing}
          className="flex w-fit shrink-0 items-center gap-2 rounded-xl bg-card px-3.5 py-2.5 text-xs font-bold text-secondary ring-1 ring-secondary/10 transition-colors outline-none hover:bg-secondary/5 focus-visible:ring-2 focus-visible:ring-brand-orange/50"
        >
          View public pricing
        </Link>
      }
    >
      <Pricing />
    </DashboardPage>
  );
}

export function MerchantsPage() {
  return (
    <DashboardPage
      eyebrow="Configuration · Merchants"
      title="Merchants"
      description="Every registered merchant — search, review status, or toggle access."
      icon={Store}
    >
      <Merchants />
    </DashboardPage>
  );
}

export function RidersPage() {
  return (
    <DashboardPage
      eyebrow="Configuration · Riders"
      title="Riders"
      description="Review applications, manage access, and keep deliveries moving."
      icon={Bike}
    >
      <Riders />
    </DashboardPage>
  );
}

const createAdminTips = [
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

export function CreateAdminPage() {
  return (
    <DashboardPage
      eyebrow="Configuration · Create admin"
      title="Create admin"
      description="Grant dashboard access to a teammate — they'll sign in with these credentials."
      icon={UserRoundPlus}
    >
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
        <div
          className="min-w-0 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 motion-safe:fill-mode-backwards"
          style={{ animationDelay: "80ms" }}
        >
          <CreateAdminForm />
        </div>
        <aside className="flex min-w-0 flex-col gap-5">
          <TipsCard
            title="Handle with care"
            description="Admin accounts carry full responsibility."
            tips={createAdminTips}
          />
        </aside>
      </div>
    </DashboardPage>
  );
}

export function AdminsPage({ superAdmin = false }: { superAdmin?: boolean }) {
  const AdminList = superAdmin ? SuperAdmins : Admins;

  return (
    <DashboardPage
      eyebrow={superAdmin ? "Team · Admins" : "Configuration · Admins"}
      title="Admins"
      description={
        superAdmin
          ? "Everyone with dashboard access — search, review status, or toggle access."
          : "Everyone with dashboard access — search by name or email."
      }
      icon={Users}
      actions={
        <Link
          href={`${superAdmin ? ROUTES.superAdminDashboard : ROUTES.adminDashboard}/create-admin`}
          className="inline-flex h-10 w-fit shrink-0 items-center gap-2 rounded-xl bg-brand-orange px-4 font-heading text-sm font-bold text-brand-ink shadow-[0_12px_28px_-12px_var(--color-brand-orange)] transition outline-none hover:brightness-110 focus-visible:ring-3 focus-visible:ring-brand-orange/40 active:scale-[0.99]"
        >
          <UserRoundPlus className="size-4" />
          Create admin
        </Link>
      }
    >
      <AdminList />
    </DashboardPage>
  );
}

export function TransactionsPage() {
  return (
    <DashboardPage
      eyebrow="Configuration · Transactions"
      title="Transactions"
      description="Every merchant payment and refund, newest first."
      icon={HandCoins}
    >
      <Transactions />
    </DashboardPage>
  );
}

function TipsCard({
  title,
  description,
  tips,
}: {
  title: string;
  description: string;
  tips: { title: string; body: string; icon?: LucideIcon }[];
}) {
  return (
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
          {title}
        </h2>
        <p className="mt-1 text-[13px] leading-relaxed text-white/70">
          {description}
        </p>
        <ul className="mt-4 flex flex-col gap-3">
          {tips.map((tip, index) => (
            <li
              key={tip.title}
              className="flex items-start gap-3 rounded-xl bg-white/6 px-3 py-2.5 ring-1 ring-white/10 ring-inset transition-colors hover:bg-white/10"
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-orange/15 font-heading text-[13px] font-extrabold text-brand-orange ring-1 ring-brand-orange/25 ring-inset">
                {tip.icon ? (
                  <tip.icon className="size-4" strokeWidth={2.25} />
                ) : (
                  index + 1
                )}
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
  );
}
