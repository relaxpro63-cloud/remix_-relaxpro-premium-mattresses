import { useState, useEffect, useCallback, useRef } from 'react';

const POPUP_SUBMITTED_KEY = 'relaxpro_popup_submitted';
const POPUP_DISMISSED_KEY = 'relaxpro_popup_dismissed';
const INTERVAL_SECONDS = 15;
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

  const permanentlySuppressed = dismissed || submitted;

  // Initial trigger: show popup 2 seconds after page load
  useEffect(() => {
    if (permanentlySuppressed) return;
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, [permanentlySuppressed]);

  // Repeating interval: every 15 seconds, try to show the popup
  useEffect(() => {
    if (permanentlySuppressed) return;
    const interval = setInterval(() => {
      setIsOpen(true);
    }, INTERVAL_SECONDS * 1000);
    return () => clearInterval(interval);
  }, [permanentlySuppressed]);

  // Scroll trigger: show popup when user scrolls past 40%
  useEffect(() => {
    if (permanentlySuppressed) return;
    const onScroll = () => {
      const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      if (scrollPercent >= SCROLL_PERCENT) {
        setIsOpen(true);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [permanentlySuppressed]);

  const close = useCallback(() => {
    setIsOpen(false);
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

  const open = useCallback(() => setIsOpen(true), []);

  return { isOpen, open, close, onSubmitted, onDontShowAgain };
}
