/**
 * Parses backend date strings tolerantly. The API mostly sends ISO dates,
 * but some fields arrive in a non-standard shape like
 * `2026-10-07T21:30:20:153 GMT+0600` (colon millis + `GMT+HHMM`), which
 * `new Date()` rejects. Returns `null` when nothing parses.
 */
export function parseBackendDate(raw: string | undefined | null): Date | null {
    if (!raw || typeof raw !== "string") return null;

    const direct = new Date(raw);
    if (!Number.isNaN(direct.getTime())) return direct;

    const normalized = raw
        .replace(/:(\d{3})(?=\s|$)/, ".$1")
        .replace(/\s*GMT([+-]\d{2})(\d{2})\b/, "$1:$2");
    const parsed = new Date(normalized);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
}

const dayFormat: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
};

const dateTimeFormat: Intl.DateTimeFormatOptions = {
    ...dayFormat,
    hour: "numeric",
    minute: "2-digit",
};

/** `7 Oct 2026` or `"—"` when unparseable. */
export function formatBackendDate(raw: string | undefined | null): string {
    const date = parseBackendDate(raw);
    if (!date) return "—";
    return date.toLocaleDateString("en-GB", dayFormat);
}

/** `7 Oct 2026, 9:30 pm` or `"—"` when unparseable. */
export function formatBackendDateTime(raw: string | undefined | null): string {
    const date = parseBackendDate(raw);
    if (!date) return "—";
    return date.toLocaleDateString("en-GB", dateTimeFormat);
}
