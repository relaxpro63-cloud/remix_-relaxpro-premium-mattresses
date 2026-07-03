import React, { useEffect, useRef, useState } from 'react';

interface NumberTickerProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number; // duration in ms
}

export default function NumberTicker({ value, suffix = '', prefix = '', duration = 1500 }: NumberTickerProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      setCount(value);
      return;
    }
    let startTime: number | null = null;
    let rafId = 0;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      }
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [isVisible, value, duration]);

  return (
    <span ref={ref} className="font-sans font-bold text-2xl md:text-3xl text-brand-950 tracking-tight">
      {prefix}{count.toLocaleString('en-IN')}{suffix}
    </span>
  );
}
