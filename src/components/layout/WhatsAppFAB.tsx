import { WHATSAPP_NUMBER } from '../../lib/site';
import { MessageCircle } from 'lucide-react';

const defaultMessage = 'Hello Suresh, I am visiting the RelaxPro Mattress website and would like a specialized orthopedic mattress advice. Please guide me!';

export default function WhatsAppFAB() {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-full px-5 py-3 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
    >
      <MessageCircle className="w-5 h-5" />
      <span className="hidden sm:inline text-sm font-medium">Chat on WhatsApp</span>
    </a>
  );
}
