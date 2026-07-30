import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Award, Leaf, FileText, Download, X, ExternalLink, CheckCircle, Sparkles, ScrollText, Maximize2, Minimize2, ChevronRight } from 'lucide-react';
import { FadeUp, StaggerChildren, staggerItem } from '../motion/motionPrimitives';
import { getSiteSettings } from '../../lib/queries';

interface Certificate {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  pdfUrl: string;
  pdfEmbedUrl: string;
  validity: string;
  logoImage: string;
}

const defaultCertificates: Certificate[] = [
  {
    id: 'gols',
    title: 'GOLS Certified Organic',
    subtitle: 'Global Organic Latex Standard',
    description:
      'Our organic latex components are certified under the Global Organic Latex Standard, ensuring sustainable sourcing, environmentally responsible manufacturing, and premium natural sleep comfort.',
    pdfUrl: 'https://drive.google.com/file/d/15NFHl1vK5jieVnClCTr95NQKk4w1Lu8S/view',
    pdfEmbedUrl: 'https://drive.google.com/file/d/15NFHl1vK5jieVnClCTr95NQKk4w1Lu8S/preview',
    validity: 'Valid — Organic Integrity Verified',
    logoImage: '/images/cert-gols-logo.png',
  },
  {
    id: 'iso',
    title: 'ISO 9001:2015',
    subtitle: 'Quality Management System',
    description:
      'Certified Quality Management System ensuring consistent manufacturing processes, rigorous quality control, and internationally recognized production standards.',
    pdfUrl: 'https://drive.google.com/file/d/1etftPWgHKB8QtviIrbEsLwb9xWav_xcG/view',
    pdfEmbedUrl: 'https://drive.google.com/file/d/1etftPWgHKB8QtviIrbEsLwb9xWav_xcG/preview',
    validity: 'Valid — Audited Annually',
    logoImage: '/images/cert-iso-logo.png',
  },
  {
    id: 'oeko',
    title: 'OEKO-TEX® STANDARD 100',
    subtitle: 'Textile Safety & Confidence',
    description:
      'Our certified fabrics are independently tested for harmful substances, providing safe, skin-friendly, and environmentally responsible sleep products.',
    pdfUrl: 'https://drive.google.com/file/d/1YTrKBrNx9L0ZWLqI5Q87UoEHXrnAu65q/view',
    pdfEmbedUrl: 'https://drive.google.com/file/d/1YTrKBrNx9L0ZWLqI5Q87UoEHXrnAu65q/preview',
    validity: 'Valid — Annual Renewal',
    logoImage: '/images/cert-oeko-logo.png',
  },
];

const trustItems = [
  { text: 'Premium Materials' },
  { text: 'International Standards' },
  { text: 'Safe for Families' },
  { text: 'Eco Friendly' },
];

function PdfModal({ cert, onClose }: { cert: Certificate; onClose: () => void }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-ink-900/60 backdrop-blur-md" />

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
          width: '100%',
          maxWidth: isFullscreen ? '100%' : '64rem',
          maxHeight: isFullscreen ? '100%' : '90vh',
          borderRadius: isFullscreen ? '0px' : '1.5rem',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white shadow-2xl flex flex-col overflow-hidden border border-brand-200/50"
      >
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-brand-200/40 bg-sky-50 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 border border-brand-600/20 shrink-0">
              <ScrollText className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="truncate">
              <h3 className="font-heading font-bold text-sm sm:text-base text-ink-900 truncate">{cert.title}</h3>
              <p className="text-[10px] sm:text-[11px] text-graphite-500 font-body truncate">{cert.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <a
              href={cert.pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-[11px] font-accent font-bold text-brand-600 hover:text-brand-700 bg-white border border-brand-200/50 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl hover:bg-brand-50 transition-all cursor-pointer"
            >
              <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> <span className="hidden sm:inline">Download</span>
            </a>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl bg-white border border-brand-200/50 hover:bg-brand-50 text-graphite-500 hover:text-ink-900 transition-all cursor-pointer"
              title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl bg-white border border-brand-200/50 hover:bg-brand-50 text-graphite-500 hover:text-ink-900 transition-all cursor-pointer"
            >
              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 bg-graphite-100 relative min-h-[50vh]">
          <iframe
            src={cert.pdfEmbedUrl}
            className="absolute inset-0 w-full h-full"
            title={`${cert.title} Certificate PDF`}
            allow="autoplay"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function CertificationsSection() {
  const navigate = useNavigate();
  const [activePdf, setActivePdf] = useState<Certificate | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>(defaultCertificates);

  useEffect(() => {
    getSiteSettings().then(data => {
      if (data?.certificates?.length > 0) {
        const mapped: Certificate[] = data.certificates.map((cert: any, idx: number) => ({
          id: cert.id || `cert-${idx}`,
          title: cert.title || defaultCertificates[idx]?.title || `Certificate ${idx + 1}`,
          subtitle: cert.subtitle || '',
          description: cert.description || '',
          pdfUrl: cert.pdfUrl || defaultCertificates[idx]?.pdfUrl || '',
          pdfEmbedUrl: cert.pdfEmbedUrl || defaultCertificates[idx]?.pdfEmbedUrl || '',
          validity: cert.validity || 'Valid',
          logoImage: defaultCertificates.find(d => d.id === cert.id)?.logoImage || defaultCertificates[0].logoImage,
        }));
        setCertificates(mapped.filter(c => c.pdfUrl));
      }
    }).catch(() => {});
  }, []);

  return (
    <>
      <section className="relative overflow-hidden py-14 xs:py-16 sm:py-20 md:py-24 lg:py-28 px-4 xs:px-5 sm:px-6 md:px-8 lg:px-10 bg-[#FAF8F5]">
        {/* Premium subtle organic texture */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}
        />

        <div className="max-w-[1200px] mx-auto relative z-10">
          {/* ===== Section Header ===== */}
          <FadeUp className="text-center max-w-3xl mx-auto mb-10 xs:mb-12 sm:mb-14 md:mb-16">
            <span className="inline-flex items-center gap-1.5 text-[9px] xs:text-[10px] sm:text-[11px] tracking-[0.18em] font-accent font-bold text-[#C8A96A] uppercase bg-amber-50/80 border border-[#C8A96A]/20 px-3 xs:px-4 py-1 xs:py-1.5 rounded-full shadow-sm">
              <Sparkles className="w-2.5 h-2.5 xs:w-3 xs:h-3" /> Certified Quality
            </span>
            <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-heading font-bold tracking-tight mt-4 xs:mt-5 text-ink-900 leading-[1.1]">
              Trusted by International <span className="text-[#C8A96A]">Quality Standards</span>
            </h2>
            <p className="text-graphite-600 text-sm xs:text-[15px] sm:text-base md:text-lg mt-3 xs:mt-4 font-body leading-relaxed max-w-2xl mx-auto">
              Every RelaxPro mattress is crafted using premium materials and manufactured to meet globally recognized quality, safety, and environmental standards. Sleep with complete confidence knowing your mattress is backed by certified excellence.
            </p>
          </FadeUp>

          {/* ===== Certification Logo Cards ===== */}
          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 xs:gap-6 sm:gap-8 lg:gap-12" stagger={0.15}>
            {certificates.map((cert) => (
              <motion.div
                key={cert.id}
                variants={staggerItem}
                className="group relative bg-white rounded-[16px] border border-[#C8A96A]/30 shadow-lg shadow-ink-900/4 hover:shadow-2xl hover:shadow-amber-500/15 transition-all duration-300 flex flex-col items-center text-center overflow-hidden cursor-pointer"
                style={{ transformStyle: 'preserve-3d' }}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                onClick={() => setActivePdf(cert)}
              >
                {/* Gold top accent */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#C8A96A] to-transparent opacity-60" />

                {/* Card content */}
                <div className="p-5 xs:p-6 sm:p-8 md:p-10 flex flex-col items-center w-full">
                  {/* Logo image */}
                  <div className="h-20 md:h-[76px] flex items-center justify-center mb-6">
                    <img
                      src={cert.logoImage}
                      alt={`${cert.title} logo`}
                      className="h-full w-auto object-contain transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>

                  {/* Hover gold glow ring */}
                  <div className="absolute inset-0 rounded-[16px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ boxShadow: 'inset 0 0 30px rgba(200, 169, 106, 0.15)' }}
                  />

                  {/* Title */}
                  <h3 className="font-heading font-bold text-base xs:text-lg md:text-xl text-ink-900 leading-tight">
                    {cert.title}
                  </h3>
                  <p className="text-[11px] font-accent font-bold uppercase tracking-widest text-[#C8A96A]/70 mt-1.5">
                    {cert.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-graphite-600 font-body leading-relaxed mt-4 line-clamp-3">
                    {cert.description}
                  </p>

                  {/* View Certificate link */}
                  <div className="mt-6 inline-flex items-center gap-1.5 text-[11px] font-accent font-bold text-[#C8A96A] hover:text-amber-700 transition-colors group/link">
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Certificate</span>
                    <ExternalLink className="w-3 h-3 opacity-60 group-hover/link:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </StaggerChildren>

          {/* ===== Trust Badges ===== */}
          <FadeUp className="mt-8 xs:mt-10 sm:mt-12 md:mt-14">
            <div className="flex flex-wrap items-center justify-center gap-2 xs:gap-3 md:gap-5">
              {trustItems.map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.04, y: -2 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className="inline-flex items-center gap-2 bg-white border border-[#C8A96A]/20 rounded-full px-4 py-2.5 shadow-sm hover:shadow-md hover:border-[#C8A96A]/40 transition-all duration-300"
                >
                  <div className="w-5 h-5 rounded-full bg-[#0F5B43]/10 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-3.5 h-3.5 text-[#0F5B43]" />
                  </div>
                  <span className="text-[11px] xs:text-xs sm:text-sm font-accent font-semibold text-ink-900 tracking-wide">
                    {item.text}
                  </span>
                </motion.div>
              ))}
            </div>
          </FadeUp>

          {/* ===== View Certificates CTA ===== */}
          <FadeUp className="mt-10 text-center">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/certificates')}
              className="inline-flex items-center gap-2.5 bg-[#0F5B43] text-white font-accent font-bold text-sm tracking-wide px-8 py-3.5 rounded-full shadow-lg shadow-[#0F5B43]/20 hover:shadow-xl hover:shadow-[#0F5B43]/30 border border-transparent hover:border-[#C8A96A]/50 transition-all duration-300 cursor-pointer group"
            >
              <span>View Certificates</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </motion.button>
          </FadeUp>
        </div>
      </section>

      {/* PDF Modal */}
      <AnimatePresence>
        {activePdf && <PdfModal cert={activePdf} onClose={() => setActivePdf(null)} />}
      </AnimatePresence>
    </>
  );
}
