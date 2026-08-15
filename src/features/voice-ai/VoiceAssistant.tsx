import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { MessageSquare, X, Send, Volume2, VolumeX } from 'lucide-react';
import MessageList from './components/MessageList';
import ProductRecommendationCard from './components/ProductRecommendationCard';
import QuickActions from './components/QuickActions';
import MicButton from './components/MicButton';
import LanguagePicker from './components/LanguagePicker';
import { useChat } from './hooks/useChat';
import { useVoiceRecognition } from './hooks/useVoiceRecognition';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import { LANGUAGES } from './lib/languages';
import { buildWhatsAppUrl } from '../../lib/site';
import type { RecommendedProduct } from './types';

export const GREETING =
  'Namaskaram! 👋 Nenu meeku right mattress choose cheyyadaniki help chestanu.';

export default function VoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const chat = useChat();

  const languageConfig = LANGUAGES[chat.language];
  const speech = useSpeechSynthesis();
  const voice = useVoiceRecognition(languageConfig.asr);

  const speakReply = (text: string) => {
    speech.speak(text, languageConfig.tts, languageConfig.ttsFallback);
  };

  // A finished transcript becomes the draft; the customer confirms before sending,
  // so a misheard phrase is corrected rather than sent.
  React.useEffect(() => {
    if (voice.transcript) setDraft(voice.transcript);
  }, [voice.transcript]);

  const handleMicStart = () => {
    speech.stop();
    voice.reset();
    voice.start();
  };

  const navigate = useNavigate();

  const handleNavigate = (url: string) => {
    setIsOpen(false);
    navigate(url);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleEnquire = (product: RecommendedProduct) => {
    const price = product.price !== null ? ` (₹${product.price.toLocaleString('en-IN')})` : '';
    window.open(
      buildWhatsAppUrl(`Hi RelaxPro, I am interested in the ${product.name} mattress${price}.`),
      '_blank',
    );
  };

  const handleQuickAction = async (prompt: string) => {
    const reply = await chat.send(prompt);
    if (reply) speakReply(reply);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setDraft('');
    voice.reset();
    const reply = await chat.send(text);
    if (reply) speakReply(reply);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Talk to RelaxPro AI"
        className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-700 via-brand-500 to-brand-700 px-5 py-3.5 text-white shadow-2xl shadow-brand-600/30 transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <MessageSquare className="w-5 h-5 shrink-0" aria-hidden="true" />
        <span className="hidden md:inline text-xs font-bold uppercase tracking-widest">
          Talk to RelaxPro AI
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-ink-950/40 md:hidden"
              aria-hidden="true"
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="RelaxPro AI assistant"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              className="fixed z-50 flex flex-col bg-white shadow-2xl inset-x-0 bottom-0 h-[85vh] rounded-t-3xl md:inset-auto md:bottom-6 md:right-6 md:h-[600px] md:w-[400px] md:rounded-3xl"
            >
              <header className="flex items-center justify-between border-b border-graphite-200 px-4 py-3">
                <div>
                  <p className="font-display text-base font-semibold text-ink-900">RelaxPro AI</p>
                  <p className="text-[11px] uppercase tracking-widest text-graphite-400">
                    Mattress consultant
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  {speech.isSupported && (
                    <button
                      type="button"
                      onClick={() => speech.setEnabled(!speech.enabled)}
                      aria-label={speech.enabled ? 'Turn voice replies off' : 'Turn voice replies on'}
                      aria-pressed={speech.enabled}
                      className="rounded-full p-2 text-graphite-500 transition-colors hover:bg-linen-100 hover:text-ink-900"
                    >
                      {speech.enabled ? (
                        <Volume2 className="h-5 w-5" aria-hidden="true" />
                      ) : (
                        <VolumeX className="h-5 w-5" aria-hidden="true" />
                      )}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close RelaxPro AI"
                    className="rounded-full p-2 text-graphite-500 transition-colors hover:bg-linen-100 hover:text-ink-900"
                  >
                    <X className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </header>

              <div className="flex items-center justify-between border-b border-graphite-100 px-4 py-2">
                <LanguagePicker value={chat.language} onChange={chat.setLanguage} />
              </div>

              {chat.messages.length === 0 && (
                <>
                  <div className="px-4 pt-5 pb-3">
                    <p className="text-sm leading-relaxed text-graphite-700">{GREETING}</p>
                  </div>
                  <QuickActions
                    onSelect={handleQuickAction}
                    disabled={chat.status === 'sending'}
                  />
                </>
              )}

              <MessageList
                messages={chat.messages}
                isSending={chat.status === 'sending'}
                onReplay={speakReply}
              >
                {chat.products.length > 0 && chat.status === 'idle' && (
                  <div
                    className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-1"
                    aria-label="Recommended mattresses"
                  >
                    {chat.products.map((product) => (
                      <React.Fragment key={product.slug}>
                        <ProductRecommendationCard
                          product={product}
                          onNavigate={handleNavigate}
                          onEnquire={handleEnquire}
                        />
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </MessageList>

              <div className="border-t border-graphite-200 px-3 py-3">
                {voice.isListening && (
                  <p className="mb-2 flex items-center gap-2 px-1 text-[11px] font-medium text-red-500">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" aria-hidden="true" />
                    Listening… tap the square to stop
                  </p>
                )}
                {voice.error && (
                  <p role="alert" className="mb-2 px-1 text-[11px] text-graphite-600">
                    {voice.error}
                  </p>
                )}

                {/*
                  Spec §11: a WhatsApp escape hatch must be reachable from every error state.
                  Keeping it permanently in the footer covers the chat-failure, mic-failure,
                  unsupported-browser, and no-results cases with one control.
                */}
                <a
                  href={buildWhatsAppUrl('Hi RelaxPro, I need help choosing a mattress.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mb-2 block px-1 text-[11px] font-medium text-brand-600 underline-offset-2 hover:underline"
                >
                  Talk to a RelaxPro expert on WhatsApp
                </a>

                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                  <label htmlFor="relaxpro-ai-input" className="sr-only">
                    Type your question
                  </label>
                  <input
                    id="relaxpro-ai-input"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder={voice.interimTranscript || 'Naaku queen mattress kavali...'}
                    autoComplete="off"
                    className="min-h-11 flex-1 rounded-full border border-graphite-200 bg-linen-50 px-4 text-sm text-ink-900 placeholder:text-graphite-400 focus:border-brand-500 focus:outline-none"
                  />
                  {voice.isSupported && (
                    <MicButton
                      isListening={voice.isListening}
                      disabled={chat.status === 'sending'}
                      onStart={handleMicStart}
                      onStop={voice.stop}
                    />
                  )}
                  <button
                    type="submit"
                    disabled={!draft.trim() || chat.status === 'sending'}
                    aria-label="Send message"
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-600 text-white transition-colors hover:bg-brand-700 disabled:opacity-40"
                  >
                    <Send className="h-4 w-4" aria-hidden="true" />
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
