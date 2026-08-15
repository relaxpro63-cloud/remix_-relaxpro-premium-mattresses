import React, { useState } from 'react';

interface Props {
  onSubmit: (lead: { name: string; phone: string; preferredContact: 'whatsapp' | 'call' }) => void;
  onDismiss: () => void;
  isSubmitting?: boolean;
}

export default function LeadCaptureForm({ onSubmit, onDismiss, isSubmitting }: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredContact, setPreferredContact] = useState<'whatsapp' | 'call'>('whatsapp');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (name.trim().length < 2) return setError('Please enter your name.');
    if (!/^[6-9]\d{9}$/.test(phone.trim())) {
      return setError('Please enter a valid 10-digit mobile number.');
    }
    setError(null);
    onSubmit({ name: name.trim(), phone: phone.trim(), preferredContact });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-1 space-y-2.5 rounded-2xl border border-brand-200 bg-linen-50 p-3.5"
      aria-label="Contact details for a RelaxPro expert"
    >
      <p className="text-xs font-semibold text-ink-900">
        Would you like our RelaxPro expert to contact you?
      </p>

      <label htmlFor="lead-name" className="sr-only">Your name</label>
      <input
        id="lead-name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Your name"
        autoComplete="name"
        className="min-h-11 w-full rounded-full border border-graphite-200 bg-white px-4 text-sm"
      />

      <label htmlFor="lead-phone" className="sr-only">Mobile number</label>
      <input
        id="lead-phone"
        value={phone}
        onChange={(event) => setPhone(event.target.value.replace(/\D/g, '').slice(0, 10))}
        placeholder="10-digit mobile number"
        inputMode="numeric"
        autoComplete="tel"
        className="min-h-11 w-full rounded-full border border-graphite-200 bg-white px-4 text-sm"
      />

      <div role="radiogroup" aria-label="Preferred contact method" className="flex gap-2">
        {(['whatsapp', 'call'] as const).map((option) => (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={preferredContact === option}
            onClick={() => setPreferredContact(option)}
            className={[
              'flex-1 rounded-full px-3 py-2 text-[11px] font-bold uppercase tracking-wider transition-colors',
              preferredContact === option
                ? 'bg-brand-600 text-white'
                : 'border border-graphite-200 bg-white text-graphite-600',
            ].join(' ')}
          >
            {option === 'whatsapp' ? 'WhatsApp' : 'Phone call'}
          </button>
        ))}
      </div>

      {error && (
        <p role="alert" className="text-[11px] text-red-600">
          {error}
        </p>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-full px-3 py-2 text-[11px] font-medium text-graphite-500"
        >
          Not now
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 rounded-full bg-brand-600 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-white disabled:opacity-40"
        >
          {isSubmitting ? 'Sending…' : 'Yes, contact me'}
        </button>
      </div>

      <p className="text-[10px] leading-snug text-graphite-400">
        By submitting this form you agree to be contacted via call, WhatsApp or email.
      </p>
    </form>
  );
}