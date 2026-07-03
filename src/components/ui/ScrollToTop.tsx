import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={`scroll-top-btn bg-primary text-white w-11 h-11 rounded-full flex items-center justify-center shadow-lg hover:bg-accent transition-colors cursor-pointer ${
        isVisible ? 'visible' : ''
      }`}
    >
      <ChevronUp className="w-5 h-5 animate-bounce-arrow" />
    </button>
  );
}
