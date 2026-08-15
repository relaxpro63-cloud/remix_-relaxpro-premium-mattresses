import { describe, it, expect } from 'vitest';
import { buildSystemPrompt } from '../prompt';

describe('buildSystemPrompt', () => {
  it('always states the identity', () => {
    expect(buildSystemPrompt('english')).toContain('You are RelaxPro AI');
  });

  it('always carries the anti-invention rule', () => {
    for (const lang of ['english', 'tenglish', 'telugu', 'hindi'] as const) {
      expect(buildSystemPrompt(lang)).toMatch(/Never invent product specifications/);
    }
  });

  it('always carries the medical boundary', () => {
    expect(buildSystemPrompt('tenglish')).toMatch(/not a doctor/i);
  });

  it('always forbids asking for a phone number before buying intent', () => {
    expect(buildSystemPrompt('english')).toMatch(/do not ask for a phone number/i);
  });

  it('instructs Tenglish replies for the tenglish language', () => {
    const prompt = buildSystemPrompt('tenglish');
    expect(prompt).toMatch(/conversational Tenglish/);
    expect(prompt).toContain('Naaku');
  });

  it('instructs plain Indian English for the english language', () => {
    expect(buildSystemPrompt('english')).toMatch(/Reply in clear, simple English/);
  });

  it('instructs Telugu script for the telugu language', () => {
    expect(buildSystemPrompt('telugu')).toMatch(/Telugu script/);
  });

  it('instructs Hindi for the hindi language', () => {
    const prompt = buildSystemPrompt('hindi');
    expect(prompt).toMatch(/Hindi/);
    expect(prompt).toMatch(/Devanagari/);
  });

  it('produces a different language block per language', () => {
    const seen = new Set(
      (['english', 'tenglish', 'telugu', 'hindi'] as const).map(buildSystemPrompt),
    );
    expect(seen.size).toBe(4);
  });
});
