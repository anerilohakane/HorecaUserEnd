import { getAuthSession } from "@/app/actions/session";

export async function authFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // 🔹 Get token from secure server-side cookies
  const { token } = await getAuthSession();

  // 🔹 Build final headers
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // 🔹 Perform the API request with token attached
  return fetch(url, {
    ...options,
    headers,
  });
}
