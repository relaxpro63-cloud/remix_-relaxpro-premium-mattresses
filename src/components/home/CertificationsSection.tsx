import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Award, Leaf, FileText, Download, X, ExternalLink, CheckCircle, ScrollText, Maximize2, Minimize2, Sparkles } from 'lucide-react';
import { FadeUp } from '../motion/motionPrimitives';
import { getSiteSettings } from '../../lib/queries';

// ─── Certificate Data ──────────────────────────────────────────────────────
interface Certificate {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  pdfUrl: string;
  pdfEmbedUrl: string;
  validity: string;
}

const defaultCertificates: Certificate[] = [
  {
    id: 'iso',
    icon: <Award className="w-7 h-7" />,
    title: 'ISO 9001:2015',
    subtitle: 'Quality Management System',
    description:
      'Certified Quality Management System ensuring consistent manufacturing processes, rigorous quality control, and internationally recognized production standards.',
    pdfUrl: 'https://drive.google.com/file/d/1etftPWgHKB8QtviIrbEsLwb9xWav_xcG/view',
    pdfEmbedUrl: 'https://drive.google.com/file/d/1etftPWgHKB8QtviIrbEsLwb9xWav_xcG/preview',
    validity: 'Valid — Audited Annually',
  },
  {
    id: 'oeko',
    icon: <Shield className="w-7 h-7" />,
    title: 'OEKO-TEX® STANDARD 100',
    subtitle: 'Textile Safety & Confidence',
    description:
      'Our certified fabrics are independently tested for harmful substances, providing safe, skin-friendly, and environmentally responsible sleep products.',
    pdfUrl: 'https://drive.google.com/file/d/1YTrKBrNx9L0ZWLqI5Q87UoEHXrnAu65q/view',
    pdfEmbedUrl: 'https://drive.google.com/file/d/1YTrKBrNx9L0ZWLqI5Q87UoEHXrnAu65q/preview',
    validity: 'Valid — Annual Renewal',
  },
  {
    id: 'gols',
    icon: <Leaf className="w-7 h-7" />,
    title: 'Global Organic Latex Standard',
    subtitle: 'GOLS Certified Organic',
    description:
      'Our organic latex components are certified under the Global Organic Latex Standard, ensuring sustainable sourcing, environmentally responsible manufacturing, and premium natural sleep comfort.',
    pdfUrl: 'https://drive.google.com/file/d/15NFHl1vK5jieVnClCTr95NQKk4w1Lu8S/view',
    pdfEmbedUrl: 'https://drive.google.com/file/d/15NFHl1vK5jieVnClCTr95NQKk4w1Lu8S/preview',
    validity: 'Valid — Organic Integrity Verified',
  },
];

const iconMap: Record<string, React.ReactNode> = {
  iso: <Award className="w-7 h-7" />,
  oeko: <Shield className="w-7 h-7" />,
  gols: <Leaf className="w-7 h-7" />,
};

const trustPoints = [
  { text: 'Internationally Certified Quality' },
  { text: 'Safe & Tested Materials' },
  { text: 'Sustainable Manufacturing' },
  { text: 'Premium Mattress Standards' },
];

// ─── PDF Modal ─────────────────────────────────────────────────────────────
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
          maxWidth: isFullscreen ? '100%' : '64rem',
          maxHeight: isFullscreen ? '100%' : '90vh',
          borderRadius: isFullscreen ? '0px' : '1.5rem',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white shadow-2xl flex flex-col overflow-hidden w-full"
        style={{ borderColor: '#D4A843', borderWidth: '1px' }}
      >
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b shrink-0"
          style={{ backgroundColor: '#FDF8F0', borderColor: 'rgba(212, 168, 67, 0.2)' }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: '#2D6A4F' }}
            >
              <ScrollText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="truncate">
              <h3 className="font-heading font-bold text-sm sm:text-base truncate" style={{ color: '#1B1B1B' }}>{cert.title}</h3>
              <p className="text-[10px] sm:text-[11px] font-body truncate" style={{ color: '#6B7280' }}>{cert.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <a
              href={cert.pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-[11px] font-accent font-bold px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl transition-all cursor-pointer"
              style={{ backgroundColor: '#2D6A4F', color: '#FFFFFF' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.9'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
            >
              <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> <span className="hidden sm:inline">Download</span>
            </a>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl transition-all cursor-pointer"
              style={{ backgroundColor: '#E8F0E4', color: '#2D6A4F' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#D4A843'; (e.currentTarget as HTMLElement).style.color = '#FFFFFF'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#E8F0E4'; (e.currentTarget as HTMLElement).style.color = '#2D6A4F'; }}
              title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl transition-all cursor-pointer"
              style={{ backgroundColor: '#FEE2E2', color: '#E07A5F' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#E07A5F'; (e.currentTarget as HTMLElement).style.color = '#FFFFFF'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#FEE2E2'; (e.currentTarget as HTMLElement).style.color = '#E07A5F'; }}
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

// ─── Main Component ────────────────────────────────────────────────────────
export default function CertificationsSection() {
  const [activePdf, setActivePdf] = useState<Certificate | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>(defaultCertificates);

  useEffect(() => {
    getSiteSettings().then(data => {
      if (data?.certificates?.length > 0) {
        const mapped: Certificate[] = data.certificates.map((cert: any, idx: number) => ({
          id: cert.id || `cert-${idx}`,
          icon: iconMap[cert.id] || iconMap['iso'],
          title: cert.title || defaultCertificates[idx]?.title || `Certificate ${idx + 1}`,
          subtitle: cert.subtitle || '',
          description: cert.description || '',
          pdfUrl: cert.pdfUrl || defaultCertificates[idx]?.pdfUrl || '',
          pdfEmbedUrl: cert.pdfEmbedUrl || defaultCertificates[idx]?.pdfEmbedUrl || '',
          validity: cert.validity || 'Valid',
        }));
        setCertificates(mapped.filter(c => c.pdfUrl));
      }
    }).catch(() => {});
  }, []);

  return (
    <>
      <section className="relative overflow-hidden py-20 md:py-28 px-4 md:px-8" style={{ backgroundColor: '#2D6A4F' }}>
        {/* ── Decorative Elements ── */}

        {/* Top-left: small branch with leaves */}
        <div className="absolute top-0 left-0 w-32 md:w-44 opacity-[0.08] pointer-events-none z-0">
          <img
            src="/assets/branch-leaves.png"
            alt=""
            aria-hidden="true"
            className="w-full h-auto -rotate-6"
          />
        </div>

        {/* Bottom-right: large faded rubber leaf */}
        <div className="absolute bottom-0 right-0 w-48 md:w-72 opacity-[0.06] pointer-events-none z-0">
          <img
            src="/assets/leaf-single.png"
            alt=""
            aria-hidden="true"
            className="w-full h-auto rotate-45"
          />
        </div>

        {/* Gold particle dots */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${2 + Math.random() * 3}px`,
                height: `${2 + Math.random() * 3}px`,
                backgroundColor: '#D4A843',
                opacity: 0.08,
                top: `${5 + Math.random() * 90}%`,
                left: `${5 + Math.random() * 90}%`,
              }}
              animate={{ opacity: [0.04, 0.12, 0.04] }}
              transition={{ duration: 3 + Math.random() * 3, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* ── Section Header ── */}
          <FadeUp className="text-center mb-14 md:mb-18">
            <span
              className="inline-flex items-center gap-1.5 text-[10px] tracking-widest font-accent font-bold uppercase px-4 py-1.5 rounded-full mb-4"
              style={{ backgroundColor: 'rgba(212, 168, 67, 0.15)', color: '#D4A843' }}
            >
              <Sparkles className="w-3 h-3" style={{ color: '#D4A843' }} />
              Trust & Compliance
            </span>

            <h2
              className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-[1.1]"
              style={{ color: '#FDF8F0' }}
            >
              Certified.{' '}
              <span className="italic" style={{ color: '#D4A843' }}>
                Trusted.
              </span>{' '}
              Proven.
            </h2>

            {/* Gold wavy underline */}
            <div className="flex justify-center mt-4">
              <div className="w-24 h-[2px]" style={{ backgroundColor: '#D4A843', opacity: 0.3, borderRadius: '1px' }} />
              <img src="/assets/sap-drop.png" alt="" aria-hidden="true" className="w-4 h-4 mx-1 opacity-25 -mt-1" />
              <div className="w-24 h-[2px]" style={{ backgroundColor: '#D4A843', opacity: 0.3, borderRadius: '1px' }} />
            </div>

            <p
              className="text-sm md:text-base mt-5 max-w-2xl mx-auto font-body leading-relaxed"
              style={{ color: 'rgba(253, 248, 240, 0.65)' }}
            >
              Every mattress we manufacture meets internationally recognized quality, safety, and sustainability standards.
            </p>
          </FadeUp>

          {/* ── Certificate Cards with Connecting Vine ── */}

          {/* Desktop: 3 cards with vine connectors */}
          <div className="hidden md:flex items-stretch gap-0 relative">
            {certificates.map((cert, idx) => (
              <React.Fragment key={cert.id}>
                {/* Card */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: idx * 0.15 }}
                  className="flex-1 flex flex-col rounded-[1.75rem] overflow-hidden relative group"
                  style={{
                    backgroundColor: '#FDF8F0',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)',
                  }}
                >
                  {/* Leaf-pattern watermark */}
                  <div
                    className="absolute inset-0 opacity-[0.04] pointer-events-none"
                    style={{
                      backgroundImage: 'url(/assets/leaf-pattern.png)',
                      backgroundRepeat: 'repeat',
                      backgroundSize: '200px',
                    }}
                  />

                  {/* Hover effect */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[1.75rem]"
                    style={{ boxShadow: 'inset 0 0 30px rgba(212, 168, 67, 0.06)' }}
                  />

                  {/* Top: Gold circle icon */}
                  <div className="flex justify-center pt-8 pb-4">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: -6 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                      className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg relative"
                      style={{ backgroundColor: '#D4A843' }}
                    >
                      <div className="text-white">
                        {cert.icon}
                      </div>
                      {/* Radiating ring */}
                      <div className="absolute inset-[-4px] rounded-full border-2" style={{ borderColor: 'rgba(212, 168, 67, 0.2)' }} />
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="px-6 pb-6 flex-1 flex flex-col relative z-10">
                    {/* Title */}
                    <h3 className="font-heading font-bold text-lg text-center" style={{ color: '#1B1B1B' }}>
                      {cert.title}
                    </h3>
                    <p className="text-[10px] font-accent font-bold uppercase tracking-widest text-center mt-1" style={{ color: '#D4A843', opacity: 0.7 }}>
                      {cert.subtitle}
                    </p>

                    {/* Description */}
                    <p className="text-xs mt-3 font-body leading-relaxed text-center flex-1" style={{ color: '#6B7280' }}>
                      {cert.description}
                    </p>

                    {/* Verified badge */}
                    <div
                      className="mt-4 inline-flex items-center gap-1.5 mx-auto text-[9px] font-accent font-bold px-3 py-1.5 rounded-full"
                      style={{ backgroundColor: '#E8F0E4', color: '#2D6A4F' }}
                    >
                      <CheckCircle className="w-3 h-3" />
                      {cert.validity}
                    </div>

                    {/* View Certificate Button */}
                    <button
                      onClick={() => setActivePdf(cert)}
                      className="mt-5 w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-accent font-bold text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer"
                      style={{
                        border: '2px solid #D4A843',
                        color: '#D4A843',
                        backgroundColor: 'transparent',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = '#D4A843';
                        (e.currentTarget as HTMLElement).style.color = '#FFFFFF';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                        (e.currentTarget as HTMLElement).style.color = '#D4A843';
                      }}
                    >
                      <FileText className="w-4 h-4" />
                      <span>View Certificate</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>

                {/* Vine connector between cards */}
                {idx < certificates.length - 1 && (
                  <div className="flex flex-col items-center justify-center px-1 -mb-8">
                    <div className="flex flex-col items-center gap-1.5">
                      {/* Dotted vine */}
                      <div className="w-px h-6 border-l border-dotted" style={{ borderColor: '#D4A843', opacity: 0.3 }} />
                      {/* Tiny leaf on vine */}
                      <img src="/assets/leaf-single.png" alt="" aria-hidden="true" className="w-3 h-3 opacity-25 -rotate-12" />
                      <div className="w-px h-6 border-l border-dotted" style={{ borderColor: '#D4A843', opacity: 0.3 }} />
                      {/* Sap drop */}
                      <img src="/assets/sap-drop.png" alt="" aria-hidden="true" className="w-2.5 h-2.5 opacity-20" />
                      <div className="w-px h-6 border-l border-dotted" style={{ borderColor: '#D4A843', opacity: 0.3 }} />
                      {/* Another tiny leaf */}
                      <img src="/assets/leaf-single.png" alt="" aria-hidden="true" className="w-3 h-3 opacity-20 rotate-45" />
                      <div className="w-px h-6 border-l border-dotted" style={{ borderColor: '#D4A843', opacity: 0.3 }} />
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Mobile: stacked cards */}
          <div className="md:hidden space-y-5">
            {certificates.map((cert, idx) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: idx * 0.1 }}
                className="rounded-[1.75rem] overflow-hidden relative"
                style={{
                  backgroundColor: '#FDF8F0',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                }}
              >
                <div
                  className="absolute inset-0 opacity-[0.04] pointer-events-none"
                  style={{
                    backgroundImage: 'url(/assets/leaf-pattern.png)',
                    backgroundRepeat: 'repeat',
                    backgroundSize: '200px',
                  }}
                />
                <div className="flex items-center gap-4 p-5">
                  <div className="w-14 h-14 rounded-full shrink-0 flex items-center justify-center shadow-md" style={{ backgroundColor: '#D4A843' }}>
                    <div className="text-white scale-75">{cert.icon}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-bold text-sm" style={{ color: '#1B1B1B' }}>{cert.title}</h3>
                    <p className="text-[9px] font-accent font-bold uppercase tracking-wider mt-0.5" style={{ color: '#D4A843', opacity: 0.7 }}>{cert.subtitle}</p>
                    <div className="inline-flex items-center gap-1 text-[8px] font-accent font-bold px-2 py-0.5 rounded-full mt-1.5" style={{ backgroundColor: '#E8F0E4', color: '#2D6A4F' }}>
                      <CheckCircle className="w-2 h-2" /> {cert.validity}
                    </div>
                  </div>
                </div>
                <p className="text-[11px] px-5 pb-3 font-body leading-relaxed" style={{ color: '#6B7280' }}>{cert.description}</p>
                <div className="px-5 pb-5">
                  <button
                    onClick={() => setActivePdf(cert)}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-accent font-bold text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer"
                    style={{
                      border: '2px solid #D4A843',
                      color: '#D4A843',
                      backgroundColor: 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = '#D4A843';
                      (e.currentTarget as HTMLElement).style.color = '#FFFFFF';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                      (e.currentTarget as HTMLElement).style.color = '#D4A843';
                    }}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Certificate</span>
                  </button>
                </div>

                {/* Vine connector below each card (except last) */}
                {idx < certificates.length - 1 && (
                  <div className="flex justify-center pb-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-8 h-px border-t border-dotted" style={{ borderColor: '#D4A843', opacity: 0.25 }} />
                      <img src="/assets/sap-drop.png" alt="" aria-hidden="true" className="w-2.5 h-2.5 opacity-20" />
                      <div className="w-8 h-px border-t border-dotted" style={{ borderColor: '#D4A843', opacity: 0.25 }} />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* ── Trust Points Below Cards ── */}
          <FadeUp delay={0.3}>
            <div className="mt-14 md:mt-16">
              <div className="flex flex-wrap justify-center gap-3 md:gap-6">
                {trustPoints.map((point, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -3 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl"
                    style={{
                      backgroundColor: 'rgba(253, 248, 240, 0.06)',
                      border: '1px solid rgba(212, 168, 67, 0.12)',
                    }}
                  >
                    {/* Gold leaf bullet */}
                    <div className="w-4 h-4 shrink-0 opacity-40">
                      <img
                        src="/assets/leaf-single.png"
                        alt=""
                        aria-hidden="true"
                        className="w-full h-auto"
                        style={{ filter: 'brightness(0) saturate(100%) invert(74%) sepia(32%) saturate(580%) hue-rotate(2deg) brightness(89%) contrast(87%)' }}
                      />
                    </div>
                    <span
                      className="text-xs sm:text-sm font-accent font-semibold tracking-wide"
                      style={{ color: 'rgba(253, 248, 240, 0.85)' }}
                    >
                      {point.text}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
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
