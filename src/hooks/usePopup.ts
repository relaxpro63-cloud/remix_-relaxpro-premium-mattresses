import { useState, useEffect, useCallback, useRef } from 'react';

const POPUP_SUBMITTED_KEY = 'relaxpro_popup_submitted';
const POPUP_DISMISSED_KEY = 'relaxpro_popup_dismissed';

export interface PopupConfig {
  enabled?: boolean;
  initialDelay?: number;
  cooldownSeconds?: number;
  scrollPercent?: number;
}

interface UsePopupReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  onSubmitted: () => void;
  onDontShowAgain: () => void;
}

export function usePopup(config?: PopupConfig): UsePopupReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    try { return localStorage.getItem(POPUP_DISMISSED_KEY) === 'true'; }
    catch { return false; }
  });
  const [submitted, setSubmitted] = useState(() => {
    try { return localStorage.getItem(POPUP_SUBMITTED_KEY) === 'true'; }
    catch { return false; }
  });

  const cooldownMs = (config?.cooldownSeconds ?? 12) * 1000;
  const initialDelayMs = (config?.initialDelay ?? 2) * 1000;
  const scrollPercent = (config?.scrollPercent ?? 40) / 100;
  const popupEnabled = config?.enabled !== false;

  // Track when popup was last closed to enforce cooldown
  const lastClosedRef = useRef<number>(0);
  // Track if scroll trigger has already fired this session
  const scrollFiredRef = useRef(false);

  const permanentlySuppressed = dismissed || submitted || !popupEnabled;

  // Helper: check cooldown before showing
  const canShow = useCallback(() => {
    if (permanentlySuppressed) return false;
    const elapsed = Date.now() - lastClosedRef.current;
    return elapsed >= cooldownMs;
  }, [permanentlySuppressed, cooldownMs]);

  // Initial trigger: show popup after configured delay
  useEffect(() => {
    if (!canShow()) return;
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, initialDelayMs);
    return () => clearTimeout(timer);
  }, [permanentlySuppressed]); // eslint-disable-line react-hooks/exhaustive-deps

  // Repeating interval: every cooldown period, try to show the popup (respects cooldown)
  useEffect(() => {
    if (permanentlySuppressed) return;
    const interval = setInterval(() => {
      if (canShow()) {
        setIsOpen(true);
      }
    }, cooldownMs);
    return () => clearInterval(interval);
  }, [permanentlySuppressed, canShow, cooldownMs]);

  // Scroll trigger: show popup when user scrolls past threshold (fires only once per session)
  useEffect(() => {
    if (permanentlySuppressed) return;
    const onScroll = () => {
      if (scrollFiredRef.current) return;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;
      const scrollPercentReached = window.scrollY / scrollHeight;
      if (scrollPercentReached >= scrollPercent && canShow()) {
        scrollFiredRef.current = true;
        setIsOpen(true);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [permanentlySuppressed, canShow, scrollPercent]);

  const close = useCallback(() => {
    setIsOpen(false);
    lastClosedRef.current = Date.now();
  }, []);

  const onSubmitted = useCallback(() => {
    setIsOpen(false);
    try { localStorage.setItem(POPUP_SUBMITTED_KEY, 'true'); }
    catch { /* noop */ }
    setSubmitted(true);
  }, []);

  const onDontShowAgain = useCallback(() => {
    setIsOpen(false);
    try { localStorage.setItem(POPUP_DISMISSED_KEY, 'true'); }
    catch { /* noop */ }
    setDismissed(true);
  }, []);

  const open = useCallback(() => {
    if (canShow()) {
      setIsOpen(true);
    }
  }, [canShow]);

  return { isOpen, open, close, onSubmitted, onDontShowAgain };
}
