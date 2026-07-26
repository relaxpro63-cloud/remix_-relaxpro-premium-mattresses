import { useState, useEffect, useCallback, useRef } from 'react';

const POPUP_DISMISSED_KEY = 'relaxpro_popup_last_dismissed';
const POPUP_SUBMITTED_KEY = 'relaxpro_popup_submitted';
const HIDE_HOURS = 0.5; // 30 min — popup reappears until user submits the form
const TRIGGER_SECONDS = 10;
const SCROLL_PERCENT = 0.4;

interface UsePopupReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  onSubmitted: () => void;
}

export function usePopup(): UsePopupReturn {
  const [isOpen, setIsOpen] = useState(false);
  const hasTriggered = useRef(false);
  const scrollListenerRef = useRef<(() => void) | null>(null);

  const wasSubmitted = useCallback(() => {
    try {
      return localStorage.getItem(POPUP_SUBMITTED_KEY) === 'true';
    } catch {
      return false;
    }
  }, []);

  const canShow = useCallback(() => {
    if (wasSubmitted()) return false;
    try {
      const lastDismissed = localStorage.getItem(POPUP_DISMISSED_KEY);
      if (!lastDismissed) return true;
      const diffMs = Date.now() - new Date(lastDismissed).getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      return diffHours >= HIDE_HOURS;
    } catch {
      return true;
    }
  }, [wasSubmitted]);

  const triggerShow = useCallback(() => {
    if (hasTriggered.current || !canShow()) return;
    hasTriggered.current = true;
    setIsOpen(true);
    // Clean up scroll listener
    if (scrollListenerRef.current) {
      window.removeEventListener('scroll', scrollListenerRef.current);
      scrollListenerRef.current = null;
    }
  }, [canShow]);

  // Timer trigger (10 seconds)
  useEffect(() => {
    if (!canShow()) return;
    const timer = setTimeout(triggerShow, TRIGGER_SECONDS * 1000);
    return () => clearTimeout(timer);
  }, [canShow, triggerShow]);

  // Scroll trigger (40%)
  useEffect(() => {
    if (!canShow() || hasTriggered.current) return;

    const onScroll = () => {
      const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      if (scrollPercent >= SCROLL_PERCENT) {
        triggerShow();
      }
    };

    scrollListenerRef.current = onScroll;
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      scrollListenerRef.current = null;
    };
  }, [canShow, triggerShow]);

  const close = useCallback(() => {
    setIsOpen(false);
    try {
      localStorage.setItem(POPUP_DISMISSED_KEY, new Date().toISOString());
    } catch { /* noop */ }
  }, []);

  const onSubmitted = useCallback(() => {
    setIsOpen(false);
    try {
      localStorage.setItem(POPUP_SUBMITTED_KEY, 'true');
    } catch { /* noop */ }
  }, []);

  const open = useCallback(() => setIsOpen(true), []);

  return { isOpen, open, close, onSubmitted };
}
