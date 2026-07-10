import React, { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'motion/react';
import { ChevronUp } from 'lucide-react';
import { smoothScrollTo } from '../../lib/smoothScroll';

export default function ScrollToTop() {
  const { scrollY } = useScroll();
  const [isVisible, setIsVisible] = useState(false);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsVisible(latest > 400);
  });

  const scrollToTop = () => {
    smoothScrollTo(0, { duration: 1.2 });
  };

  return (
    <motion.button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`scroll-top-btn bg-primary text-white w-11 h-11 rounded-full flex items-center justify-center shadow-lg hover:bg-accent cursor-pointer ${
        isVisible ? 'visible' : ''
      }`}
    >
      <ChevronUp className="w-5 h-5 animate-bounce-arrow" />
    </motion.button>
  );
}
