/** WebSocket URL for Action Cable (mounted at /api/cable on the API host). */
export function getCableUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_CABLE_URL?.trim();
  if (explicit) {
    return toWebSocketUrl(explicit);
  }

  const api = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");
  if (!api) return "";

  let base = api;
  if (!/^https?:\/\//i.test(base)) {
    base = `http://${base}`;
  }

  const url = new URL(base);
  url.pathname = url.pathname.replace(/\/v1\/?$/, "").replace(/\/?$/, "") + "/cable";
  return toWebSocketUrl(url.toString());
}

function toWebSocketUrl(httpUrl: string): string {
  const url = new URL(httpUrl);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  return url.toString();
}
