export type AuthUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isVerified: boolean;
  provider: string;
  createdAt: string;
};

const ACCESS_TOKEN_KEY = "tc_access_token";

function getApiBase(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";
}

// ── Token storage ──────────────────────────────────────────────────────────

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAccessToken(token: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
  } catch {
    /* ignore */
  }
}

export function clearAccessToken(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

// ── Refresh ────────────────────────────────────────────────────────────────

export async function refreshAccessToken(): Promise<string | null> {
  try {
    const res = await fetch(`${getApiBase()}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { accessToken?: string };
    if (data.accessToken) {
      setAccessToken(data.accessToken);
      return data.accessToken;
    }
    return null;
  } catch {
    return null;
  }
}

// ── Fetch wrapper ──────────────────────────────────────────────────────────

export async function fetchWithAuth(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const token = getAccessToken();

  const makeHeaders = (t: string | null) => {
    const h = new Headers(options.headers);
    if (t) h.set("Authorization", `Bearer ${t}`);
    h.set("Content-Type", "application/json");
    return h;
  };

  let res = await fetch(url, {
    ...options,
    headers: makeHeaders(token),
    credentials: "include",
  });

  if (res.status === 401) {
    const fresh = await refreshAccessToken();
    if (!fresh) {
      clearAccessToken();
      window.dispatchEvent(new Event("auth:session-expired"));
      return res;
    }
    res = await fetch(url, {
      ...options,
      headers: makeHeaders(fresh),
      credentials: "include",
    });
  }

  return res;
}

// ── API calls ──────────────────────────────────────────────────────────────

export async function apiMe(): Promise<AuthUser> {
  const res = await fetchWithAuth(`${getApiBase()}/auth/me`);
  if (!res.ok) throw new Error("Not authenticated");
  const data = (await res.json()) as { user: AuthUser };
  return data.user;
}

export async function apiLogin(
  email: string,
  password: string,
): Promise<{ accessToken: string; user: AuthUser }> {
  const res = await fetch(`${getApiBase()}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = (await res.json()) as { message?: string };
    throw new Error(err.message ?? "Login failed");
  }
  return res.json() as Promise<{ accessToken: string; user: AuthUser }>;
}

export async function apiRegister(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
): Promise<void> {
  const res = await fetch(`${getApiBase()}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ firstName, lastName, email, password }),
  });
  if (!res.ok) {
    const err = (await res.json()) as { message?: string };
    throw new Error(err.message ?? "Registration failed");
  }
}

export async function apiGoogleAuth(
  credential: string,
): Promise<{ accessToken: string; user: AuthUser }> {
  const res = await fetch(`${getApiBase()}/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ credential }),
  });
  if (!res.ok) {
    const err = (await res.json()) as { message?: string };
    throw new Error(err.message ?? "Google auth failed");
  }
  return res.json() as Promise<{ accessToken: string; user: AuthUser }>;
}

export async function apiAppleAuth(
  idToken: string,
  firstName?: string,
  lastName?: string,
): Promise<{ accessToken: string; user: AuthUser }> {
  const res = await fetch(`${getApiBase()}/auth/apple`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ idToken, firstName, lastName }),
  });
  if (!res.ok) {
    const err = (await res.json()) as { message?: string };
    throw new Error(err.message ?? "Apple auth failed");
  }
  return res.json() as Promise<{ accessToken: string; user: AuthUser }>;
}

export async function apiLogout(): Promise<void> {
  await fetch(`${getApiBase()}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  clearAccessToken();
}

export async function apiForgotPassword(email: string): Promise<void> {
  const res = await fetch(`${getApiBase()}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as {
      message?: string;
    } | null;
    throw new Error(data?.message ?? "Failed to send reset email");
  }
}

export async function apiResendVerification(email: string): Promise<void> {
  await fetch(`${getApiBase()}/auth/resend-verification`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
}
