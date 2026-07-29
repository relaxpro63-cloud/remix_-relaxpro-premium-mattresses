import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Award, Leaf, FileText, Download, X, ExternalLink, CheckCircle, Sparkles, ScrollText, Maximize2, Minimize2 } from 'lucide-react';
import { FadeUp, StaggerChildren, staggerItem } from '../motion/motionPrimitives';
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
  accentColor: string;
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
    accentColor: 'from-amber-500/20 to-amber-600/10',
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
    accentColor: 'from-blue-400/20 to-blue-500/10',
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
    accentColor: 'from-eco-500/20 to-eco-600/10',
  },
];

const accentColorMap: Record<string, string> = {
  iso: 'from-amber-500/20 to-amber-600/10',
  oeko: 'from-blue-400/20 to-blue-500/10',
  gols: 'from-eco-500/20 to-eco-600/10',
};

const iconMap: Record<string, React.ReactNode> = {
  iso: <Award className="w-7 h-7" />,
  oeko: <Shield className="w-7 h-7" />,
  gols: <Leaf className="w-7 h-7" />,
};

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
      {/* Backdrop */}
      <div className="absolute inset-0 bg-ink-900/60 backdrop-blur-md" />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
          width: isFullscreen ? '100%' : '100%',
          maxWidth: isFullscreen ? '100%' : '64rem',
          maxHeight: isFullscreen ? '100%' : '90vh',
          borderRadius: isFullscreen ? '0px' : '1.5rem',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white shadow-2xl flex flex-col overflow-hidden border border-brand-200/50"
      >
        {/* Header */}
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

        {/* PDF Embed */}
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
          accentColor: accentColorMap[cert.id] || 'from-brand-500/20 to-brand-600/10',
        }));
        setCertificates(mapped.filter(c => c.pdfUrl));
      }
    }).catch(() => {});
  }, []);

  return (
    <>
      <section className="relative overflow-hidden py-20 md:py-28 px-4 md:px-8 bg-gradient-to-b from-sky-50 via-sky-50 to-sky-100/30">
        {/* Premium abstract background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-amber-200/15 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-tl from-brand-200/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-gradient-to-br from-eco-200/10 to-transparent rounded-full blur-3xl" />
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Heading */}
          <FadeUp className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
            <span className="inline-flex items-center gap-1.5 text-[11px] tracking-widest font-accent font-bold text-amber-700 uppercase bg-amber-50 border border-amber-200/60 px-4 py-1.5 rounded-full shadow-sm">
              <Sparkles className="w-3 h-3" /> Trust & Compliance
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold tracking-tight mt-6 text-ink-900 leading-[1.1]">
              Certified Quality. <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-500">Trusted Worldwide.</span>
            </h2>
            <p className="text-graphite-600 text-base md:text-lg mt-5 font-body leading-relaxed max-w-2xl mx-auto">
              Every mattress we manufacture meets internationally recognized quality, safety, and sustainability standards, ensuring exceptional comfort, durability, and customer confidence.
            </p>
          </FadeUp>

          {/* Certificates Grid */}
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8" stagger={0.15}>
            {certificates.map((cert) => (
              <motion.div
                key={cert.id}
                variants={staggerItem}
                className="group relative bg-white/80 backdrop-blur-xl rounded-[1.75rem] border border-brand-200/40 hover:border-amber-300/60 shadow-lg shadow-ink-900/4 hover:shadow-2xl hover:shadow-brand-500/10 transition-all duration-500 flex flex-col overflow-hidden"
              >
                {/* Top accent gradient bar */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${cert.accentColor} opacity-80`} />

                {/* Card Content */}
                <div className="p-6 md:p-8 flex-1 flex flex-col">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-white border border-brand-200/40 shadow-sm flex items-center justify-center text-ink-900 group-hover:scale-110 group-hover:rotate-[-4deg] transition-all duration-500 mb-5">
                    <div className="text-brand-600 group-hover:text-amber-600 transition-colors duration-500">
                      {cert.icon}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-heading font-bold text-xl md:text-2xl text-ink-900 leading-tight">
                    {cert.title}
                  </h3>
                  <p className="text-[11px] font-accent font-bold uppercase tracking-widest text-amber-700/70 mt-1.5 mb-3">
                    {cert.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-sm text-graphite-600 font-body leading-relaxed flex-1">
                    {cert.description}
                  </p>

                  {/* Validity Badge */}
                  <div className="mt-5 inline-flex items-center gap-1.5 text-[10px] font-accent font-bold text-eco-600 bg-eco-50 border border-eco-500/20 px-3 py-1.5 rounded-full self-start">
                    <CheckCircle className="w-3 h-3" />
                    {cert.validity}
                  </div>

                  {/* View Certificate Button */}
                  <button
                    onClick={() => setActivePdf(cert)}
                    className="mt-6 w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl border border-amber-300/50 text-amber-800 bg-amber-50/50 hover:bg-amber-50 hover:border-amber-400 hover:-translate-y-0.5 font-accent font-bold text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer group/btn"
                  >
                    <FileText className="w-4 h-4 text-amber-600 group-hover/btn:scale-110 transition-transform duration-300" />
                    <span>View Certificate</span>
                    <ExternalLink className="w-3 h-3 text-amber-500/70 group-hover/btn:translate-x-0.5 transition-transform duration-300" />
                  </button>
                </div>

                {/* Hover glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/0 via-amber-500/0 to-brand-500/0 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-700 pointer-events-none -z-10" />
              </motion.div>
            ))}
          </StaggerChildren>

          {/* Trust Banner */}
          <FadeUp className="mt-16 md:mt-20">
            <div className="relative bg-gradient-to-br from-ink-900 to-ink-950 rounded-[2rem] p-8 md:p-12 overflow-hidden shadow-2xl shadow-ink-900/20">
              {/* Abstract glow */}
              <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-brand-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10">
                <span className="inline-flex items-center gap-1.5 text-[10px] tracking-widest font-accent font-bold text-amber-400 uppercase bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full mb-6">
                  <Shield className="w-3 h-3" /> Why Customers Trust RelaxPro
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {[
                    { icon: <Award className="w-5 h-5" />, text: 'Internationally Certified Quality' },
                    { icon: <Shield className="w-5 h-5" />, text: 'Safe & Tested Materials' },
                    { icon: <Leaf className="w-5 h-5" />, text: 'Sustainable Manufacturing' },
                    { icon: <Sparkles className="w-5 h-5" />, text: 'Premium Mattress Standards' },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.03, y: -2 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-4 backdrop-blur-sm"
                    >
                      <div className="w-10 h-10 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-400 shrink-0 border border-amber-500/20">
                        {item.icon}
                      </div>
                      <span className="text-sm font-accent font-bold text-white tracking-wide">{item.text}</span>
                    </motion.div>
                  ))}
                </div>
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
