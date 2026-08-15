import { useCallback, useEffect, useRef, useState } from 'react';

export const UNSUPPORTED_MESSAGE =
  'Voice input is not supported on this browser. Please type your question.';
export const MIC_DENIED_MESSAGE =
  "I couldn't access your microphone. Please check your browser microphone permission.";
export const NO_MIC_MESSAGE =
  "I couldn't access your microphone. Please check your browser microphone permission.";
export const NETWORK_MESSAGE =
  "Sorry, I'm having trouble connecting right now. Please try again or contact our RelaxPro expert on WhatsApp.";

function getRecognitionCtor(): any | null {
  if (typeof window === 'undefined') return null;
  return (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition ?? null;
}

export interface VoiceRecognitionState {
  isSupported: boolean;
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

export function useVoiceRecognition(langCode: string): VoiceRecognitionState {
  const [isSupported] = useState(() => getRecognitionCtor() !== null);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(isSupported ? null : UNSUPPORTED_MESSAGE);
  const recognitionRef = useRef<any>(null);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const reset = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    if (isSupported) setError(null);
  }, [isSupported]);

  const start = useCallback(() => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) {
      setError(UNSUPPORTED_MESSAGE);
      return;
    }

    recognitionRef.current?.abort?.();

    const recognition = new Ctor();
    recognition.lang = langCode;
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event: any) => {
      let final = '';
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        const text = result[0]?.transcript ?? '';
        if (result.isFinal) final += text;
        else interim += text;
      }
      if (final) setTranscript((prev) => (prev ? `${prev} ${final}`.trim() : final.trim()));
      setInterimTranscript(interim);
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      switch (event.error) {
        case 'not-allowed':
        case 'service-not-allowed':
          setError(MIC_DENIED_MESSAGE);
          break;
        case 'audio-capture':
          setError(NO_MIC_MESSAGE);
          break;
        case 'network':
          setError(NETWORK_MESSAGE);
          break;
        // 'no-speech' and 'aborted' are normal outcomes, not failures.
        default:
          break;
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript('');
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      setError(MIC_DENIED_MESSAGE);
      setIsListening(false);
    }
  }, [langCode]);

  useEffect(() => () => recognitionRef.current?.abort?.(), []);

  return { isSupported, isListening, transcript, interimTranscript, error, start, stop, reset };
}
