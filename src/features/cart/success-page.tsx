import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Check, MessageSquare, ArrowRight } from 'lucide-react';
import { buildWhatsAppUrl } from '../../lib/site';
import { getSiteSettings } from '../../lib/queries';
import PriceText from '../../components/ui/PriceText';
import SEO from '../../components/seo/SEO';
import PageShell from '../../components/layout/PageShell';
import Confetti from '../../components/ui/Confetti';
import type { OrderReceipt } from '../../types';

interface SuccessPageProps {
  orderReceipt: OrderReceipt | null;
  onReset: () => void;
}

export default function SuccessPage({ orderReceipt, onReset }: SuccessPageProps) {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    getSiteSettings().then(s => setSettings(s)).catch(() => {});
  }, []);

  const siteTitle = settings?.branding?.siteName || 'RelaxPro Premium Mattresses';
  const pageTitle = `Order Success | ${siteTitle}`;
  const pageDesc = settings?.seo?.metaDescription || 'Thank you for ordering with RelaxPro. Your order is received and will be verified via WhatsApp shortly.';
  const orderThankYou = settings?.contactInfo?.whatsappOrderThankYou || 'Thank you.';
  const orderReceived = settings?.contactInfo?.whatsappOrderReceived || 'Your order is received.';
  const orderConfirmMsg = settings?.contactInfo?.whatsappConfirmMessage || `We'll confirm on WhatsApp within 1 hour.`;
  const continueShopping = settings?.navigation?.mainMenu?.find((m: any) => m.path === '/catalog')?.label || 'Continue Shopping';

  if (!orderReceipt) {
    return (
      <PageShell title={pageTitle} description={pageDesc}>
        <div className="max-w-xl mx-auto px-4 md:px-6 py-20 text-center space-y-6 text-zinc-950">
          <h1 className="text-3xl font-display font-medium text-brand-950">No order found</h1>
          <button onClick={() => navigate('/catalog')} className="btn-primary bg-primary hover:bg-neutral-dark text-white font-accent text-xs font-bold uppercase tracking-widest px-8 py-3 rounded-xl cursor-pointer shadow-md transition-all">{continueShopping}</button>
        </div>
      </PageShell>
    );
  }

  const orderItems = orderReceipt.cart.map((item) => {
    const sizeStr = item.type === 'custom' && item.customSize
      ? `Custom ${item.customSize.length}x${item.customSize.width}${item.customSize.thickness ? `x${item.customSize.thickness}` : ''}`
      : item.size;
    return `- ${item.name} [Size: ${sizeStr} x ${item.quantity}]`;
  }).join('%0A');
  const message = `Hello Suresh! I have completed order booking ${orderReceipt.orderId} on the website. Final Amount: ₹${orderReceipt.grandTotal.toLocaleString('en-IN')}. items:%0A${orderItems}%0A%0AConsignee Details: Name: ${orderReceipt.name}, phone: ${orderReceipt.phone}, address: ${orderReceipt.address}. Please verify and dispatch!`;

  return (
    <PageShell title={pageTitle} description={pageDesc}>
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl mx-auto px-4 md:px-6 py-20 text-center space-y-8 text-zinc-950 relative"
      >
        <SEO title={pageTitle} description={pageDesc} />
        <Confetti />
        <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-400">
          <Check className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs tracking-widest font-mono text-emerald-800 bg-emerald-50 px-3 py-1 rounded font-bold uppercase">{orderThankYou}</span>
          <h1 className="text-3xl font-display font-medium mt-4 text-brand-950">{orderReceived}</h1>
          <p className="text-sm text-stone-600 mt-2 font-sans">{orderConfirmMsg}</p>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 md:p-6 shadow-md text-left font-sans text-xs space-y-4">
          <strong className="font-display font-bold text-sm text-brand-950 border-b border-zinc-100 pb-3 block">{settings?.contactInfo?.deliveryCoordinatorTitle || 'Delivery Coordination Details'}</strong>
          <div className="space-y-2">
            <div>
              <span className="text-[10px] font-mono text-zinc-400 block">{settings?.contactInfo?.consigneeLabel || 'CONSIGNEE NAME'}</span>
              <span className="text-brand-950 font-medium">{orderReceipt.name}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-zinc-400 block">{settings?.contactInfo?.deliveryAddressLabel || 'DELIVERY ADDRESS BOOKED'}</span>
              <span className="text-brand-950 font-medium">{orderReceipt.address}, {orderReceipt.city} - {orderReceipt.zip}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-zinc-400 block">{settings?.contactInfo?.mobileLabel || '10-DIGIT MOBILE'}</span>
              <span className="text-brand-950 font-mono font-medium">{orderReceipt.phone}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-zinc-400 block">{settings?.contactInfo?.codBalanceLabel || 'TOTAL GRAND COD BALANCE DUE AT DOORSTEP'}</span>
              <span className="text-base font-bold font-display text-brand-950"><PriceText>₹{orderReceipt.grandTotal.toLocaleString('en-IN')}</PriceText></span>
            </div>
          </div>
          <div className="pt-3 border-t border-zinc-100 text-[11px] text-zinc-400 font-mono">{settings?.footer?.copyrightText || '*A delivery coordinator from Jeedimetla Factory will call inside 12 hours. Pay COD via cash or UPI.'}</div>
        </div>

        <div className="space-y-3 pt-4">
          <a
            href={buildWhatsAppUrl(message)}
            target="_blank"
            rel="noreferrer"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl py-3 text-xs font-semibold uppercase tracking-wider font-display flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/15 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" /> {settings?.contactInfo?.whatsappSubmitLabel || 'Instantly Submit Order to Suresh on WhatsApp'}
          </a>
          <button onClick={() => { onReset(); navigate('/catalog'); }} className="w-full border border-zinc-200 bg-white hover:bg-zinc-50 rounded-xl py-3 text-xs text-brand-950 font-semibold font-display uppercase tracking-wider cursor-pointer">{settings?.navigation?.ctaButton?.label || 'Continue Shopping'}</button>
        </div>
      </motion.div>
    </PageShell>
  );
}
