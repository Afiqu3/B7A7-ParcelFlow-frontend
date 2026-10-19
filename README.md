# ParcelFlow — Frontend

Courier & payments frontend for Bangladeshi merchants. Book pickups, prepay
with bKash or collect cash on delivery, and follow every parcel from your
door to your customer's — across four role-based dashboards (merchant,
rider, admin, super admin).

## Live Links

| Resource | Link |
| --- | --- |
| Live Frontend | https://parcelflow-liart.vercel.app/ |
| Live Backend API | https://pacelflow.vercel.app/ (`/api/v1` base: https://pacelflow.vercel.app/api/v1) |
| Frontend Repository | https://github.com/Afiqu3/B7A7-ParcelFlow-frontend |
| API Reference (local) | [`API_INTEGRATION.md`](./API_INTEGRATION.md) |

> **Backend required.** This app is UI-only and talks to the ParcelFlow API
> over `NEXT_PUBLIC_API_BASE_URL` (cookie sessions, `/api/v1` convention).
> Run the backend first; without it, pages render but all data calls fail.
> Full endpoint reference: [`API_INTEGRATION.md`](./API_INTEGRATION.md).

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) + React 19 |
| Rendering | Static export configured; AI POST routes require a Next.js server deployment |
| Styling | Tailwind CSS v4, shadcn/radix-ui primitives, Lucide icons |
| Data | TanStack Query v5 + ofetch client (cookie credentials, token refresh) |
| Forms | TanStack Form v1 + Zod v4 validation |
| Motion | `motion` (reduced-motion aware), `tw-animate-css` entrances |
| Charts | Recharts 3 (dashboard trends) |
| Auth extras | Google OAuth (`@react-oauth/google`), OTP inputs (`input-otp`) |
| Feedback | Sonner toasts |
| Quality | TypeScript (strict), Biome (lint + format) |

## Dependencies

Core runtime dependencies (see `package.json`):

| Package | Version | Purpose |
| --- | --- | --- |
| `next` | 16.3.6 | App Router framework and Turbopack dev server |
| `react` / `react-dom` | 19.2.8 | UI library |
| `@tanstack/react-query` | ^5.103.2 | Server-state caching, queries/mutations under `src/hooks/` |
| `ofetch` | ^1.5.1 | Typed fetch client in `src/lib/apiClient.ts` (cookies, 401 refresh retry, blob invoices) |
| `@tanstack/react-form` | ^1.33.5 | Headless forms in `src/components/form/` |
| `zod` | ^4.6.5 | Schema validation, single source in `src/validation/` |
| `radix-ui` | ^1.6.7 | Headless primitives behind shadcn UI |
| `shadcn` | ^4.21.0 | UI component CLI/generator (`components.json`, `src/components/ui/`) |
| `class-variance-authority` | ^0.7.1 | Variant-driven component styles |
| `cn` | ^0.4.0 | Class-name merging helper |
| `tailwindcss` | ^4 | Utility-first styling (with `@tailwindcss/postcss`, `tw-animate-css`) |
| `tw-animate-css` | ^1.4.0 | Entrance animations (`motion-safe:animate-in`) |
| `motion` | ^13.4.5 | Reduced-motion-aware page/form motion presets |
| `lucide-react` | ^1.48.0 | Icons |
| `next-themes` | ^0.4.6 | Theme provider |
| `recharts` | ^3.10.1 | Dashboard charts/trends |
| `@react-oauth/google` | ^0.13.5 | Google sign-in (enabled by `NEXT_PUBLIC_GOOGLE_CLIENT_ID`) |
| `input-otp` | ^1.5.0 | OTP inputs (verify email, password reset) |
| `sonner` | ^2.0.8 | Toasts for success/error feedback |

Dev dependencies:

| Package | Version | Purpose |
| --- | --- | --- |
| `typescript` | ^5 | Strict type-checking (`npx tsc --noEmit`, build check) |
| `@biomejs/biome` | 2.4.2 | Lint + format (`npm run lint`, `npm run format`) |
| `@tailwindcss/postcss` | ^4 | Tailwind PostCSS plugin |
| `@types/node`, `@types/react`, `@types/react-dom` | ^20 / ^19 | Type definitions |
| `babel-plugin-react-compiler` | 1.0.0 | React Compiler (`reactCompiler: true` in `next.config.ts`) |

## Roles & dashboards

| Role | Home | What they can do |
| --- | --- | --- |
| **Merchant** | `/dashboard` | Book parcels (pickup/delivery details, prepaid-vs-COD), live price estimates, tracking page, pay pending bKash transactions, invoice PDFs, parcel history with cancel/delete, transaction history, profile + photo, stats & revenue dashboard |
| **Rider** | `/rider-dashboard` | Apply with vehicle papers + OTP verification, profile + photo, own assignment queue (accept → start → complete/fail with inline confirms), personal stats & success rate |
| **Admin** | `/admin-dashboard` | Review rider applications (approve, reject with reason), block/unblock riders & merchants, all parcels (hub moves AT_HUB/IN_TRANSIT, cancel, details), assign parcels to free riders, manage assignments, all transactions, pricing rules CRUD, admin directory, platform stats |
| **Super admin** | `/super-dashboard` | Everything admins do, plus admin/super-admin directories with status toggles and create-admin / create-super-admin flows |

Every dashboard shares one shell (navy sidebar + cream panel, collapsible
with cookie-persisted state) and one visual language (cards, pills,
orange primary actions, `font-heading` titles).

## Key user journeys

- **Book a parcel (merchant):** 4-step form (pickup → recipient → parcel →
  payment) with business-rule interlocks (e.g. DOCUMENT forces prepaid),
  then a success banner with the tracking reference.
- **Pay online:** pending transactions expose Pay now → bKash checkout
  URL (same-tab redirect) → gateway returns to
  `/dashboard/parcels?status=success|failure` with matching toasts.
- **Rider onboarding:** application + vehicle-paper upload → email OTP →
  admin approval → assignments flow.
- **Dispatch loop (admin):** available riders → create assignment
  (parcel + pickup/delivery leg) → rider accepts → starts → completes or
  fails; cancellable while in motion.
- **Sign-in:** email/password, Google OAuth (merchants), or one-tap demo
  logins per role (appear only when demo env vars are set). Temp-password
  accounts are forced through change-password; deep links survive login
  via `?next=` return URLs.
- **Ask the AI support chatbot:** the app sends the latest conversation
  messages and a fixed ParcelFlow support prompt to `/api/chat`. The prompt
  lists useful page links so the bot can direct users to them; it does not
  fetch or read those pages. The bot cannot look up live parcel or account
  data. See [API_INTEGRATION.md](./API_INTEGRATION.md#ai-chatbot) for context,
  limits, and provider configuration.

### AI chatbot configuration and context

Configure one or more server-only provider keys in `.env` (see
[`.env.example`](./.env.example)): `GEMINI_API_KEY`, `GROQ_API_KEY`, and/or
`OPENROUTER_API_KEY`. Provider URL/model variables are optional and have
defaults in the example file. The server tries configured providers in order
and falls back to the next one if a request fails. Restart the dev server
after changing these values. Never use a `NEXT_PUBLIC_` prefix for AI keys.

The AI receives the conversation and the support prompt; it does not get
automatic access to website pages, the backend database, or the signed-in
user's account. Do not send passwords, payment credentials, verification
codes, or other sensitive information in chat. Messages are sent to whichever
third-party AI provider successfully handles the request.

## Auth & access

- `PublicGuard` (auth pages): signed-in visitors bounce to their role
  home; blocked users stay on login so the next attempt surfaces the
  reason; temp-password users route to change-password.
- `AuthGuard` (all dashboards): requires a session (preserving `?next=`),
  retries once on network blips, enforces BLOCKED and
  forced-password redirects.
- `RoleGuard` (per dashboard): role allow-list with a dedicated 403 page
  naming the required vs. actual role.

## Prerequisites

- Node.js 20+ and npm (`node -v`, `npm -v` to verify)
- Git
- A running ParcelFlow backend (local or live at `https://pacelflow.vercel.app/api/v1`). Without it, pages render but all data calls fail.

## How to Run Locally (Step-by-Step)

### 1. Clone the repository

```bash
git clone https://github.com/Afiqu3/B7A7-ParcelFlow-frontend.git
cd B7A7-ParcelFlow-frontend
```

### 2. Install dependencies

```bash
npm install
```

This installs everything listed in [Dependencies](#dependencies) from `package.json` / `package-lock.json`.

### 3. Configure environment variables

```bash
cp .env.example .env
# Windows CMD: copy .env.example .env
```

Then edit `.env`:

```env
NEXT_PUBLIC_API_BASE_URL=https://pacelflow.vercel.app/api/v1
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
# Optional demo logins (buttons appear only when both email + password are set per role):
# NEXT_PUBLIC_MERCHANT_EMAIL= / NEXT_PUBLIC_MERCHANT_PASSWORD=
# NEXT_PUBLIC_RIDER_EMAIL= / NEXT_PUBLIC_RIDER_PASSWORD=
# NEXT_PUBLIC_ADMIN_EMAIL= / NEXT_PUBLIC_ADMIN_PASSWORD=
# NEXT_PUBLIC_SUPER_ADMIN_EMAIL= / NEXT_PUBLIC_SUPER_ADMIN_PASSWORD=
```

> `NEXT_PUBLIC_*` vars are inlined at **build time**. Restart the dev server after changing them. Never commit real credentials — demo accounts ship in the client bundle, so use dedicated low-privilege demo accounts only.

### 4. Run the development server

```bash
npm run dev
```

Open http://localhost:3000. Turbopack enables fast refresh; auth deep links survive login via `?next=` return URLs.

### 5. Verify (recommended before pushing)

```bash
npx tsc --noEmit   # fast type-check
npm run lint       # biome check
npm run build      # full static export to out/
```

### 6. Production build locally (optional)

```bash
npm run build
# output goes to out/ because next.config.ts sets output: "export"
# preview with any static server, e.g.:
npx serve out
```

> Note: `npm run start` (`next start`) requires a non-static build. For this project, deploy/preview the `out/` directory on a static host (Vercel, Netlify, any static server).

### Troubleshooting

- API calls fail / 401s: confirm the backend is running and `NEXT_PUBLIC_API_BASE_URL` ends with `/api/v1`, then restart `npm run dev`.
- Google button missing: set `NEXT_PUBLIC_GOOGLE_CLIENT_ID`.
- Demo login buttons missing: each role needs both its email and password vars set.
- Stale env after edit: stop and re-run `npm run dev` (Next.js inlines `NEXT_PUBLIC_*` at startup/build).

## Environment

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | Yes | Backend base URL |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | No | Enables Google sign-in button when set |
| `NEXT_PUBLIC_{MERCHANT,RIDER,ADMIN,SUPER_ADMIN}_{EMAIL,PASSWORD}` | No | One-tap demo logins on the login page (buttons appear only for fully-set roles) |
| `GEMINI_API_KEY`, `GROQ_API_KEY`, `OPENROUTER_API_KEY` | At least one for AI features | Server-only provider credentials; never expose with `NEXT_PUBLIC_` |
| `GEMINI_API_URL`, `GROQ_API_URL`, `GROQ_MODEL`, `OPENROUTER_API_URL`, `OPENROUTER_MODEL` | No | Optional server-side provider endpoint/model overrides; defaults are in `.env.example` |

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

Verify with `npx tsc --noEmit` (fast) and `npm run build` (full static
export of all routes) before pushing.

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

- **Guards:** public auth routes render behind `PublicGuard` (signed-in
  users bounce to their dashboard, temp-password users to
  change-password); every dashboard sits behind `AuthGuard` (session,
  blocked and forced-password enforcement, `?next=` return URLs) plus a
  per-role `RoleGuard` rendering a 403 page on mismatch.
- **API numbers:** the backend serializes Prisma Decimals as strings —
  `lib/*` normalizers (`toPricingRule`, `toParcel`, `to*Stats`) coerce them
  at the boundary; never parse inline in components.
- **Cache keys:** list queries invalidate on every related mutation
  (`["parcels"]`, `["my-parcels"]`, `["riders"]`, `["admins"]`, …).
- **Styling:** dashboard theme tokens (`brand`, `brand-orange`, …) live in
  `globals.css`; page entrances use `motion-safe:animate-in` so reduced
  motion is respected. Forms share stagger/error/label-swap presets from
  `components/form/form-motion.ts`.
- **Lists:** search (500 ms debounce) resets to page 1; filters live in
  tab rails; pagers collapse on mobile; empty/error/skeleton states are
  mandatory per list.

## Deployment

`next.config.ts` sets `output: "export"`, so `npm run build` produces a
static `out/` directory that can be hosted on a static host. However, static
exports cannot run request-dependent POST Route Handlers such as `/api/chat`
and `/api/dashboard-report`. The AI chatbot and dashboard reports work in
development with `npm run dev`; to enable them in production, deploy the app
with a Next.js server runtime and remove `output: "export"` from
`next.config.ts`. Set server-only AI variables in that runtime's environment.
Static-export constraints include:

- No server-only APIs in components (`cookies()`, `headers()`); browser
  state reads happen client-side after mount.
- Every `useSearchParams()` consumer sits inside a `<Suspense>` boundary.
- No `next/image` remote optimization — remote images use plain `<img>`.
- Set all `NEXT_PUBLIC_*` vars at **build time** (they are inlined).

## Relevant Resources

- Live frontend: https://parcelflow-liart.vercel.app/
- Live backend: https://pacelflow.vercel.app/
- Frontend repo: https://github.com/Afiqu3/B7A7-ParcelFlow-frontend
- Backend API reference: [`API_INTEGRATION.md`](./API_INTEGRATION.md)
- Next.js docs: https://nextjs.org/docs
- React docs: https://react.dev/
- TanStack Query: https://tanstack.com/query/latest
- TanStack Form: https://tanstack.com/form/latest
- Tailwind CSS v4: https://tailwindcss.com/docs
- shadcn/ui: https://ui.shadcn.com/
- Radix UI: https://www.radix-ui.com/
- Zod: https://zod.dev/
- Recharts: https://recharts.org/
- Sonner: https://sonner.emilkowal.ski/
- Google OAuth (`@react-oauth/google`): https://www.npmjs.com/package/@react-oauth/google
