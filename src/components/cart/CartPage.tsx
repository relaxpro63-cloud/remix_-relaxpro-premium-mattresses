import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import PriceText from '../ui/PriceText';
import { Trash2, Plus, Minus, ShoppingBag, ChevronRight, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { CartItem, OrderReceipt } from '../../types';
import { submitLead } from '../../utils/googleSheets';

interface CartPageProps {
  cart: CartItem[];
  onUpdateQty: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onCheckoutSuccess: (orderId: string, summary: OrderReceipt) => void;
  onNavigate: (page: string) => void;
}

export default function CartPage({
  cart,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onCheckoutSuccess,
  onNavigate
}: CartPageProps) {
  // Booking Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Hyderabad');
  const [zip, setZip] = useState('');
  const [contactTime, setContactTime] = useState('');
  const [notes, setNotes] = useState('');

  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculations
  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cart]);

  const grandTotal = subtotal;

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Full name is required.';
    if (!phone.trim() || phone.length < 10) errs.phone = 'Valid primary contact number is required.';
    if (!address.trim()) errs.address = 'Delivery address is required.';
    if (!zip.trim() || zip.length !== 6) errs.zip = '6-digit postal pincode is required.';
    
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const mockOrderId = `RP-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      const summary = {
        orderId: mockOrderId,
        name,
        phone,
        email,
        address,
        city,
        zip,
        contactTime,
        notes,
        subtotal,
        discountAmount: 0,
        grandTotal,
        cart: [...cart]
      };

      const productNames = cart.map((item) => `${item.name} (Qty: ${item.quantity})`).join(' + ');
      const productSizes = cart.map((item) => item.size).join(', ');
      const accessoriesList = cart.map((item) => item.includeAccessories ? 'Yes' : 'No').join(', ');

      // Call Google Sheets integration integration
      await submitLead({
        orderId: mockOrderId,
        name,
        phone,
        email,
        city,
        address,
        pincode: zip,
        contactTime: contactTime || 'Not specified',
        product: productNames,
        size: productSizes,
        price: `₹${grandTotal.toLocaleString('en-IN')}`,
        notes: `Total: ₹${subtotal.toLocaleString('en-IN')}. Delivery Notes: ${notes || 'None'}. Accessories: ${accessoriesList}`,
        source: "Website Order Checkout"
      });

      onCheckoutSuccess(mockOrderId, summary);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        exit={{ opacity: 0, y: -15 }}
        className="max-w-7xl mx-auto px-4 md:px-8 py-24 text-center min-h-[60vh] flex flex-col justify-center items-center"
      >
        <div className="w-20 h-20 bg-neutral-light text-primary rounded-full flex items-center justify-center mx-auto mb-8 border border-brand-200/50 shadow-sm relative">
          <div className="absolute inset-0 bg-accent/5 rounded-full animate-pulse"></div>
          <ShoppingBag className="w-8 h-8 text-accent relative z-10" />
        </div>
        <h2 className="font-heading font-bold text-4xl text-primary mb-4">Your Cart is Empty</h2>
        <p className="text-neutral-dark/60 mt-2 max-w-md mx-auto leading-relaxed text-sm font-body">
          Before initiating your custom order, explore our collection of premium natural latex mattresses tailored for perfect sleep.
        </p>
        <button
          onClick={() => onNavigate('catalog')}
          className="mt-8 btn-primary bg-primary hover:bg-neutral-dark text-white font-accent text-[13px] font-bold uppercase tracking-widest px-8 py-4 rounded-xl cursor-pointer shadow-lg transition-all"
        >
          Explore Collections
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16"
    >
      {/* Dynamic Header */}
      <div className="max-w-3xl mb-12">
        <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight text-primary">
          Complete Your Order
        </h1>
        <p className="text-accent mt-3 text-sm font-accent font-medium flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent animate-pulse" /> We'll confirm your order on WhatsApp within 1 hour.
        </p>
      </div>

      <form onSubmit={handleSubmitBooking} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Your details */}
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-white p-6 md:p-10 rounded-[2rem] border border-brand-200/40 shadow-sm space-y-8">
            <h3 className="font-heading font-bold text-2xl text-primary tracking-tight pb-4 border-b border-brand-200/30">
              Delivery Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="md:col-span-2">
                <label className="block text-xs font-accent font-bold text-primary uppercase tracking-wider mb-2">
                  Full name <span className="text-accent">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Srinivas Rao"
                  className="w-full px-5 py-3.5 rounded-xl border border-brand-200/50 text-sm font-body focus:outline-hidden focus:ring-2 focus:ring-accent/20 focus:border-accent bg-neutral-light/50 focus:bg-white transition-all outline-none"
                />
                {errors.name && <span className="text-[10px] text-red-500 font-accent font-bold tracking-wide uppercase block mt-2">{errors.name}</span>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-accent font-bold text-primary uppercase tracking-wider mb-2">
                  Phone <span className="text-accent">*</span>
                </label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full px-5 py-3.5 rounded-xl border border-brand-200/50 text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-accent/20 focus:border-accent bg-neutral-light/50 focus:bg-white transition-all outline-none"
                />
                {errors.phone && <span className="text-[10px] text-red-500 font-accent font-bold tracking-wide uppercase block mt-2">{errors.phone}</span>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-accent font-bold text-primary uppercase tracking-wider mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. srinivas@example.com"
                  className="w-full px-5 py-3.5 rounded-xl border border-brand-200/50 text-sm font-body focus:outline-hidden focus:ring-2 focus:ring-accent/20 focus:border-accent bg-neutral-light/50 focus:bg-white transition-all outline-none"
                />
              </div>

              {/* Detailed Address */}
              <div className="md:col-span-2">
                <label className="block text-xs font-accent font-bold text-primary uppercase tracking-wider mb-2">
                  Delivery address <span className="text-accent">*</span>
                </label>
                <textarea
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={2}
                  placeholder="House / flat, street, landmark"
                  className="w-full px-5 py-3.5 rounded-xl border border-brand-200/50 text-sm font-body focus:outline-hidden focus:ring-2 focus:ring-accent/20 focus:border-accent bg-neutral-light/50 focus:bg-white transition-all outline-none resize-none"
                />
                {errors.address && <span className="text-[10px] text-red-500 font-accent font-bold tracking-wide uppercase block mt-2">{errors.address}</span>}
              </div>

              {/* City */}
              <div>
                <label className="block text-xs font-accent font-bold text-primary uppercase tracking-wider mb-2">
                  City <span className="text-accent">*</span>
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-5 py-3.5 rounded-xl border border-brand-200/50 text-sm font-body focus:outline-hidden focus:ring-2 focus:ring-accent/20 focus:border-accent cursor-pointer bg-neutral-light/50 focus:bg-white transition-all outline-none"
                >
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Rajahmundry">Rajahmundry</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              {/* Pincode (Zip) */}
              <div>
                <label className="block text-xs font-accent font-bold text-primary uppercase tracking-wider mb-2">
                  Pincode <span className="text-accent">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  placeholder="6-digit pincode"
                  className="w-full px-5 py-3.5 rounded-xl border border-brand-200/50 text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-accent/20 focus:border-accent bg-neutral-light/50 focus:bg-white transition-all outline-none"
                />
                {errors.zip && <span className="text-[10px] text-red-500 font-accent font-bold tracking-wide uppercase block mt-2">{errors.zip}</span>}
              </div>

              {/* Preferred contact time */}
              <div className="md:col-span-2">
                <label className="block text-xs font-accent font-bold text-primary uppercase tracking-wider mb-2">
                  Preferred contact time
                </label>
                <input
                  type="text"
                  value={contactTime}
                  onChange={(e) => setContactTime(e.target.value)}
                  placeholder="e.g. Weekdays after 6pm"
                  className="w-full px-5 py-3.5 rounded-xl border border-brand-200/50 text-sm font-body focus:outline-hidden focus:ring-2 focus:ring-accent/20 focus:border-accent bg-neutral-light/50 focus:bg-white transition-all outline-none"
                />
              </div>

              {/* Delivery notes */}
              <div className="md:col-span-2">
                <label className="block text-xs font-accent font-bold text-primary uppercase tracking-wider mb-2">
                  Delivery notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Building, floor, lift access, time preference, etc."
                  className="w-full px-5 py-3.5 rounded-xl border border-brand-200/50 text-sm font-body focus:outline-hidden focus:ring-2 focus:ring-accent/20 focus:border-accent bg-neutral-light/50 focus:bg-white transition-all outline-none resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Your order */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-brand-200/40 shadow-sm space-y-8 sticky top-32">
            <div className="flex items-center justify-between pb-4 border-b border-brand-200/30">
              <h3 className="font-heading font-bold text-2xl text-primary tracking-tight">
                Order Summary
              </h3>
              <button
                type="button"
                onClick={onClearCart}
                className="text-xs text-neutral-dark/40 hover:text-red-500 font-accent font-bold uppercase tracking-wider transition-colors underline cursor-pointer"
              >
                Clear items
              </button>
            </div>

            {/* Cart Items List */}
            <div className="divide-y divide-brand-200/30">
              {cart.map((item) => (
                <div key={item.id} className="py-5 first:pt-0 last:pb-0">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1.5 flex-1">
                      <h4 className="font-heading font-bold text-base text-primary leading-tight">
                        {item.name}
                      </h4>
                      <p className="font-accent font-bold text-[10px] tracking-wider text-neutral-dark/50 uppercase">
                        {item.size} <span className="mx-1.5 text-brand-200">|</span> QTY: {item.quantity}
                      </p>
                      
                      {item.includeAccessories && (
                        <p className="text-[10px] text-success font-bold font-accent uppercase tracking-wider bg-success/10 border border-success/20 px-2 py-1 rounded inline-block mt-1">
                          + Accessory Pack
                        </p>
                      )}
                    </div>
                    
                    <div className="text-right flex flex-col items-end">
                      <span className="font-mono text-sm font-bold text-primary block">
                        <PriceText>₹{(item.price * item.quantity).toLocaleString('en-IN')}</PriceText>
                      </span>
                      
                      {/* Responsive adjustment controls inline */}
                      <div className="flex items-center gap-2 bg-neutral-light border border-brand-200/50 rounded-lg p-1 mt-3">
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.id, item.quantity - 1)}
                          className="w-5 h-5 rounded flex items-center justify-center text-primary hover:bg-white hover:shadow-sm cursor-pointer transition-all"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono text-[11px] font-bold text-primary px-1">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                          className="w-5 h-5 rounded flex items-center justify-center text-primary hover:bg-white hover:shadow-sm cursor-pointer transition-all"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Subtotal & Free Delivery */}
            <div className="pt-6 border-t border-brand-200/30 space-y-3.5 text-sm font-body text-neutral-dark/70">
              <div className="flex justify-between items-center">
                <span>Subtotal</span>
                <span className="font-mono font-bold text-primary"><PriceText>₹{subtotal.toLocaleString('en-IN')}</PriceText></span>
              </div>
              <div className="flex justify-between items-center">
                <span>Delivery (Kerala to your door)</span>
                <span className="font-accent font-bold text-[11px] text-success bg-success/10 border border-success/20 px-2.5 py-1 rounded-full uppercase tracking-widest">
                  Free
                </span>
              </div>
            </div>

            {/* Total Balance */}
            <div className="pt-6 border-t border-brand-200/30 flex justify-between items-end">
              <span className="text-primary font-heading font-bold text-lg">Total</span>
              <span className="text-3xl font-bold font-heading text-primary">
                <PriceText>₹{grandTotal.toLocaleString('en-IN')}</PriceText>
              </span>
            </div>

            {/* Action buttons embedded in the order card */}
            <div className="pt-4">
              <button
                id="btn-place-order"
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary bg-primary hover:bg-neutral-dark disabled:bg-neutral-light disabled:text-neutral-dark/40 disabled:border-brand-200 text-white font-accent font-bold text-sm tracking-widest uppercase py-4.5 rounded-2xl shadow-lg cursor-pointer flex items-center justify-center gap-2 transition-all relative overflow-hidden group"
              >
                {isSubmitting ? (
                  <span>Processing Request...</span>
                ) : (
                  <>
                    <div className="absolute inset-0 bg-white/10 w-0 group-hover:w-full transition-all duration-300 ease-out"></div>
                    <span className="relative z-10 flex items-center gap-2">Place Order on WhatsApp <ArrowRight className="w-4 h-4" /></span>
                  </>
                )}
              </button>
              
              <div className="flex items-start gap-3 mt-5 bg-neutral-light p-4 rounded-xl border border-brand-200/50">
                <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                <p className="text-[11px] text-neutral-dark/70 leading-relaxed font-body">
                  <strong>No upfront payment required.</strong> After placing the order, Suresh will contact you to verify dimensions and arrange secure payment options.
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
