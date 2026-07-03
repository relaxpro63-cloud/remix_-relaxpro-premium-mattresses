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

/**
 * Hook to initialize global scroll animation observer.
 * Call once at the App root level to observe all .fade-up, .fade-left, .fade-right, .scale-in elements.
 */
export function useGlobalScrollAnimations(): void {
  const location = useLocation();

  useEffect(() => {
    // Need a slight delay to allow React to render the new DOM elements after route change
    const timeout = setTimeout(() => {
      const animatedEls = document.querySelectorAll('.fade-up, .fade-left, .fade-right, .scale-in');

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate-in');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
      );

      animatedEls.forEach((el) => observer.observe(el));
    }, 100);

    return () => clearTimeout(timeout);
  }, [location.pathname]);
}

export default useIntersectionObserver;
