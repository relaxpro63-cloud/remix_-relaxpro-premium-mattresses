import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { checkRateLimit, __resetRateLimit, PER_IP_PER_MINUTE } from '../ratelimit';

beforeEach(() => {
  __resetRateLimit();
  vi.useFakeTimers();
});
afterEach(() => vi.useRealTimers());

describe('checkRateLimit', () => {
  it('allows requests under the per-minute limit', () => {
    for (let i = 0; i < PER_IP_PER_MINUTE; i += 1) {
      expect(checkRateLimit('1.2.3.4').allowed).toBe(true);
    }
  });

  it('blocks the request after the per-minute limit', () => {
    for (let i = 0; i < PER_IP_PER_MINUTE; i += 1) checkRateLimit('1.2.3.4');
    const result = checkRateLimit('1.2.3.4');
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe('per_ip');
  });

  it('tracks each ip separately', () => {
    for (let i = 0; i < PER_IP_PER_MINUTE; i += 1) checkRateLimit('1.2.3.4');
    expect(checkRateLimit('5.6.7.8').allowed).toBe(true);
  });

  it('lets an ip through again after the window rolls over', () => {
    for (let i = 0; i < PER_IP_PER_MINUTE; i += 1) checkRateLimit('1.2.3.4');
    vi.advanceTimersByTime(61_000);
    expect(checkRateLimit('1.2.3.4').allowed).toBe(true);
  });

  it('blocks everyone once the daily cap is reached', () => {
    __resetRateLimit({ dailyCap: 2 });
    expect(checkRateLimit('a').allowed).toBe(true);
    expect(checkRateLimit('b').allowed).toBe(true);
    const result = checkRateLimit('c');
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe('daily_cap');
  });
});
