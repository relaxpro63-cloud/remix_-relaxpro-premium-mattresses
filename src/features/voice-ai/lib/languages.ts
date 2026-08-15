export type LanguageKey = 'tenglish' | 'english' | 'telugu' | 'hindi';

export interface LanguageConfig {
  key: LanguageKey;
  label: string;
  /** BCP-47 tag for SpeechRecognition.lang */
  asr: string;
  /** BCP-47 tag for speech synthesis */
  tts: string;
  /** Used when no voice exists for `tts`. */
  ttsFallback?: string;
  enabled: boolean;
}

export const LANGUAGES: Record<LanguageKey, LanguageConfig> = {
  tenglish: { key: 'tenglish', label: 'Tenglish', asr: 'en-IN', tts: 'en-IN', enabled: false },
  english: { key: 'english', label: 'English', asr: 'en-IN', tts: 'en-IN', enabled: true },
  telugu: { key: 'telugu', label: 'తెలుగు', asr: 'te-IN', tts: 'te-IN', ttsFallback: 'en-IN', enabled: false },
  hindi: { key: 'hindi', label: 'हिन्दी', asr: 'hi-IN', tts: 'hi-IN', ttsFallback: 'en-IN', enabled: false },
};

export const DEFAULT_LANGUAGE: LanguageKey = 'english';

export function enabledLanguages(): LanguageConfig[] {
  return Object.values(LANGUAGES).filter((l) => l.enabled);
}

/** Exact tag, then same prefix, then the fallback tag, then any English voice. */
export function pickVoice(
  voices: SpeechSynthesisVoice[],
  primary: string,
  fallback?: string,
): SpeechSynthesisVoice | null {
  if (voices.length === 0) return null;

  const exact = voices.find((v) => v.lang.toLowerCase() === primary.toLowerCase());
  if (exact) return exact;

  const prefix = primary.split('-')[0].toLowerCase();
  const samePrefix = voices.find((v) => v.lang.toLowerCase().startsWith(prefix));
  if (samePrefix) return samePrefix;

  if (fallback) {
    const fb = voices.find((v) => v.lang.toLowerCase() === fallback.toLowerCase());
    if (fb) return fb;
  }

  return voices.find((v) => v.lang.toLowerCase().startsWith('en')) ?? null;
}
