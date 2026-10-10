import { getMe } from "@/api";
import { ROUTES } from "@/constants";
import { toast } from "sonner";

/**
 * Read `mustChangePassword` from a login / OAuth response, tolerating
 * envelope variations (`data.user`, `data`, or a top-level `user`).
 * Returns `undefined` when the flag is absent so callers can fall back
 * to a fresh `/auth/me` read.
 */
export function extractMustChangePassword(res: unknown): boolean | undefined {
    if (!res || typeof res !== "object") return undefined;
    const root = res as Record<string, unknown>;
    const data =
        root.data && typeof root.data === "object"
            ? (root.data as Record<string, unknown>)
            : root;
    const user =
        data.user && typeof data.user === "object"
            ? (data.user as Record<string, unknown>)
            : data;
    return typeof user.mustChangePassword === "boolean"
        ? user.mustChangePassword
        : undefined;
}

/**
 * True when the freshly signed-in user must change their password
 * (e.g. an admin-issued temporary password). Falls back to `/auth/me`
 * when the login response itself carries no user flag.
 */
export async function shouldForcePasswordChange(
    res: unknown,
): Promise<boolean> {
    const direct = extractMustChangePassword(res);
    if (direct !== undefined) return direct;
    try {
        const me = await getMe();
        return me?.data?.mustChangePassword === true;
    } catch {
        return false;
    }
}

/**
 * Safe post-login destination from `?next=`. Same-origin paths only —
 * rejects absolute URLs, protocol-relative URLs and backslashes, so a
 * crafted login link can never bounce users off-site (open-redirect guard).
 */
export function resolveNextPath(
    next: string | null,
    fallback = "/",
): string {
    if (
        !next ||
        !next.startsWith("/") ||
        next.startsWith("//") ||
        next.includes("\\")
    ) {
        return fallback;
    }
    return next;
}

export async function extractRole(
    res: unknown,
): Promise<string | boolean> {
    const direct = extractMustChangePassword(res);
    if (direct !== undefined) return direct;
    try {
        const me = await getMe();
        return me?.data?.role;
    } catch {
        return false;
    }
}

/**
 * Shared post-password-login flow (form + demo buttons): forced-password
 * accounts go to their change-password route, everyone else to `next`.
 * Never throws — failures surface as toasts.
 */
export async function completePasswordLogin(
    res: unknown,
    opts: { push: (url: string) => void; next: string },
): Promise<void> {
    if (await shouldForcePasswordChange(res)) {
        const role = await extractRole(res);
        toast.warning("Password change required", {
            description:
                "Your account is using a temporary password. Please set a new one to continue.",
        });
        if (role === "RIDER") {
            opts.push(`${ROUTES.riderDashboard}${ROUTES.changePassword}`);
            return;
        }
        if (role === "MERCHANT") {
            opts.push(`${ROUTES.merchantDashboard}${ROUTES.changePassword}`);
            return;
        }
        if (role === "ADMIN") {
            opts.push(`${ROUTES.adminDashboard}${ROUTES.changePassword}`);
            return;
        }
        if (role === "SUPER_ADMIN") {
            opts.push(`${ROUTES.superAdminDashboard}${ROUTES.changePassword}`);
            return;
        }
        opts.push(ROUTES.home);
        return;
    }
    toast.success("Login Success", {
        description: "Welcome back",
    });
    opts.push(opts.next);
}
