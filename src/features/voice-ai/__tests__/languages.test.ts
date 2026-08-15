import { describe, it, expect } from 'vitest';
import { LANGUAGES, DEFAULT_LANGUAGE, enabledLanguages, pickVoice } from '../lib/languages';

function voice(lang: string, name = lang): SpeechSynthesisVoice {
  return { lang, name, default: false, localService: true, voiceURI: name } as SpeechSynthesisVoice;
}

describe('LANGUAGES', () => {
  it('defaults to Tenglish', () => {
    expect(DEFAULT_LANGUAGE).toBe('tenglish');
    expect(LANGUAGES.tenglish.enabled).toBe(true);
  });

  it('recognises Tenglish with en-IN, because no recogniser emits romanized Telugu', () => {
    expect(LANGUAGES.tenglish.asr).toBe('en-IN');
  });

  it('speaks Tenglish with an en-IN voice, not a Telugu one', () => {
    expect(LANGUAGES.tenglish.tts).toBe('en-IN');
  });

  it('recognises and speaks Telugu with te-IN', () => {
    expect(LANGUAGES.telugu.asr).toBe('te-IN');
    expect(LANGUAGES.telugu.tts).toBe('te-IN');
    expect(LANGUAGES.telugu.ttsFallback).toBe('en-IN');
  });

  it('keeps Hindi wired but disabled', () => {
    expect(LANGUAGES.hindi.asr).toBe('hi-IN');
    expect(LANGUAGES.hindi.enabled).toBe(false);
  });

  it('excludes disabled languages from the picker list', () => {
    const keys = enabledLanguages().map((l) => l.key);
    expect(keys).toEqual(['tenglish', 'english', 'telugu']);
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
