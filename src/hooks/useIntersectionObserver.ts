import { useEffect, useRef, useState, RefObject } from 'react';
import { useLocation } from 'react-router-dom';

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useIntersectionObserver<T extends HTMLElement = HTMLDivElement>(
  options: UseIntersectionObserverOptions = {}
): [RefObject<T | null>, boolean] {
  const { threshold = 0.12, rootMargin = '0px 0px -60px 0px', triggerOnce = true } = options;
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce]);

  return [ref, isVisible];
}

const REVEAL_SELECTOR = '.fade-up, .fade-left, .fade-right, .scale-in';

/**
 * Hook to initialize global scroll animation observer.
 * Call once at the App root level to observe all .fade-up, .fade-left, .fade-right, .scale-in elements.
 *
 * Reveal elements frequently mount well after the route change (React.lazy +
 * Suspense resolving, async data fetches) — a one-shot querySelectorAll misses
 * them and they stay at opacity:0 forever. A MutationObserver picks up
 * anything added for as long as the route is mounted, not just the first pass.
 */
export function useGlobalScrollAnimations(): void {
  const location = useLocation();

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    const observeMatches = (root: ParentNode) => {
      root.querySelectorAll(REVEAL_SELECTOR).forEach((el) => io.observe(el));
    };

    observeMatches(document);

    const mo = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.matches(REVEAL_SELECTOR)) io.observe(node);
          observeMatches(node);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [location.pathname]);
}

export default useIntersectionObserver;
