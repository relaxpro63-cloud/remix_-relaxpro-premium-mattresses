import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FadeUp, StaggerChildren, staggerItem } from '../../components/motion/motionPrimitives';
import { getCertifications, imageUrl } from '../../lib/queries';
import {
  Shield, Award, Leaf, FileText, Download, X, ExternalLink,
  CheckCircle, Sparkles, ScrollText, Maximize2, Minimize2, ArrowLeft, Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DecorativeBotanicals from '../../components/home/DecorativeBotanicals';

interface CertData {
  _id: string;
  title: string;
  slug: string;
  logoImage: any;
  certificateImage: any;
  subtitle: string;
  description: string;
  certificateNumber: string;
  issueDate: string;
  expiryDate: string;
  validity: string;
  pdfUrl: string;
  pdfEmbedUrl: string;
}

const fallbackCerts = [
  {
    _id: 'gols',
    title: 'GOLS Certified Organic',
    slug: 'gols',
    subtitle: 'Global Organic Latex Standard',
    description: 'Our organic latex components are certified under the Global Organic Latex Standard, ensuring sustainable sourcing, environmentally responsible manufacturing, and premium natural sleep comfort.',
    pdfUrl: 'https://drive.google.com/file/d/15NFHl1vK5jieVnClCTr95NQKk4w1Lu8S/view',
    pdfEmbedUrl: 'https://drive.google.com/file/d/15NFHl1vK5jieVnClCTr95NQKk4w1Lu8S/preview',
    validity: 'Valid — Organic Integrity Verified',
    issueDate: '2024-01-15',
    expiryDate: '2026-01-15',
    certificateNumber: 'GOLS-2024-IND-001',
  },
  {
    _id: 'iso',
    title: 'ISO 9001:2015',
    slug: 'iso',
    subtitle: 'Quality Management System',
    description: 'Certified Quality Management System ensuring consistent manufacturing processes, rigorous quality control, and internationally recognized production standards.',
    pdfUrl: 'https://drive.google.com/file/d/1etftPWgHKB8QtviIrbEsLwb9xWav_xcG/view',
    pdfEmbedUrl: 'https://drive.google.com/file/d/1etftPWgHKB8QtviIrbEsLwb9xWav_xcG/preview',
    validity: 'Valid — Audited Annually',
    issueDate: '2024-03-01',
    expiryDate: '2026-03-01',
    certificateNumber: 'ISO-9001-2024-IND',
  },
  {
    _id: 'oeko',
    title: 'OEKO-TEX® STANDARD 100',
    slug: 'oeko',
    subtitle: 'Textile Safety & Confidence',
    description: 'Our certified fabrics are independently tested for harmful substances, providing safe, skin-friendly, and environmentally responsible sleep products.',
    pdfUrl: 'https://drive.google.com/file/d/1YTrKBrNx9L0ZWLqI5Q87UoEHXrnAu65q/view',
    pdfEmbedUrl: 'https://drive.google.com/file/d/1YTrKBrNx9L0ZWLqI5Q87UoEHXrnAu65q/preview',
    validity: 'Valid — Annual Renewal',
    issueDate: '2024-06-01',
    expiryDate: '2026-06-01',
    certificateNumber: 'OEKO-TEX-2024-IND',
  },
] as CertData[];

function PdfModal({ cert, onClose }: { cert: CertData; onClose: () => void }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const pdfEmbed = cert.pdfEmbedUrl || '';

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
          opacity: 1, scale: 1, y: 0,
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
          {pdfEmbed ? (
            <iframe
              src={pdfEmbed}
              className="absolute inset-0 w-full h-full"
              title={`${cert.title} Certificate PDF`}
              allow="autoplay"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <FileText className="w-12 h-12 text-graphite-400 mx-auto mb-3" />
                <p className="text-graphite-500 font-accent text-sm">PDF preview not available</p>
                <a href={cert.pdfUrl} target="_blank" rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-2 text-brand-600 text-sm font-bold cursor-pointer">
                  Open PDF <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function CertificatesPage() {
  const navigate = useNavigate();
  const [certs, setCerts] = useState<CertData[]>(fallbackCerts);
  const [activePdf, setActivePdf] = useState<CertData | null>(null);

  useEffect(() => {
    getCertifications().then((data: any[]) => {
      if (data?.length > 0) {
        setCerts(data.map((c: any) => ({
          ...c,
          pdfUrl: c.pdfUrl || '',
          pdfEmbedUrl: c.pdfEmbedUrl || '',
        })));
      }
    }).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#F3F9FD] relative overflow-hidden">
      <DecorativeBotanicals density="light" />
      {/* ===== Hero Section ===== */}
      <section className="relative overflow-hidden py-20 md:py-28 px-4 md:px-8 bg-gradient-to-b from-sky-50 to-[#F3F9FD]">
        <div className="max-w-[1200px] mx-auto">
          <FadeUp className="text-center max-w-3xl mx-auto">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1.5 text-[11px] font-accent font-bold text-graphite-500 hover:text-brand-600 mb-8 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] tracking-[0.18em] font-accent font-bold text-[#3D95D6] uppercase bg-brand-50/80 border border-[#3D95D6]/20 px-4 py-1.5 rounded-full shadow-sm">
              <Sparkles className="w-3 h-3" /> Transparency & Trust
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold tracking-tight mt-5 text-ink-900 leading-[1.1]">
              Our <span className="text-[#3D95D6]">Certifications</span>
            </h1>
            <p className="text-graphite-600 text-sm sm:text-base md:text-lg mt-4 font-body leading-relaxed max-w-2xl mx-auto">
              Transparency builds trust. Explore the certifications that validate the quality, safety, and sustainability of every RelaxPro mattress.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ===== Certificate Cards ===== */}
      <section className="max-w-[1200px] mx-auto px-4 md:px-8 pb-20 md:pb-28 -mt-6 relative z-10">
        <StaggerChildren className="space-y-8 md:space-y-10" stagger={0.12}>
          {certs.map((cert, idx) => (
            <motion.div
              key={cert._id}
              variants={staggerItem}
              className="bg-white rounded-[20px] border border-[#3D95D6]/20 shadow-lg shadow-ink-900/4 overflow-hidden hover:shadow-xl hover:shadow-brand-500/10 transition-all duration-300 group"
            >
              <div className="flex flex-col md:flex-row">
                {/* Left: Certificate Preview */}
                <div className="md:w-[280px] lg:w-[320px] shrink-0 bg-gradient-to-br from-sky-50 to-brand-50/30 p-6 md:p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-[#3D95D6]/20">
                  <div className="w-full aspect-[3/4] max-w-[200px] mx-auto bg-white rounded-xl border border-brand-200/30 shadow-sm flex items-center justify-center overflow-hidden mb-4">
                    {cert.certificateImage ? (
                      <img
                        src={imageUrl(cert.certificateImage, 400)}
                        alt={cert.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <FileText className="w-12 h-12 text-brand-300/50" />
                    )}
                  </div>
                  <button
                    onClick={() => setActivePdf(cert)}
                    className="text-[10px] font-accent font-bold uppercase tracking-widest text-[#3D95D6] hover:text-brand-700 border border-[#3D95D6]/30 px-4 py-2 rounded-full transition-all cursor-pointer hover:bg-brand-50/50"
                  >
                    <ExternalLink className="w-3 h-3 inline mr-1.5" /> View Full Certificate
                  </button>
                </div>

                {/* Right: Details */}
                <div className="flex-1 p-6 md:p-8 lg:p-10">
                  {/* Logo + Title row */}
                  <div className="flex items-start gap-4 mb-5">
                    <div className="w-14 h-14 rounded-xl bg-white border border-[#3D95D6]/20 shadow-sm flex items-center justify-center p-2.5 shrink-0">
                      <img
                        src={cert.logoImage ? imageUrl(cert.logoImage, 200) : `/images/cert-${cert.slug || cert._id}-logo.png`}
                        alt={`${cert.title} logo`}
                        className="w-full h-full object-contain"
                        loading="lazy"
                      />
                    </div>
                    <div>
                      <h2 className="font-heading font-bold text-xl md:text-2xl text-ink-900 leading-tight">
                        {cert.title}
                      </h2>
                      {cert.subtitle && (
                        <p className="text-[11px] font-accent font-bold uppercase tracking-widest text-[#3D95D6]/70 mt-1">
                          {cert.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-graphite-600 font-body leading-relaxed mb-6">
                    {cert.description}
                  </p>

                  {/* Meta info grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    {cert.issueDate && (
                      <div className="bg-sky-50 rounded-xl px-4 py-3 border border-brand-200/30">
                        <span className="text-[9px] font-accent font-bold uppercase tracking-widest text-graphite-500">Issue Date</span>
                        <p className="text-sm font-body text-ink-900 font-medium mt-0.5 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-brand-500" />
                          {new Date(cert.issueDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                    )}
                    {cert.expiryDate && (
                      <div className="bg-sky-50 rounded-xl px-4 py-3 border border-brand-200/30">
                        <span className="text-[9px] font-accent font-bold uppercase tracking-widest text-graphite-500">Expiry Date</span>
                        <p className="text-sm font-body text-ink-900 font-medium mt-0.5 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-brand-500" />
                          {new Date(cert.expiryDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                    )}
                    {cert.validity && (
                      <div className="bg-eco-50 rounded-xl px-4 py-3 border border-eco-500/20">
                        <span className="text-[9px] font-accent font-bold uppercase tracking-widest text-eco-600">Status</span>
                        <p className="text-sm font-body text-eco-700 font-medium mt-0.5 flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-eco-500" />
                          {cert.validity}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Download Button */}
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={cert.pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 bg-[#063D64] text-white text-[12px] font-accent font-bold px-5 py-3 rounded-xl hover:bg-[#05304F] transition-all shadow-lg shadow-[#063D64]/20 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      Download Certificate
                    </a>
                    <button
                      onClick={() => setActivePdf(cert)}
                      className="inline-flex items-center gap-2 bg-white border border-[#3D95D6]/30 text-ink-900 text-[12px] font-accent font-bold px-5 py-3 rounded-xl hover:border-[#3D95D6]/60 hover:bg-brand-50/30 transition-all cursor-pointer"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Online
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </StaggerChildren>

        {/* Trust Statement */}
        <FadeUp className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 bg-white border border-[#3D95D6]/20 rounded-full px-6 py-3 shadow-sm">
            <CheckCircle className="w-5 h-5 text-[#063D64]" />
            <span className="text-sm font-accent font-bold text-ink-900">
              All certificates are verified and up to date
            </span>
          </div>
        </FadeUp>
      </section>

      {/* PDF Modal */}
      <AnimatePresence>
        {activePdf && <PdfModal cert={activePdf} onClose={() => setActivePdf(null)} />}
      </AnimatePresence>
    </div>
  );
}
