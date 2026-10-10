# ParcelFlow — API Integration

How this frontend talks to the ParcelFlow backend. All HTTP goes through
one client (`src/lib/apiClient.ts`, ofetch-based) and one hook layer
(`src/hooks/`), organized per domain under `src/api/`.

## Transport

- **Base URL:** `NEXT_PUBLIC_API_BASE_URL` (e.g. `https://…/api/v1`).
- **Sessions:** cookie-based. Every request sends `credentials: "include"`.
- **Refresh:** on a `401` (except the auth endpoints listed below, where
  401 means wrong credentials), the client performs one single-flight
  `POST /auth/refresh` and retries the original request once. A second
  401 is thrown as-is — the caller treats it as signed out.
- **Binary:** invoice download uses `responseType: "blob"`
  (`apiClient<Blob, "blob">`); everything else is JSON.

## Response envelope

```ts
interface ApiResponse<T> {
    success: boolean;
    statusCode: number;
    message: string;
    data: T;
    meta?: { page: number; limit: number; total: number; totalPages: number };
}
```

- List endpoints return `ApiResponse<T[]>` + `meta` for pagination.
- Always check `res.success` on mutations — HTTP 200 with
  `success: false` is a server-side failure, not an exception.
- Errors surface as ofetch `FetchError`; user-facing text comes from
  `err.data?.message || err.message || "<fallback>"`.

## The Decimal rule

The backend serializes Prisma `Decimal` columns **as strings**
(`"1500"`, `"2.5"`). Components must never parse them inline — each
domain normalizes at the API boundary in `src/lib/`:

| Helper | Applied in |
| --- | --- |
| `toPricingRule` | pricing list hook (`select`) |
| `toParcel` | parcel list + single fetchers |
| `toMerchantStats` / `toAdminStats` / `toRiderStats` | stats fetchers |

`formatTaka` tolerates strings; `formatKg`/`formatPercent` require real
numbers — which is exactly why normalization lives in one place.

## Endpoint catalog

### Auth — `src/api/auth.api.ts`

| Method & path | Purpose | Hook |
| --- | --- | --- |
| `POST /auth/login` | Email + password sign-in | `useLogin` |
| `POST /auth/register` | Merchant registration | `useRegistration` |
| `POST /auth/verify-otp` | Verify email with 6-digit OTP | `useVerifyAccount` |
| `POST /auth/resend-otp` | Resend verification code | `useResendMerchantVerifyCode` |
| `POST /auth/forgot-password` | Start reset (sends OTP) | `useForgotPassword` |
| `POST /auth/reset-password` | Reset with `{email, otp, newPassword}` | `useResetPassword` |
| `POST /auth/change-password` | `{currentPassword, newPassword}` | `useChangePassword` |
| `POST /auth/google` | Google sign-in (`{idToken}`) | `useGoogleOAuth` |
| `POST /auth/logout` | Sign out (clears `["user"]` cache) | `useLogout` |
| `GET /auth/me` | Session user (`ApiResponse<User>`) | `useGetMe` (`["user"]`) |

`useGetMe` resolves 401/403 to `null` (signed out), never an error —
guards rely on this distinction.

### Parcels — `src/api/parcel.api.ts`

| Method & path | Purpose |
| --- | --- |
| `POST /parcel/create-parcel` | Book a parcel (full payload, defaults applied client-side) |
| `GET /parcel/my-parcels` | Merchant's parcels (`status?`, `searchTerm?` = tracking, `page?`, `limit?`, `sortOrder?`) |
| `GET /parcel` | All parcels (admin) — same params |
| `GET parcel/{id}/merchant` | One parcel, merchant scope |
| `GET parcel/{id}` | One parcel, admin scope |
| `GET parcel/{trackingId}/track` | Public short status (`{status, trackingId}`) |
| `POST parcel/{id}/cancel` | Merchant cancel (`{cancelReason?}`) |
| `POST parcel/{id}/admin-cancel` | Admin cancel (`{cancelReason?}`) |
| `DELETE parcel/{id}` | Merchant delete (CREATED only, enforced in UI) |
| `PATCH parcel/{id}/status` | Admin hub move (`{status: "AT_HUB" \| "IN_TRANSIT"}`) |
| `POST parcel/{id}/pay` | Start bKash checkout → `PaymentResponse.paymentUrl`; client redirects same-tab via `window.location.href` |
| `GET parcel/{id}/invoice` | PDF invoice (`Blob`; saved as `invoice-{parcelId}.pdf`) |

Parcel mutations invalidate `["my-parcels"]`, `["parcels"]`, both single
keys, `["my-transactions"]`, `["transactions"]`, and `["stats"]`.

### Riders — `src/api/rider.api.ts`

| Method & path | Purpose |
| --- | --- |
| `POST /rider/apply` | Application, multipart (`data` JSON + `vehiclePaper` file) |
| `POST /rider/apply/verify-email` | Verify applicant email |
| `GET /rider` | All riders (`applicationStatus?`, `searchTerm?` = name/email, paging) |
| `GET /rider/available` | Free riders now (search + paging, no status filter) |
| `GET /rider/{id}` | One rider (admin review) |
| `POST /rider/approve` | `{riderId, APPROVED \| REJECTED, rejectionReason?}` |
| `PATCH /rider/{userId}/status` | Toggle ACTIVE/BLOCKED |
| `GET /rider/profile` | Signed-in rider's profile |
| `PATCH /rider/update-profile` | Partial `{name?, phone?, address?}` |

Application review invalidates `["riders"]`, `["rider"]`, and
`["available-riders"]`.

### Assignments — `src/api/assignment.api.ts`

| Method & path | Purpose |
| --- | --- |
| `POST /assignment/create-assignment` | `{parcelId, riderId, leg: PICKUP \| DELIVERY}` (status/attempt set server-side) |
| `GET /assignment` | All assignments (`status?`, paging) |
| `GET /assignment/my-assignments` | Signed-in rider's jobs (same filter shape, no search) |
| `PATCH /assignment/{id}/cancel` | Admin cancel (`{reason?}`) |
| `PATCH /assignment/{id}/accept` · `/reject` | Rider decision on ASSIGNED |
| `PATCH /assignment/{id}/start` | Rider starts an ACCEPTED job → IN_PROGRESS |
| `PATCH /assignment/{id}/complete` · `/fail` | Rider closes an IN_PROGRESS job |

Lifecycle mutations invalidate `["assignments"]`, `["my-assignments"]`
(and `["available-riders"]` where rider availability changes).

### Merchants — `src/api/merchant.api.ts`

| Method & path | Purpose |
| --- | --- |
| `GET /merchant/profile` | Signed-in merchant's profile |
| `PATCH /merchant/update-profile` | Partial `{name?, phone?, businessName?}` — UI sends only changed fields |
| `GET /merchant` | Directory (`status?: ACTIVE \| BLOCKED`, search, paging) |
| `PATCH /merchant/{userId}/status` | Toggle ACTIVE/BLOCKED |

### Admins — `src/api/admin.api.ts`

| Method & path | Purpose |
| --- | --- |
| `POST /admin` | Create admin (`{name, email, password, personalEmail}`) |
| `POST /admin/super-admin` | Create super admin (same payload) |
| `GET /admin` · `GET /admin/super-admin` | Directories (search + paging) |
| `PATCH /admin` | Own admin profile (`{name?}`) |
| `PATCH /admin/{userId}/status` | Toggle ACTIVE/BLOCKED |

### Pricing — `src/api/pricing.api.ts`

| Method & path | Purpose |
| --- | --- |
| `GET /rule` | All rules (public estimator filters `isActive` client-side; admin page shows all) |
| `POST /rule` | Create rule (full payload) |
| `PATCH /rule/{id}` | Partial update |

Rule mutations invalidate `["pricing-rules"]` (also observed by the
public estimator, 5-min stale otherwise).

### Transactions & stats

| Method & path | Purpose |
| --- | --- |
| `GET /transaction/my-transactions` | Merchant history (paging) |
| `GET /transaction/all-transactions` | All merchants (admin, paging) |
| `GET /stats/merchant` · `/stats/admin` · `/stats/rider` | Dashboard aggregates |
| `POST /user/profile-image` | Avatar upload, multipart (`profileImage` file) |

## Pagination / filter / sort conventions

List params are uniform: `page?` (default 1), `limit?` (default 10),
`sortOrder?: "desc" | "asc"` (default `desc`). Optional filters differ
per domain (`status?`, `applicationStatus?`, `searchTerm?` — tracking ID
for parcels, name/email for people). UI resets to page 1 whenever a
filter or search changes, and reads `meta.total` / `meta.totalPages`
with single-page fallbacks.

## Adding a new endpoint

1. `src/api/<domain>.api.ts` — thin wrapper returning the call (type the
   envelope: `apiClient<ApiResponse<T>>`, or `<Blob, "blob">`).
2. `src/types/` — payload + response interfaces (partial-update payloads
   as `Partial<…>` or explicit optionals).
3. `src/hooks/<domain>.hook.ts` — `useQuery` with a namespaced key
   (`["domain", params]`), or `useMutation` invalidating every affected
   list/single/stats key.
4. Barrel-export anything new from `src/api/index.ts`, `src/hooks/index.ts`,
   `src/types/index.ts` (and validation schemas from
   `src/validation/index.ts`).
5. Normalize Decimal-bearing responses in `src/lib/` before they reach
   components.
