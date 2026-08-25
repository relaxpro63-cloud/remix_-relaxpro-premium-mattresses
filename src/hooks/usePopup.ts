import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const POPUP_SUBMITTED_KEY = 'relaxpro_popup_submitted';
const POPUP_DISMISSED_KEY = 'relaxpro_popup_dismissed';
const POPUP_SESSION_KEY = 'relaxpro_popup_shown_session';

/** Plain dismissal keeps the popup away for 7 days; submission is forever. */
const DISMISS_MS = 7 * 24 * 60 * 60 * 1000;

export interface PopupConfig {
  enabled?: boolean;
  /** Seconds on page before showing. Default 15. */
  initialDelay?: number;
  /** Scroll depth (0-100) that triggers the popup. Default 50. */
  scrollPercent?: number;
}

interface UsePopupReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  onSubmitted: () => void;
  onDontShowAgain: () => void;
}

function readStore(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}
function writeStore(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
    // Cookie fallback for browsers that block localStorage.
    document.cookie = `${key}=${encodeURIComponent(value)};max-age=${Math.floor(DISMISS_MS / 1000)};path=/;samesite=lax`;
  } catch { /* storage unavailable — session-only behaviour */ }
}
function dismissedRecently(): boolean {
  const raw = readStore(POPUP_DISMISSED_KEY);
  if (!raw) return false;
  const ts = Number(raw);
  return Number.isFinite(ts) && Date.now() - ts < DISMISS_MS;
}
function shownThisSession(): boolean {
  try { return sessionStorage.getItem(POPUP_SESSION_KEY) === 'true'; } catch { return false; }
}
function markShownThisSession(): void {
  try { sessionStorage.setItem(POPUP_SESSION_KEY, 'true'); } catch { /* noop */ }
}

/** Routes where an interrupting popup must never appear (mid-task flows). */
const EXEMPT_ROUTES = ['/cart', '/success', '/builder'];

export function usePopup(config?: PopupConfig): UsePopupReturn {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const delayMs = Math.max((config?.initialDelay ?? 15) * 1000, 5000); // floor: never fire near first paint
  const scrollThreshold = Math.min(Math.max((config?.scrollPercent ?? 50) / 100, 0.1), 1);
  const popupEnabled = config?.enabled !== false;

  const scrollFiredRef = useRef(false);
  const exitFiredRef = useRef(false);
  const suppressRef = useRef(
    !popupEnabled || dismissedRecently() || readStore(POPUP_SUBMITTED_KEY) === 'true'
  );
  useEffect(() => {
    suppressRef.current = !popupEnabled || dismissedRecently() || readStore(POPUP_SUBMITTED_KEY) === 'true';
  }, [popupEnabled]);

  const canShow = useCallback(
    () => !suppressRef.current && !shownThisSession() && !EXEMPT_ROUTES.some((r) => location.pathname.startsWith(r)),
    [location.pathname]
  );

  const show = useCallback(() => {
    if (!canShow()) return;
    markShownThisSession();
    setIsOpen(true);
  }, [canShow]);

  // Trigger 1: dwell time
  useEffect(() => {
    if (!canShow()) return;
    const timer = setTimeout(show, delayMs);
    return () => clearTimeout(timer);
  }, [canShow, show, delayMs]);

  // Trigger 2: scroll depth (fires once per page)
  useEffect(() => {
    if (!canShow()) return;
    const onScroll = () => {
      if (scrollFiredRef.current) return;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;
      if (window.scrollY / scrollHeight >= scrollThreshold) {
        scrollFiredRef.current = true;
        show();
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [canShow, show, scrollThreshold]);

  // Trigger 3: exit intent — desktop pointers only (no mouse exit on touch)
  useEffect(() => {
    if (!canShow()) return;
    const isDesktopPointer =
      typeof window.matchMedia === 'function' && window.matchMedia('(pointer: fine)').matches;
    if (!isDesktopPointer) return;

    const onMouseOut = (e: MouseEvent) => {
      if (exitFiredRef.current) return;
      if (e.relatedTarget === null && e.clientY <= 0) {
        exitFiredRef.current = true;
        show();
      }
    };
    document.addEventListener('mouseout', onMouseOut);
    return () => document.removeEventListener('mouseout', onMouseOut);
  }, [canShow, show]);

  const close = useCallback(() => {
    setIsOpen(false);
    writeStore(POPUP_DISMISSED_KEY, String(Date.now()));
    suppressRef.current = true;
  }, []);

  const onSubmitted = useCallback(() => {
    setIsOpen(false);
    writeStore(POPUP_SUBMITTED_KEY, 'true');
    suppressRef.current = true;
  }, []);

  const onDontShowAgain = useCallback(() => {
    close();
  }, [close]);

  const open = useCallback(() => {
    show();
  }, [show]);

  return { isOpen, open, close, onSubmitted, onDontShowAgain };
}
