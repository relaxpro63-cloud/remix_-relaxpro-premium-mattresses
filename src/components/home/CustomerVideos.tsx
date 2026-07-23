import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface VideoData {
  id: string;
  videoId: string;
  embedUrl: string;
  title: string;
}

const VIDEOS: VideoData[] = [
  {
    id: 'vid1',
    videoId: 'Wvr3D6jQ-f4',
    embedUrl: 'https://www.youtube.com/embed/Wvr3D6jQ-f4',
    title: 'Natural Latex mattresses manufacturing in front of customer #latex #mattresses #mattress #explore',
  },
  {
    id: 'vid2',
    videoId: 'Wvr3D6jQ-f4',
    embedUrl: 'https://www.youtube.com/embed/Wvr3D6jQ-f4',
    title: 'Natural Latex mattresses manufacturing in front of customer #latex #mattresses #mattress #explore',
  },
  {
    id: 'vid3',
    videoId: 'MVUFJ7sl2ME',
    embedUrl: 'https://www.youtube.com/embed/MVUFJ7sl2ME',
    title: 'Relaxpro Shuddha Padukunte rajula Lesthe simham la Work chesthe champion la! #explore #latexmattress',
  },
  {
    id: 'vid4',
    videoId: 'C6oW9K0AeFk',
    embedUrl: 'https://www.youtube.com/embed/C6oW9K0AeFk',
    title: '4" Rebonded 2" Hr foam 2" pure certified latex mattress with price details and manufacturing process',
  },
  {
    id: 'vid5',
    videoId: 'cm00ONL10DM',
    embedUrl: 'https://www.youtube.com/embed/cm00ONL10DM',
    title: 'Rebonded with Latex mattress manufacturing #explore #latex #mattress #latexmattress #trending',
  },
];

export default function CustomerVideos() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Determine visible count based on viewport width
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    const updateVisibleCount = () => {
      const w = window.innerWidth;
      if (w < 640) setVisibleCount(1);
      else if (w < 1024) setVisibleCount(2);
      else setVisibleCount(3);
    };
    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  const totalVideos = VIDEOS.length;
  const maxIndex = Math.max(0, totalVideos - visibleCount);

  const goTo = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(index, maxIndex));
    setCurrentIndex(clamped);
  }, [maxIndex]);

  const goNext = useCallback(() => goTo(currentIndex + 1), [goTo, currentIndex]);
  const goPrev = useCallback(() => goTo(currentIndex - 1), [goTo, currentIndex]);

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;
    if (Math.abs(diff) > threshold) {
      if (diff > 0) goNext();
      else goPrev();
    }
  };

  // Auto-advance timer — advances every 6 seconds, pauses on hover
  useEffect(() => {
    if (isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      goTo(currentIndex + 1);
    }, 6000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentIndex, isPaused, goTo]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goPrev, goNext]);

  const slideWidth = 100 / visibleCount;

  return (
    <section className="py-16 md:py-24 px-4 md:px-8 bg-white relative overflow-hidden">
      {/* Subtle background ornament */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <span className="inline-flex items-center gap-2 text-[11px] tracking-widest font-accent text-accent uppercase bg-accent/10 px-4 py-1.5 rounded-full font-bold">
            <Sparkles className="w-3.5 h-3.5" /> Watch Our Craftsmanship
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mt-4 text-primary leading-tight">
            See Our Craftsmanship
          </h2>
          <p className="text-neutral-dark/60 text-sm md:text-base mt-4 font-body leading-relaxed max-w-lg mx-auto">
            Watch real customers experience the craftsmanship of our GOLS-certified natural latex mattresses,
            straight from our Kerala factory.
          </p>
        </div>

        {/* Carousel Container */}
        <div
          className="relative group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Navigation Arrows */}
          <button
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="absolute left-2 md:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 backdrop-blur-sm border border-brand-200/40 shadow-md flex items-center justify-center text-primary hover:bg-accent hover:text-white transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer select-none"
            aria-label="Previous videos"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Slides Viewport */}
          <div
            ref={containerRef}
            className="overflow-hidden rounded-2xl"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <motion.div
              className="flex"
              animate={{ x: `-${currentIndex * slideWidth}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {VIDEOS.map((video) => (
                <div
                  key={video.id}
                  className="shrink-0 px-2 md:px-3"
                  style={{ width: `${slideWidth}%` }}
                >
                  <div
                    className="relative w-full rounded-xl md:rounded-2xl overflow-hidden bg-neutral-light border border-brand-200/40 shadow-sm group/card"
                    style={{ aspectRatio: '9 / 16' }}
                  >
                    <iframe
                      src={`${video.embedUrl}?autoplay=1&mute=1&rel=0&modestbranding=1`}
                      title={video.title}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                      loading="lazy"
                    />

                    {/* Bottom gradient overlay for text readability */}
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

                    {/* Video title */}
                    <div className="absolute bottom-3 left-3 right-3 z-10">
                      <p className="text-[10px] md:text-xs font-accent font-semibold text-white leading-tight line-clamp-2 drop-shadow-sm">
                        {video.title}
                      </p>
                    </div>

                    {/* Playing badge */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="inline-flex items-center gap-1 text-[8px] md:text-[9px] font-accent font-bold uppercase tracking-widest bg-accent/90 text-primary px-2 py-1 rounded-full shadow-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        Playing
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <button
            onClick={goNext}
            disabled={currentIndex >= maxIndex}
            className="absolute right-2 md:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 backdrop-blur-sm border border-brand-200/40 shadow-md flex items-center justify-center text-primary hover:bg-accent hover:text-white transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer select-none"
            aria-label="Next videos"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Fade edges for visual depth */}
          <div className="absolute inset-y-0 left-0 w-8 md:w-16 bg-gradient-to-r from-white to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-8 md:w-16 bg-gradient-to-l from-white to-transparent pointer-events-none" />
        </div>

        {/* Auto-advance indicator */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <span className={`text-[10px] font-accent font-bold uppercase tracking-widest transition-colors duration-300 ${isPaused ? 'text-accent' : 'text-neutral-dark/30'}`}>
            {isPaused ? 'Paused' : 'Auto-playing'}
          </span>
        </div>

        {/* Pagination Dots */}
        <div className="flex items-center justify-center gap-2 mt-3 md:mt-4">
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              className={`rounded-full transition-all duration-300 cursor-pointer select-none ${
                idx === currentIndex
                  ? 'w-8 h-2.5 bg-accent shadow-sm shadow-accent/30'
                  : 'w-2.5 h-2.5 bg-brand-200 hover:bg-accent/50'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Slide counter */}
        <div className="text-center mt-3">
          <span className="text-[11px] font-accent font-bold tracking-widest text-neutral-dark/40">
            {currentIndex + 1} / {maxIndex + 1}
          </span>
        </div>
      </div>
    </section>
  );
}
