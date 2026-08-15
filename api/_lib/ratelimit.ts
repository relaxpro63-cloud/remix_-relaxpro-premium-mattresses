export const PER_IP_PER_MINUTE = 12;

const WINDOW_MS = 60_000;

interface Bucket {
  count: number;
  resetAt: number;
}

let buckets = new Map<string, Bucket>();
let dailyCount = 0;
let dailyResetAt = 0;
let dailyCapOverride: number | null = null;

function dailyCap(): number {
  if (dailyCapOverride !== null) return dailyCapOverride;
  const raw = Number(process.env.AI_DAILY_REQUEST_CAP);
  return Number.isFinite(raw) && raw > 0 ? raw : 2000;
}

/** Test seam. */
export function __resetRateLimit(opts: { dailyCap?: number } = {}): void {
  buckets = new Map();
  dailyCount = 0;
  dailyResetAt = 0;
  dailyCapOverride = opts.dailyCap ?? null;
}

export function checkRateLimit(ip: string): { allowed: boolean; reason?: 'per_ip' | 'daily_cap' } {
  const now = Date.now();

  if (now >= dailyResetAt) {
    dailyCount = 0;
    dailyResetAt = now + 24 * 60 * 60 * 1000;
  }
  if (dailyCount >= dailyCap()) return { allowed: false, reason: 'daily_cap' };

  const bucket = buckets.get(ip);
  if (!bucket || now >= bucket.resetAt) {
    buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
  } else {
    if (bucket.count >= PER_IP_PER_MINUTE) return { allowed: false, reason: 'per_ip' };
    bucket.count += 1;
  }

  // Bound memory on a long-lived warm instance.
  if (buckets.size > 5000) {
    for (const [key, value] of buckets) {
      if (now >= value.resetAt) buckets.delete(key);
    }
  }

  dailyCount += 1;
  return { allowed: true };
}
