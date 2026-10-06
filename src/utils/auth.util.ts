import { getMe } from "@/api";

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
