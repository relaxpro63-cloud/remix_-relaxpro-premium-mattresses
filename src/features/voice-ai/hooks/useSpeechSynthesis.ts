import { useCallback, useEffect, useState } from 'react';
import { pickVoice } from '../lib/languages';

const STORAGE_KEY = 'relaxpro_ai_voice_output';

export interface SpeechSynthesisState {
  isSupported: boolean;
  isSpeaking: boolean;
  enabled: boolean;
  setEnabled: (value: boolean) => void;
  speak: (text: string, langCode: string, fallbackLangCode?: string) => void;
  stop: () => void;
}

export function useSpeechSynthesis(): SpeechSynthesisState {
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [enabled, setEnabledState] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.localStorage.getItem(STORAGE_KEY) !== 'off';
  });

  // Chrome populates voices asynchronously.
  useEffect(() => {
    if (!isSupported) return;
    const load = () => setVoices(window.speechSynthesis.getVoices());
    load();
    window.speechSynthesis.addEventListener('voiceschanged', load);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', load);
  }, [isSupported]);

  const setEnabled = useCallback(
    (value: boolean) => {
      setEnabledState(value);
      window.localStorage.setItem(STORAGE_KEY, value ? 'on' : 'off');
      if (!value && isSupported) window.speechSynthesis.cancel();
    },
    [isSupported],
  );

  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [isSupported]);

  const speak = useCallback(
    (text: string, langCode: string, fallbackLangCode?: string) => {
      if (!isSupported || !enabled || !text.trim()) return;
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      const voice = pickVoice(voices, langCode, fallbackLangCode);
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      } else {
        utterance.lang = langCode;
      }
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    },
    [isSupported, enabled, voices],
  );

  return { isSupported, isSpeaking, enabled, setEnabled, speak, stop };
}
