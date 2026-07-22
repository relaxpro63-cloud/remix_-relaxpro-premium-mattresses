import React, { useState, useEffect } from 'react';
import { MapPin, MessageSquare, Phone } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../../lib/site';
import { getHomePage } from '../../lib/queries';

interface QuickConnectBarProps {
  onFindStore?: () => void;
  onLiveChat?: () => void;
  onConnectNow?: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  'map-pin': <MapPin className="w-5 h-5 md:w-6 md:h-6 mb-1.5 md:mb-2 text-primary group-hover:text-accent transition-colors" />,
  'message-square': <MessageSquare className="w-5 h-5 md:w-6 md:h-6 mb-1.5 md:mb-2 text-primary group-hover:text-accent transition-colors" />,
  phone: <Phone className="w-5 h-5 md:w-6 md:h-6 mb-1.5 md:mb-2 text-primary group-hover:text-accent transition-colors" />,
};

const defaultItems = [
  { id: 'store', label: 'Find Store', icon: 'map-pin' },
  { id: 'chat', label: 'Live Chat', icon: 'message-square' },
  { id: 'connect', label: 'Connect Now', icon: 'phone' },
];

export default function QuickConnectBar({
  onFindStore,
  onLiveChat,
  onConnectNow,
}: QuickConnectBarProps) {
  const [items, setItems] = useState(defaultItems);

  useEffect(() => {
    getHomePage().then(p => {
      const q = p?.quickConnect?.items;
      if (q?.length > 0) setItems(q);
    }).catch(() => {});
  }, []);

  const getHandler = (item: any) => {
    if (item.id === 'store') return onFindStore || (() => document.getElementById('locations')?.scrollIntoView({ behavior: 'smooth' }));
    if (item.id === 'chat') return onLiveChat || (() => window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank'));
    return onConnectNow || (() => window.open(`tel:+${WHATSAPP_NUMBER}`, '_self'));
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 my-8">
      <div className="bg-slate-50/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl flex flex-row divide-x divide-slate-200/60 overflow-hidden shadow-sm">
        {items.map((item: any) => (
          <button
            key={item.id}
            onClick={getHandler(item)}
            className="group flex-1 flex flex-col items-center justify-center py-4 md:py-6 px-1 md:px-2 hover:bg-slate-100/80 transition-all duration-200 cursor-pointer"
          >
            {iconMap[item.icon] || iconMap[item.id] || <MapPin className="w-5 h-5 md:w-6 md:h-6 mb-1.5 md:mb-2 text-primary group-hover:text-accent transition-colors" />}
            <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-primary font-heading tracking-wide group-hover:text-primary-dark transition-colors text-center leading-tight">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
