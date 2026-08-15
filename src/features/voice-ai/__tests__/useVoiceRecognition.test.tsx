// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useVoiceRecognition, UNSUPPORTED_MESSAGE, MIC_DENIED_MESSAGE } from '../hooks/useVoiceRecognition';

class FakeRecognition {
  lang = '';
  continuous = false;
  interimResults = false;
  onresult: ((e: any) => void) | null = null;
  onerror: ((e: any) => void) | null = null;
  onend: (() => void) | null = null;
  onstart: (() => void) | null = null;
  started = false;

  start() {
    this.started = true;
    this.onstart?.();
  }
  stop() {
    this.started = false;
    this.onend?.();
  }
  abort() {
    this.stop();
  }
}

let instance: FakeRecognition;

beforeEach(() => {
  instance = new FakeRecognition();
  (window as any).SpeechRecognition = function () {
    return instance;
  };
});

afterEach(() => {
  delete (window as any).SpeechRecognition;
  delete (window as any).webkitSpeechRecognition;
});

describe('useVoiceRecognition', () => {
  it('reports supported when the API exists', () => {
    const { result } = renderHook(() => useVoiceRecognition('en-IN'));
    expect(result.current.isSupported).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('reports the exact unsupported message when the API is absent', () => {
    delete (window as any).SpeechRecognition;
    const { result } = renderHook(() => useVoiceRecognition('en-IN'));
    expect(result.current.isSupported).toBe(false);
    expect(result.current.error).toBe(
      'Voice input is not supported on this browser. Please type your question.',
    );
    expect(UNSUPPORTED_MESSAGE).toBe(result.current.error);
  });

  it('applies the requested recognition language', () => {
    const { result } = renderHook(() => useVoiceRecognition('te-IN'));
    act(() => result.current.start());
    expect(instance.lang).toBe('te-IN');
  });

  it('tracks the listening state', () => {
    const { result } = renderHook(() => useVoiceRecognition('en-IN'));
    act(() => result.current.start());
    expect(result.current.isListening).toBe(true);
    act(() => result.current.stop());
    expect(result.current.isListening).toBe(false);
  });

  it('accumulates the final transcript', () => {
    const { result } = renderHook(() => useVoiceRecognition('en-IN'));
    act(() => result.current.start());
    act(() => {
      instance.onresult?.({
        resultIndex: 0,
        results: [Object.assign([{ transcript: 'naaku queen mattress kavali' }], { isFinal: true })],
      });
    });
    expect(result.current.transcript).toBe('naaku queen mattress kavali');
  });

  it('maps a permission error to the exact microphone message', () => {
    const { result } = renderHook(() => useVoiceRecognition('en-IN'));
    act(() => result.current.start());
    act(() => instance.onerror?.({ error: 'not-allowed' }));
    expect(result.current.error).toBe(
      "I couldn't access your microphone. Please check your browser microphone permission.",
    );
    expect(MIC_DENIED_MESSAGE).toBe(result.current.error);
    expect(result.current.isListening).toBe(false);
  });

  it('does not surface a no-speech event as an error', () => {
    const { result } = renderHook(() => useVoiceRecognition('en-IN'));
    act(() => result.current.start());
    act(() => instance.onerror?.({ error: 'no-speech' }));
    expect(result.current.error).toBeNull();
  });

  it('clears the transcript on reset', () => {
    const { result } = renderHook(() => useVoiceRecognition('en-IN'));
    act(() => result.current.start());
    act(() => {
      instance.onresult?.({
        resultIndex: 0,
        results: [Object.assign([{ transcript: 'hello' }], { isFinal: true })],
      });
    });
    act(() => result.current.reset());
    expect(result.current.transcript).toBe('');
  });
});
