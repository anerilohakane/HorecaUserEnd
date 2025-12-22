export async function authFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // 🔹 Get token from localStorage
  const token = typeof window !== "undefined"
    ? localStorage.getItem("accessToken")
    : null;

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
