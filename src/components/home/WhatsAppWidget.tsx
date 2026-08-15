import React from 'react';
import { buildWhatsAppUrl } from '../../lib/site';

export default function WhatsAppWidget() {
  const href = buildWhatsAppUrl(
    'Hello Suresh, I am visiting the RelaxPro Mattress website and would like specialized orthopedic mattress advice. Please guide me!',
  );

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with RelaxPro on WhatsApp"
      className="group fixed bottom-24 right-6 z-40 flex items-center rounded-full bg-[#25D366] p-3.5 text-white shadow-2xl shadow-emerald-600/30 transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <span
        className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping"
        aria-hidden="true"
      />
      <svg viewBox="0 0 24 24" className="relative h-6 w-6 shrink-0 fill-current" aria-hidden="true">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.413 9.863-9.83.001-2.624-1.023-5.091-2.884-6.957C16.586 1.964 14.111.94 11.488.94c-5.438 0-9.863 4.414-9.866 9.831-.001 1.942.509 3.826 1.481 5.534L2.016 20.2l4.631-1.046zM17.91 14.5c-.34-.17-2.015-.994-2.327-1.107-.31-.114-.537-.17-.762.17-.224.34-.868 1.107-1.064 1.332-.197.225-.394.25-.733.08-.339-.17-1.432-.527-2.73-1.682-1.01-.902-1.693-2.016-1.89-2.356-.198-.34-.021-.523.149-.693.153-.153.34-.397.51-.595.17-.198.226-.34.34-.567.113-.227.056-.425-.028-.595-.085-.17-.763-1.839-1.045-2.522-.275-.66-.554-.57-.762-.58-.198-.011-.424-.013-.65-.013-.226 0-.594.085-.905.424-.311.34-1.187 1.162-1.187 2.831 0 1.67 1.215 3.284 1.385 3.51.17.227 2.39 3.65 5.79 5.12.809.35 1.44.558 1.933.715.813.258 1.554.222 2.14.135.653-.097 2.016-.823 2.3-1.577.283-.755.283-1.401.198-1.537-.085-.136-.312-.222-.653-.392z" />
      </svg>
      <span className="hidden md:inline max-w-0 overflow-hidden whitespace-nowrap font-display text-xs font-semibold tracking-wide transition-all duration-500 group-hover:ml-2 group-hover:max-w-xs">
        WhatsApp Expert
      </span>
    </a>
  );
}