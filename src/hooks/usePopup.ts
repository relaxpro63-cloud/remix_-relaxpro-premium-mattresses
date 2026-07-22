import { useState, useEffect, useCallback } from 'react';

const POPUP_STORAGE_KEY = 'relaxpro_popup_last_shown';
const POPUP_INTERVAL_DAYS = 7;
const POPUP_TRIGGER_SECONDS = 20;

interface UsePopupReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  dismissed: boolean;
}

export function usePopup(): UsePopupReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const shouldShow = useCallback(() => {
    try {
      const lastShown = localStorage.getItem(POPUP_STORAGE_KEY);
      if (!lastShown) return true;
      
      const lastDate = new Date(lastShown);
      const now = new Date();
      const diffDays = (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);
      
      return diffDays >= POPUP_INTERVAL_DAYS;
    } catch {
      return true;
    }
  }, []);

  useEffect(() => {
    if (dismissed) return;
    if (!shouldShow()) return;

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, POPUP_TRIGGER_SECONDS * 1000);

    return () => clearTimeout(timer);
  }, [dismissed, shouldShow]);

  const close = useCallback(() => {
    setIsOpen(false);
    setDismissed(true);
    
    try {
      localStorage.setItem(POPUP_STORAGE_KEY, new Date().toISOString());
    } catch {
      // localStorage not available
    }
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  return { isOpen, open, close, dismissed };
}