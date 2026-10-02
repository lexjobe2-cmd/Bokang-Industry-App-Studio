export type CoordinationResult<T> =
  | { configured: true; value: T | null }
  | { configured: false; value: null };

function config() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ""), token } : null;
}

async function redisCommand<T>(command: string[]): Promise<CoordinationResult<T>> {
  const current = config();
  if (!current) return { configured: false, value: null };

  const response = await fetch(current.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${current.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });

  if (!response.ok) throw new Error(`Redis coordination failed with HTTP ${response.status}`);
  const payload = await response.json() as { result?: T };
  return { configured: true, value: payload.result ?? null };
}

export async function coordinationGet(key: string) {
  return redisCommand<string>(["GET", key]);
}

export async function coordinationSet(
  key: string,
  value: string,
  ttlSeconds = 3600
) {
  return redisCommand<string>(["SET", key, value, "EX", String(ttlSeconds)]);
}

export async function coordinationDelete(key: string) {
  return redisCommand<number>(["DEL", key]);
}

export function coordinationKey(...parts: string[]) {
  return ["bokang-studio", ...parts.map((part) => encodeURIComponent(part))].join(":");
}
