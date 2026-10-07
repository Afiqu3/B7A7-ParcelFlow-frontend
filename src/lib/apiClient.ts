import { FetchError, type FetchOptions, ofetch, type ResponseType } from "ofetch";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Plain client with no refresh logic. Used for the refresh call itself and
// for every real request, so refreshing can never call itself.
const baseClient = ofetch.create({
  baseURL: BASE_URL,
  credentials: "include",
});

// For these, a 401 means "wrong credentials", not "access token expired".
const SKIP_REFRESH = [
  "/auth/login",
  "/auth/register",
  "/auth/google",
  "/auth/refresh-token",
];

// If several requests fail at the same time, they all wait for this one
// refresh instead of each starting their own.
let refreshing: Promise<unknown> | null = null;

function refreshToken() {
  if (!refreshing) {
    refreshing = baseClient("/auth/refresh", { method: "POST" }).finally(
      () => {
        refreshing = null;
      },
    );
  }
  return refreshing;
}

// biome-ignore lint/suspicious/noExplicitAny: same default as ofetch's own client
export default async function apiClient<T = any, R extends ResponseType = "json">(
  url: string,
  options?: FetchOptions<R>,
): Promise<T> {
  try {
    // ofetch types the result as MappedResponseType<R, T>; the caller
    // picks T to match R (e.g. Blob with "blob"), so assert it through.
    return (await baseClient(url, options)) as unknown as T;
  } catch (error) {
    // Only an expired access token should trigger a refresh.
    const isExpired =
      error instanceof FetchError &&
      error.status === 401 &&
      !SKIP_REFRESH.includes(url);

    if (!isExpired) throw error;

    try {
      await refreshToken();
    } catch {
      throw error; // refresh token missing/expired: the user is signed out
    }

    // Retry once with the new access token. A second 401 is thrown as-is.
    return baseClient(url, options) as unknown as Promise<T>;
  }
}