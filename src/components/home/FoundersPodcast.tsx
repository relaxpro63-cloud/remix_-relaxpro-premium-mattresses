import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'motion/react';
import { FadeUp, StaggerChildren, staggerItem } from '../motion/motionPrimitives';
import { getHomePage } from '../../lib/queries';
import {
  Play, Mic, ChevronRight, Quote, CheckCircle,
  Clock, Youtube, Star
} from 'lucide-react';

const YOUTUBE_ID = '7dcWsDOjMBg';
const YOUTUBE_URL = `https://www.youtube-nocookie.com/embed/${YOUTUBE_ID}?rel=0&autoplay=1`;

const highlights = [
  'Finding the Gap in India\'s Mattress Industry',
  'Why 100% Natural Latex Matters',
  'One-Hour Custom Mattress Manufacturing',
  'Raw Materials from Sri Lanka & Thailand',
  'Egg Test & Water Test Demonstrations',
  'Building Customer Trust Through Transparency',
  'From First-Time Entrepreneur to Premium Brand',
];

const defaultHeader = {
  sectionBadge: 'Our Journey',
  sectionTitle: "The Story Behind Every Better Night's Sleep",
  sectionSubtitle: 'Discover the vision, innovation, and passion behind RelaxPro directly from our founder through this exclusive business podcast.',
};

export default function FoundersPodcast() {
  const navigate = useNavigate();
  const [playVideo, setPlayVideo] = useState(false);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  useInView(videoContainerRef, { once: true, margin: '-100px' });
  const [header, setHeader] = useState(defaultHeader);

  useEffect(() => {
    getHomePage().then((h: any) => {
      if (h?.foundersPodcast?.sectionTitle) {
        setHeader({
          sectionBadge: h.foundersPodcast.sectionBadge || defaultHeader.sectionBadge,
          sectionTitle: h.foundersPodcast.sectionTitle,
          sectionSubtitle: h.foundersPodcast.sectionSubtitle || defaultHeader.sectionSubtitle,
        });
      }
    }).catch(() => {});
  }, []);

  const handlePlay = () => setPlayVideo(true);

  return (
    <section className="relative overflow-hidden py-12 xs:py-14 sm:py-16 md:py-20 lg:py-24 px-4 xs:px-5 sm:px-6 md:px-8 lg:px-10 bg-[#FAF8F5]">
      {/* Subtle organic background texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}
      />

      <div className="max-w-[1400px] mx-auto relative z-10">
        {/* ===== Section Heading Above Container ===== */}
        <FadeUp className="text-center max-w-3xl mx-auto mb-10 xs:mb-12 sm:mb-14 md:mb-16">
          <span className="inline-flex items-center gap-1.5 text-[9px] xs:text-[10px] sm:text-[11px] tracking-[0.18em] font-accent font-bold text-[#C8A96A] uppercase bg-amber-50/80 border border-[#C8A96A]/20 px-3 xs:px-4 py-1 xs:py-1.5 rounded-full shadow-sm">
            <Mic className="w-2.5 h-2.5 xs:w-3 xs:h-3" /> {header.sectionBadge}
          </span>
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-heading font-bold tracking-tight mt-4 xs:mt-5 text-ink-900 leading-[1.1]">
            {header.sectionTitle}
          </h2>
          <p className="text-graphite-600 text-sm sm:text-base md:text-lg mt-4 font-body leading-relaxed max-w-2xl mx-auto">
            {header.sectionSubtitle}
          </p>
        </FadeUp>

        {/* ===== Main Container ===== */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="bg-[#FCFCF8] rounded-[28px] border border-[#ECE8DF] shadow-xl shadow-ink-900/3 overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row">
            {/* ===== LEFT: Video (55%) ===== */}
            <div className="w-full lg:w-[55%] p-4 xs:p-5 md:p-8 lg:p-10">
              <div
                ref={videoContainerRef}
                className="relative rounded-2xl overflow-hidden bg-ink-900 shadow-2xl shadow-ink-900/20 group cursor-pointer"
                style={{ aspectRatio: '16/9' }}
              >
                {!playVideo ? (
                  <>
                    {/* Thumbnail with play button */}
                    <img
                      src={`https://img.youtube.com/vi/${YOUTUBE_ID}/maxresdefault.jpg`}
                      alt="RelaxPro Founder Podcast - Zero to RelaxPro Journey"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-ink-900/30 group-hover:bg-ink-900/20 transition-all duration-500" />

                    {/* Duration badge */}
                    <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-black/70 backdrop-blur-sm text-white text-[10px] font-accent font-bold px-3 py-1.5 rounded-full border border-white/10">
                      <Clock className="w-3 h-3" /> 1 Hour+
                    </div>

                    {/* YouTube icon */}
                    <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-red-600 flex items-center justify-center shadow-lg">
                      <Youtube className="w-4 h-4 text-white" />
                    </div>

                    {/* Play button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handlePlay}
                        className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/95 shadow-2xl flex items-center justify-center transition-all duration-300 hover:shadow-[#C8A96A]/30 hover:shadow-2xl cursor-pointer"
                      >
                        <motion.div
                          animate={{ scale: [1, 1.08, 1] }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        >
                          <Play className="w-6 h-6 md:w-7 md:h-7 text-[#0F5B43] ml-1" />
                        </motion.div>
                      </motion.button>
                    </div>
                  </>
                ) : (
                  <iframe
                    src={YOUTUBE_URL}
                    className="absolute inset-0 w-full h-full"
                    title="Zero నుండి RelaxPro వరకు – How We Built a Premium Natural Latex Mattress Brand | VOM Podcast"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                )}
              </div>

              {/* Video metadata */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex flex-wrap items-center gap-3 mt-4 text-[11px] font-accent text-graphite-500"
              >
                <span className="inline-flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-brand-500" />
                  Voice of Mogasala Podcast
                </span>
                <span className="w-1 h-1 rounded-full bg-graphite-300" />
                <span>Business Story</span>
                <span className="w-1 h-1 rounded-full bg-graphite-300" />
                <span>Telugu</span>
                <span className="w-1 h-1 rounded-full bg-graphite-300" />
                <span>Founder Interview</span>
              </motion.div>
            </div>

            {/* ===== RIGHT: Content (45%) ===== */}
            <div className="w-full lg:w-[45%] p-4 xs:p-5 md:p-8 lg:p-10 lg:pl-0 lg:pr-10 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Badge */}
                <span className="inline-flex items-center gap-1.5 text-[8px] xs:text-[9px] sm:text-[10px] tracking-[0.15em] font-accent font-bold text-[#0F5B43] uppercase bg-[#0F5B43]/8 border border-[#0F5B43]/15 px-2 xs:px-3 py-1 xs:py-1.5 rounded-full mb-3 xs:mb-4">
                  <Star className="w-3 h-3" /> Founder's Podcast
                </span>

                {/* Small heading */}
                <p className="text-[11px] font-accent font-bold uppercase tracking-[0.12em] text-graphite-500 mb-1">
                  Hear Directly From Our Founder
                </p>

                {/* Large heading */}
                <h3 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-ink-900 leading-[1.15] tracking-tight">
                  Zero నుండి RelaxPro వరకు
                </h3>
                <p className="text-sm xs:text-base sm:text-lg font-heading text-graphite-600 mt-1 xs:mt-1.5 leading-snug">
                  How We Built a Premium Natural Latex Mattress Brand
                </p>

                {/* Description */}
                <p className="text-sm text-graphite-600 font-body leading-relaxed mt-4">
                  Every great mattress begins with a story. In this exclusive Voice of Mogasala podcast, RelaxPro Founder Mr. Suresh shares the complete entrepreneurial journey — from identifying a major gap in India's mattress industry to building one of the country's trusted premium natural latex mattress brands.
                </p>
                <p className="text-sm text-graphite-600 font-body leading-relaxed mt-2">
                  Learn how transparency, craftsmanship, customer education, and customized sleep solutions became the foundation of RelaxPro.
                </p>
              </motion.div>

              {/* ===== Highlights ===== */}
              <StaggerChildren className="mt-4 xs:mt-5 sm:mt-6 space-y-1.5 xs:space-y-2" stagger={0.06}>
                {highlights.map((item, i) => (
                  <motion.div
                    key={i}
                    variants={staggerItem}
                    className="flex items-start gap-2.5"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#0F5B43]/10 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle className="w-3 h-3 text-[#0F5B43]" />
                    </div>
                    <span className="text-xs sm:text-sm text-graphite-700 font-body leading-relaxed">{item}</span>
                  </motion.div>
                ))}
              </StaggerChildren>

              {/* ===== Quote Card ===== */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-4 xs:mt-5 sm:mt-6 relative bg-white/70 backdrop-blur-xl border border-amber-200/40 rounded-xl xs:rounded-2xl p-4 xs:p-5 shadow-md"
              >
                <Quote className="absolute -top-2 -left-2 w-8 h-8 text-[#C8A96A]/30" />
                <div className="relative z-10">
                  <p className="text-sm italic text-ink-900 font-body leading-relaxed">
                    "We don't just manufacture mattresses — we educate people to choose healthier sleep."
                  </p>
                  <p className="text-[11px] font-accent font-bold text-graphite-500 mt-3">
                    — Suresh, Founder, RelaxPro Mattresses
                  </p>
                </div>
              </motion.div>

              {/* ===== CTAs ===== */}
              <div className="mt-4 xs:mt-5 sm:mt-6 flex flex-col sm:flex-row gap-2 xs:gap-3">
                <motion.a
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  href={`https://www.youtube.com/watch?v=${YOUTUBE_ID}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#0F5B43] text-white font-accent font-bold text-xs sm:text-sm tracking-wide px-6 py-3.5 rounded-xl shadow-lg shadow-[#0F5B43]/20 hover:shadow-xl hover:shadow-[#0F5B43]/30 transition-all duration-300 cursor-pointer group"
                >
                  <Play className="w-4 h-4" fill="currentColor" />
                  <span>Watch Full Podcast</span>
                </motion.a>
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/about')}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-white border-2 border-[#C8A96A]/30 text-ink-900 font-accent font-bold text-xs sm:text-sm tracking-wide px-6 py-3.5 rounded-xl hover:border-[#C8A96A]/60 hover:bg-amber-50/30 transition-all duration-300 cursor-pointer group"
                >
                  <span>Read Our Story</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
