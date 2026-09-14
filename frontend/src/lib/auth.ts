export const TOKEN_KEY = "ziplink_token";
export const USERNAME_KEY = "ziplink_username";
export const AUTH_CHANGED_EVENT = "ziplink:auth-changed";
export const SESSION_EXPIRED_EVENT = "ziplink:session-expired";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
export function getUsername(): string {
  return localStorage.getItem(USERNAME_KEY) || "there";
}
export function saveAuth(token: string, username: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USERNAME_KEY, username);
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}
export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USERNAME_KEY);
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

export function expireSession(): void {
  clearAuth();
  window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
}

export function getTokenExpiryMs(
  token: string | null = getToken(),
): number | null {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      "=",
    );
    const parsed = JSON.parse(atob(padded)) as { exp?: unknown };
    const expirySeconds =
      typeof parsed.exp === "number" ? parsed.exp : Number(parsed.exp);
    return Number.isFinite(expirySeconds) ? expirySeconds * 1000 : null;
  } catch {
    // Some backends issue opaque tokens without a readable JWT expiry.
    // The API's 401/403 response remains the fallback for those tokens.
    return null;
  }
}
