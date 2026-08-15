import { describe, it, expect } from 'vitest';
import { LANGUAGES, DEFAULT_LANGUAGE, enabledLanguages, pickVoice } from '../lib/languages';

function voice(lang: string, name = lang): SpeechSynthesisVoice {
  return { lang, name, default: false, localService: true, voiceURI: name } as SpeechSynthesisVoice;
}

describe('LANGUAGES', () => {
  it('defaults to English', () => {
    expect(DEFAULT_LANGUAGE).toBe('english');
    expect(LANGUAGES.english.enabled).toBe(true);
  });

  it('keeps Tenglish and Telugu wired but disabled', () => {
    expect(LANGUAGES.tenglish.asr).toBe('en-IN');
    expect(LANGUAGES.tenglish.enabled).toBe(false);
    expect(LANGUAGES.telugu.asr).toBe('te-IN');
    expect(LANGUAGES.telugu.enabled).toBe(false);
  });

  it('keeps Hindi wired but disabled', () => {
    expect(LANGUAGES.hindi.asr).toBe('hi-IN');
    expect(LANGUAGES.hindi.enabled).toBe(false);
  });

  it('excludes disabled languages from the picker list', () => {
    const keys = enabledLanguages().map((l) => l.key);
    expect(keys).toEqual(['english']);
  });
});

describe('pickVoice', () => {
  it('prefers an exact language match', () => {
    const chosen = pickVoice([voice('en-US'), voice('te-IN'), voice('en-IN')], 'te-IN', 'en-IN');
    expect(chosen?.lang).toBe('te-IN');
  });

  it('falls back to a same-prefix voice', () => {
    const chosen = pickVoice([voice('en-US'), voice('te-IN-x-local')], 'te-IN', 'en-IN');
    expect(chosen?.lang).toBe('te-IN-x-local');
  });

  it('falls back to the fallback language when the primary is missing', () => {
    const chosen = pickVoice([voice('en-US'), voice('en-IN')], 'te-IN', 'en-IN');
    expect(chosen?.lang).toBe('en-IN');
  });

  it('falls back to any English voice when nothing else matches', () => {
    const chosen = pickVoice([voice('fr-FR'), voice('en-US')], 'te-IN', 'en-IN');
    expect(chosen?.lang).toBe('en-US');
  });

  it('returns null when there are no voices at all', () => {
    expect(pickVoice([], 'te-IN', 'en-IN')).toBeNull();
  });
});
