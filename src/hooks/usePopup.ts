import { useState, useEffect, useCallback, useRef } from 'react';

const POPUP_SUBMITTED_KEY = 'relaxpro_popup_submitted';
const POPUP_DISMISSED_KEY = 'relaxpro_popup_dismissed';
const COOLDOWN_MS = 12_000; // 12 seconds before popup can reappear after close
const SCROLL_PERCENT = 0.4;

interface UsePopupReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  onSubmitted: () => void;
  onDontShowAgain: () => void;
}

export function usePopup(): UsePopupReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    try { return localStorage.getItem(POPUP_DISMISSED_KEY) === 'true'; }
    catch { return false; }
  });
  const [submitted, setSubmitted] = useState(() => {
    try { return localStorage.getItem(POPUP_SUBMITTED_KEY) === 'true'; }
    catch { return false; }
  });

  // Track when popup was last closed to enforce cooldown
  const lastClosedRef = useRef<number>(0);
  // Track if scroll trigger has already fired this session
  const scrollFiredRef = useRef(false);

  const permanentlySuppressed = dismissed || submitted;

  // Helper: check cooldown before showing
  const canShow = useCallback(() => {
    if (permanentlySuppressed) return false;
    const elapsed = Date.now() - lastClosedRef.current;
    return elapsed >= COOLDOWN_MS;
  }, [permanentlySuppressed]);

  // Initial trigger: show popup 2 seconds after page load
  useEffect(() => {
    if (!canShow()) return;
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, [permanentlySuppressed]); // eslint-disable-line react-hooks/exhaustive-deps

  // Repeating interval: every 12 seconds, try to show the popup (respects cooldown)
  useEffect(() => {
    if (permanentlySuppressed) return;
    const interval = setInterval(() => {
      if (canShow()) {
        setIsOpen(true);
      }
    }, COOLDOWN_MS);
    return () => clearInterval(interval);
  }, [permanentlySuppressed, canShow]);

  // Scroll trigger: show popup when user scrolls past 40% (fires only once per cooldown)
  useEffect(() => {
    if (permanentlySuppressed) return;
    const onScroll = () => {
      if (scrollFiredRef.current) return;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;
      const scrollPercent = window.scrollY / scrollHeight;
      if (scrollPercent >= SCROLL_PERCENT && canShow()) {
        scrollFiredRef.current = true;
        setIsOpen(true);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [permanentlySuppressed, canShow]);

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
