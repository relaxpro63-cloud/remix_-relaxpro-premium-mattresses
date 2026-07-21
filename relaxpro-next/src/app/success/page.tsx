'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Check, MessageSquare } from 'lucide-react';
import PriceText from '@/components/ui/PriceText';
import Confetti from '@/components/ui/Confetti';
import { useCart } from '@/features/cart/CartContext';
import type { OrderReceipt, CartItem } from '@/types';

export default function SuccessPage() {
  const router = useRouter();
  const cart = useCart();

  const [receipt, setReceipt] = useState<OrderReceipt | null>(null);
  const [orderId, setOrderId] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('relaxpro_order_receipt');
      if (stored) {
        try {
          const parsed: OrderReceipt = JSON.parse(stored);
          setReceipt(parsed);
          setOrderId(parsed.orderId);
        } catch {}
      }
      if (!orderId) {
        setOrderId(`RP${Date.now().toString(36).toUpperCase()}`);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const items = cart.cart.length > 0 ? cart.cart : (receipt?.cart || []);
  const total = items.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);

  const handleWhatsAppOrder = () => {
    const itemLines = items.map((item: CartItem) => `- ${item.name} [Size: ${item.size} x ${item.quantity}]`).join('%0A');
    const msg = `Hello Suresh! I have completed order booking ${orderId} on the website. Final Amount: ₹${total.toLocaleString('en-IN')}. items:%0A${itemLines}%0A%0APlease verify and dispatch!`;
    window.open(`https://wa.me/918686624494?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
      className="max-w-xl mx-auto px-4 md:px-6 py-20 text-center space-y-8 text-primary relative">
      <Confetti />
      <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-400">
        <Check className="w-8 h-8" />
      </div>
      <div>
        <span className="text-xs tracking-widest font-mono text-emerald-800 bg-emerald-50 px-3 py-1 rounded font-bold uppercase">Thank you.</span>
        <h1 className="text-3xl font-heading font-bold mt-4 text-primary">Your order is received.</h1>
        <p className="text-sm text-neutral-dark mt-2 font-body">We&apos;ll confirm on WhatsApp within 1 hour.</p>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 md:p-6 shadow-md text-left font-body text-xs space-y-4">
        <strong className="font-heading font-bold text-sm text-primary border-b border-zinc-100 pb-3 block">Delivery Coordination Details</strong>
        <div className="space-y-2">
          <p className="text-[10px] font-mono text-zinc-400">Order ID: <span className="text-primary font-medium">{orderId || 'Generating...'}</span></p>
          <p className="text-[10px] font-mono text-zinc-400">Status: <span className="text-emerald-600 font-medium">Pending WhatsApp Verification</span></p>
        </div>
        <div className="pt-3 border-t border-zinc-100 text-[11px] text-zinc-400 font-mono">*A delivery coordinator from Jeedimetla Factory will call inside 12 hours. Pay COD via cash or UPI.</div>
      </div>

      <div className="space-y-3 pt-4">
        <button onClick={handleWhatsAppOrder}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl py-3 text-xs font-semibold uppercase tracking-wider font-heading flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/15 cursor-pointer">
          <MessageSquare className="w-4 h-4" /> Submit Order to Suresh on WhatsApp
        </button>
        <button onClick={() => { cart.clearCart(); router.push('/catalog'); }}
          className="w-full border border-zinc-200 bg-white hover:bg-zinc-50 rounded-xl py-3 text-xs text-primary font-semibold font-heading uppercase tracking-wider cursor-pointer">
          Continue Shopping
        </button>
      </div>
    </motion.div>
  );
}
