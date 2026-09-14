import { expireSession } from "@/lib/auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export type ApiError = Error & { status?: number };
export type AnalyticsItem = {
  urlName: string;
  shortUrl: string;
  count: number;
};
export type UrlItem = {
  urlName: string;
  shortUrl: string;
};

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem("ziplink_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function readResponse<T>(
  response: Response,
  options: { expireOnAuthFailure?: boolean } = {},
): Promise<T> {
  // Parse each response safely: Spring Boot may return JSON or a plain text message.
  const text = await response.text();
  let payload: unknown = text;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    /* plain text is valid */
  }
  if (!response.ok) {
    if (
      options.expireOnAuthFailure !== false &&
      (response.status === 401 || response.status === 403)
    ) {
      // Expired or rejected bearer tokens immediately lock the whole app.
      expireSession();
    }
    const message =
      typeof payload === "object" && payload !== null && "error" in payload
        ? String((payload as { error: unknown }).error)
        : typeof payload === "string" && payload
          ? payload
          : `Request failed (${response.status})`;
    const error = new Error(message) as ApiError;
    error.status = response.status;
    throw error;
  }
  return payload as T;
}

function normalizeAnalytics(payload: unknown): AnalyticsItem[] {
  if (!Array.isArray(payload)) {
    throw new Error("Analytics response must be a list of links.");
  }

  return payload.map((entry, index) => {
    const values = Array.isArray(entry)
      ? entry
      : entry && typeof entry === "object"
        ? Object.values(entry)
        : [];
    const record =
      entry && typeof entry === "object" && !Array.isArray(entry)
        ? (entry as Record<string, unknown>)
        : {};
    const urlName = record.urlName ?? values[0];
    const shortUrl = record.shortUrl ?? values[1];
    const rawCount = record.count ?? values[2];
    const count = Number(rawCount);

    if (
      typeof urlName !== "string" ||
      typeof shortUrl !== "string" ||
      !Number.isFinite(count)
    ) {
      throw new Error(`Analytics item ${index + 1} has an invalid shape.`);
    }

    return { urlName, shortUrl, count };
  });
}

function normalizeUrls(payload: unknown): UrlItem[] {
  if (!Array.isArray(payload)) {
    throw new Error("URL history response must be a list of links.");
  }

  return payload.map((entry, index) => {
    if (
      !Array.isArray(entry) ||
      typeof entry[0] !== "string" ||
      typeof entry[1] !== "string"
    ) {
      throw new Error(`URL history item ${index + 1} has an invalid shape.`);
    }
    return { urlName: entry[0], shortUrl: entry[1] };
  });
}

export async function login(
  userName: string,
  password: string,
): Promise<{ token: string }> {
  // Build the login request body exactly as expected by the Spring Boot API.
  const body = { userName, password };
  // Make the login API request.
  const response = await fetch(`${API_BASE_URL}/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  // Parse the login response into the token payload.
  try {
    // Invalid login credentials are a form error, not an expired session.
    return await readResponse<{ token: string }>(response, {
      expireOnAuthFailure: false,
    });
  } catch (error) {
    const status = (error as ApiError).status;
    if (status === 401 || status === 403) {
      throw new Error("Incorrect username and password.");
    }
    throw error;
  }
}

export async function signup(
  userName: string,
  emailId: string,
  password: string,
): Promise<string> {
  // Build the account creation request body exactly as expected by the Spring Boot API.
  const body = { userName, emailId, password };
  // Make the signup API request.
  const response = await fetch(`${API_BASE_URL}/v1/user/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  // Parse the signup response, which may be JSON or a 201 plain text message.
  try {
    return await readResponse<string>(response);
  } catch (error) {
    const status = (error as ApiError).status;
    if (status === 400 || status === 500) {
      throw new Error("Please enter valid email and password");
    }
    throw error;
  }
}

export async function shorten(
  longUrl: string,
  urlName: string,
): Promise<{ shortUrl: string }> {
  // Build the shorten request body exactly as expected by the Spring Boot API.
  const body = { longUrl, urlName };
  // Make the protected URL shortening API request.
  const response = await fetch(`${API_BASE_URL}/v1/url/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(body),
  });
  // Parse the returned short URL for rendering in the latest-result panel.
  return readResponse<{ shortUrl: string }>(response);
}

export async function getAnalytics(): Promise<AnalyticsItem[]> {
  // No request body is needed for this protected analytics request.
  // Make the protected analytics API request.
  const response = await fetch(`${API_BASE_URL}/v1/analytics`, {
    headers: authHeaders(),
  });
  // Parse and normalize the analytics list so each row retains its name, short URL, and count.
  return normalizeAnalytics(await readResponse<unknown>(response));
}

export async function getUrls(): Promise<UrlItem[]> {
  const response = await fetch(`${API_BASE_URL}/v1/url/getAll`, {
    headers: authHeaders(),
  });
  return normalizeUrls(await readResponse<unknown>(response));
}

export async function deleteUrl(shortUrl: string): Promise<number> {
  const response = await fetch(
    `${API_BASE_URL}/v1/url/delete/${encodeURIComponent(shortUrl)}`,
    {
      method: "DELETE",
      headers: authHeaders(),
    },
  );
  return Number(await readResponse<unknown>(response));
}

export async function logout(): Promise<void> {
  // Make the optional logout API request; the caller clears local auth even if it fails.
  await fetch(`${API_BASE_URL}/v1/auth/logout`, {
    method: "POST",
    headers: authHeaders(),
  }).catch(() => undefined);
}
