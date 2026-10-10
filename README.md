# ParcelFlow — Frontend

Courier & payments frontend for Bangladeshi merchants. Book pickups, prepay
with bKash or collect cash on delivery, and follow every parcel from your
door to your customer's — across four role-based dashboards (merchant,
rider, admin, super admin).

> **Backend required.** This app is UI-only and talks to the ParcelFlow API
> over `NEXT_PUBLIC_API_BASE_URL` (cookie sessions, `/api/v1` convention).
> Run the backend first; without it, pages render but all data calls fail.

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) + React 19 |
| Rendering | Fully static export (`output: "export"` → `out/`) |
| Styling | Tailwind CSS v4, shadcn/radix-ui primitives, Lucide icons |
| Data | TanStack Query v5 + ofetch client (cookie credentials, token refresh) |
| Forms | TanStack Form v1 + Zod v4 validation |
| Motion | `motion` (reduced-motion aware), `tw-animate-css` entrances |
| Charts | Recharts 3 (dashboard trends) |
| Auth extras | Google OAuth (`@react-oauth/google`), OTP inputs (`input-otp`) |
| Feedback | Sonner toasts |
| Quality | TypeScript (strict), Biome (lint + format) |

## Prerequisites

- Node.js 20+ and npm
- A running ParcelFlow backend (note its base URL, e.g. `https://…/api/v1`)

## Getting started

```bash
# 1. Install
npm install

# 2. Configure (see "Environment" below)
cp .env.example .env

# 3. Develop (Turbopack, http://localhost:3000)
npm run dev
```

## Environment

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | Yes | Backend base URL |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | No | Enables Google sign-in button when set |
| `NEXT_PUBLIC_{MERCHANT,RIDER,ADMIN,SUPER_ADMIN}_{EMAIL,PASSWORD}` | No | One-tap demo logins on the login page (buttons appear only for fully-set roles) |

> Demo credentials ship in the client bundle — use dedicated low-privilege
> demo accounts only, never real ones.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with Turbopack |
| `npm run build` | Static production export to `out/` (also type-checks) |
| `npm run start` | Serve a production build (needs a prior `build` without static export) |
| `npm run lint` | `biome check` |
| `npm run format` | `biome format --write` |

## Project structure

```
src/
├── app/
│   ├── (public)/(marketing)/   # Home, pricing, how-it-works, ride-with-us
│   ├── (public)/(authentication)/ # Login, register, OTP verify, password flows
│   ├── (dashboard)/dashboard/        # Merchant: home, parcels, track, …
│   ├── (dashboard)/rider-dashboard/  # Rider: assignments, profile, …
│   ├── (dashboard)/admin-dashboard/  # Admin: users, pricing, ops, …
│   └── (dashboard)/super-dashboard/ # Super admin: admins, team, …
├── api/            # Thin ofetch wrappers, one file per domain
├── components/
│   ├── form/       # TanStack forms (one per flow, shared motion presets)
│   ├── guard/      # AuthGuard, PublicGuard, RoleGuard, loaders, 403 page
│   ├── modules/    # Feature UI grouped by page/domain
│   ├── shared/     # Cross-cutting UI (pager, photo card, receipts)
│   └── ui/         # shadcn primitives
├── hooks/          # React Query hooks (queries + mutations + invalidation)
├── lib/            # apiClient, pricing engine, formatters, normalizers
├── providers/      # Query client, Google OAuth, tooltip
├── routes/         # Sidebar nav + role homes per dashboard
├── types/          # Domain + payload/response types
├── utils/          # Small pure helpers (dates, files, auth redirects)
└── validation/     # Zod schemas (single source per flow)
```

Conventions worth knowing:

- **Guards:** public auth routes render behind `PublicGuard` (signed-in users
  bounce to their dashboard, temp-password users to change-password);
  every dashboard sits behind `AuthGuard` (session, blocked and
  forced-password enforcement, `?next=` return URLs) plus a per-role
  `RoleGuard` rendering a 403 page on mismatch.
- **API numbers:** the backend serializes Prisma Decimals as strings —
  `lib/*` normalizers (`toParcel`, `toPricingRule`, `to*Stats`) coerce them
  at the boundary; never parse inline in components.
- **Cache keys:** list queries invalidate on every related mutation
  (`["parcels"]`, `["my-parcels"]`, `["riders"]`, `["admins"]`, …).
- **Styling:** dashboard theme tokens (`brand`, `brand-orange`, …) live in
  `globals.css`; page entrances use `motion-safe:animate-in` so reduced
  motion is respected.

## Deployment

`next.config.ts` sets `output: "export"`, so `npm run build` produces a
fully static `out/` directory — host it on any static host (or IPFS-style
hosting). Constraints this imposes (enforced by convention, checked by the
build):

- No server-only APIs in components (`cookies()`, `headers()`); browser
  state reads happen client-side after mount.
- Every `useSearchParams()` consumer sits inside a `<Suspense>` boundary.
- No `next/image` remote optimization — remote images use plain `<img>`.
- Set all `NEXT_PUBLIC_*` vars at **build time** (they are inlined).
