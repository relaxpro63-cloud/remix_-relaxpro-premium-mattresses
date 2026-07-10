import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Check, MessageSquare } from 'lucide-react';
import { buildWhatsAppUrl } from '../../lib/site';
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

  if (!orderReceipt) {
    return (
      <PageShell
        title="Order Success | RelaxPro Premium Mattresses"
        description="Thank you for ordering with RelaxPro. Your order is received and will be verified via WhatsApp shortly."
      >
        <div className="max-w-xl mx-auto px-4 md:px-6 py-20 text-center space-y-6 text-primary">
          <h1 className="text-3xl font-heading font-medium text-primary">No order found</h1>
          <button
            onClick={() => navigate('/catalog')}
            className="btn-primary bg-primary hover:bg-neutral-dark text-warm-white font-accent text-xs font-bold uppercase tracking-widest px-8 py-3 rounded-xl cursor-pointer shadow-md transition-[transform,background-color,border-color,color,box-shadow] duration-200 ease-out"
          >
            Continue Shopping
          </button>
        </div>
      </PageShell>
    );
  }

  // WhatsApp: order summary only — no customer PII in the URL
  const orderItems = orderReceipt.cart
    .map((item) => `- ${item.name} [${item.size} x ${item.quantity}]`)
    .join('\n');
  const message = `Hello! I placed order ${orderReceipt.orderId}. Total: ₹${orderReceipt.grandTotal.toLocaleString('en-IN')}. Please verify on your end.\n\nItems:\n${orderItems}`;

  return (
    <PageShell
      title="Order Success | RelaxPro Premium Mattresses"
      description="Thank you for ordering with RelaxPro. Your order is received and will be verified via WhatsApp shortly."
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-xl mx-auto px-4 md:px-6 py-20 text-center space-y-8 text-primary relative"
      >
        <SEO
          title="Order Success | RelaxPro Premium Mattresses"
          description="Thank you for ordering with RelaxPro. Your order is received and will be verified via WhatsApp shortly."
        />
        <Confetti />
        <div className="w-16 h-16 bg-success/15 text-success rounded-2xl flex items-center justify-center mx-auto border border-success/30">
          <Check className="w-8 h-8" />
        </div>

        <div>
          <span className="text-[10px] tracking-editorial font-accent text-success bg-success/10 px-3 py-1 rounded-md font-bold uppercase">
            Order received
          </span>
          <h1 className="text-3xl font-heading font-medium mt-4 text-primary">
            Your order is received.
          </h1>
          <p className="text-sm text-neutral-dark/70 mt-2 font-body">
            We'll confirm on WhatsApp within 1 hour.
          </p>
          <p className="text-[11px] font-mono text-neutral-dark/40 mt-2 uppercase tracking-widest">
            {orderReceipt.orderId}
          </p>
        </div>

        <div className="bg-secondary rounded-2xl border border-brand-200/60 p-5 md:p-6 shadow-sm text-left font-body text-xs space-y-4">
          <strong className="font-heading font-bold text-sm text-primary border-b border-brand-200/40 pb-3 block">
            Delivery coordination details
          </strong>
          <div className="space-y-3">
            <div>
              <span className="text-[10px] font-accent uppercase tracking-editorial text-neutral-dark/40 block">
                Consignee name
              </span>
              <span className="text-primary font-medium">{orderReceipt.name}</span>
            </div>
            <div>
              <span className="text-[10px] font-accent uppercase tracking-editorial text-neutral-dark/40 block">
                Delivery address
              </span>
              <span className="text-primary font-medium">
                {orderReceipt.address}, {orderReceipt.city} - {orderReceipt.zip}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-accent uppercase tracking-editorial text-neutral-dark/40 block">
                Mobile
              </span>
              <span className="text-primary font-mono font-medium">{orderReceipt.phone}</span>
            </div>
            <div>
              <span className="text-[10px] font-accent uppercase tracking-editorial text-neutral-dark/40 block">
                COD balance due at doorstep
              </span>
              <span className="text-base font-bold font-heading text-primary">
                <PriceText>₹{orderReceipt.grandTotal.toLocaleString('en-IN')}</PriceText>
              </span>
            </div>
          </div>
          <div className="pt-3 border-t border-brand-200/40 text-[11px] text-neutral-dark/50 font-body">
            A delivery coordinator from Jeedimetla Factory will call within 12 hours. Pay COD via cash or
            UPI.
          </div>
        </div>

        <div className="space-y-3 pt-4">
          <a
            href={buildWhatsAppUrl(message)}
            target="_blank"
            rel="noreferrer"
            className="w-full bg-success hover:bg-success/90 text-warm-white rounded-xl py-3.5 text-xs font-semibold uppercase tracking-wider font-accent flex items-center justify-center gap-1.5 shadow-md shadow-success/15 cursor-pointer transition-[transform,background-color,border-color,color,box-shadow] duration-200 ease-out"
          >
            <MessageSquare className="w-4 h-4" /> Confirm order on WhatsApp
          </a>
          <button
            onClick={() => {
              onReset();
              navigate('/catalog');
            }}
            className="w-full border border-brand-200 bg-secondary hover:bg-brand-100 rounded-xl py-3 text-xs text-primary font-semibold font-accent uppercase tracking-wider cursor-pointer transition-[transform,background-color,border-color,color,box-shadow] duration-200 ease-out"
          >
            Continue shopping
          </button>
        </div>
      </motion.div>
    </PageShell>
  );
}
