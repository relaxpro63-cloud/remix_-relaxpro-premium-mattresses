import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductCarouselProps {
  images: string[];
  alt: string;
  badge?: string;
}

export default function ProductCarousel({ images, alt, badge }: ProductCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const goTo = (idx: number) => {
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
  };

  const goNext = () => goTo((current + 1) % images.length);
  const goPrev = () => goTo((current - 1 + images.length) % images.length);

  if (!images.length) return null;

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
  };

  return (
    <div className="relative rounded-[2rem] overflow-hidden bg-neutral-light border border-brand-200/40 shadow-sm group">
      {badge && (
        <span className="absolute top-4 sm:top-6 left-4 sm:left-6 bg-primary/95 backdrop-blur-sm text-white font-accent text-[8px] sm:text-[11px] tracking-widest uppercase font-bold px-2.5 sm:px-4 py-1 sm:py-2 rounded-full z-10 border border-white/10 shadow-lg max-w-[70%] sm:max-w-none truncate sm:whitespace-normal">
          {badge}
        </span>
      )}

      <div className="relative w-full h-[250px] sm:h-[400px] md:h-[550px] overflow-hidden">
        <AnimatePresence custom={direction} mode="wait">
          <motion.img
            key={current}
            src={images[current]}
            alt={`${alt} - View ${current + 1}`}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="w-full h-full object-contain p-4 md:p-8"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={goPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10 hover:bg-white cursor-pointer"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5 text-primary" />
          </button>
          <button
            onClick={goNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10 hover:bg-white cursor-pointer"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5 text-primary" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center justify-center gap-1.5 sm:gap-2 z-10">
            {images.map((_, idx) => (
              <div
                key={idx}
                role="button"
                onClick={() => goTo(idx)}
                className={`rounded-full transition-all cursor-pointer h-1.5 sm:h-2 shrink-0 ${
                  idx === current
                    ? 'bg-primary w-4 sm:w-5'
                    : 'bg-neutral-dark/30 hover:bg-neutral-dark/50 w-1.5 sm:w-2'
                }`}
                style={{ minHeight: '6px', minWidth: '6px' }}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>

          <div className="absolute top-6 right-6 bg-black/40 backdrop-blur-sm text-white text-[11px] font-mono px-2.5 py-1 rounded-full z-10">
            {current + 1} / {images.length}
          </div>
        </>
      )}

      <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-[2rem] pointer-events-none"></div>
    </div>
  );
}
