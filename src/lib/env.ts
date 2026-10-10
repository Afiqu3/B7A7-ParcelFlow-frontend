export const env = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "",
  googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "",
};
export const isGoogleAuthEnabled = Boolean(env.googleClientId);

export type DemoRole = "MERCHANT" | "RIDER" | "ADMIN" | "SUPER_ADMIN";

export interface DemoAccount {
  role: DemoRole;
  label: string;
  email: string;
  password: string;
}

function demoAccount(
  role: DemoRole,
  label: string,
  email: string | undefined,
  password: string | undefined,
): DemoAccount | null {
  if (!email || !password) return null;
  return { role, label, email, password };
}

/**
 * Demo login accounts from env. Roles with incomplete credentials are
 * skipped, so the demo block simply hides where nothing is configured
 * (e.g. production without demo vars).
 */
export const demoAccounts: DemoAccount[] = [
  demoAccount(
    "MERCHANT",
    "Merchant",
    process.env.NEXT_PUBLIC_MERCHANT_EMAIL,
    process.env.NEXT_PUBLIC_MERCHANT_PASSWORD,
  ),
  demoAccount(
    "RIDER",
    "Rider",
    process.env.NEXT_PUBLIC_RIDER_EMAIL,
    process.env.NEXT_PUBLIC_RIDER_PASSWORD,
  ),
  demoAccount(
    "ADMIN",
    "Admin",
    process.env.NEXT_PUBLIC_ADMIN_EMAIL,
    process.env.NEXT_PUBLIC_ADMIN_PASSWORD,
  ),
  demoAccount(
    "SUPER_ADMIN",
    "Super admin",
    process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL,
    process.env.NEXT_PUBLIC_SUPER_ADMIN_PASSWORD,
  ),
].filter((account): account is DemoAccount => account !== null);
