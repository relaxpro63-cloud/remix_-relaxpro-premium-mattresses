import React from 'react';

interface BaseProps {
  id: string;
  label: string;
  error?: string;
  className?: string;
  /** Dark-card variant (white/translucent field on a dark background). */
  dark?: boolean;
}

interface InputProps extends BaseProps, Omit<React.InputHTMLAttributes<HTMLInputElement>, 'id' | 'className'> {
  as?: 'input';
}

interface TextareaProps extends BaseProps, Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'id' | 'className'> {
  as: 'textarea';
}

type FloatingLabelFieldProps = InputProps | TextareaProps;

const FIELD_BASE = 'peer w-full px-4 pt-6 pb-2 rounded-2xl border text-sm font-body transition-all focus:outline-hidden focus:ring-4 placeholder-transparent';
const FIELD_LIGHT = 'bg-sky-50/50 text-ink-900';
const FIELD_DARK = 'bg-white/5 text-linen-100';

const LABEL_BASE = 'absolute left-4 top-4 text-sm font-body transition-all duration-200 pointer-events-none';
const LABEL_ACTIVE =
  'peer-focus:top-2.5 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-widest peer-focus:font-bold ' +
  'peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-widest peer-[:not(:placeholder-shown)]:font-bold';
const LABEL_LIGHT = `text-graphite-400 peer-focus:text-brand-600 peer-[:not(:placeholder-shown)]:text-ink-900/70`;
const LABEL_DARK = `text-white/30 peer-focus:text-brand-400 peer-[:not(:placeholder-shown)]:text-brand-400/80`;

/**
 * Floating-label field: the label sits where a placeholder would, then
 * lifts above the value on focus or once filled — pure CSS via the
 * `:placeholder-shown` pseudo-class (peer), no focus-state JS needed.
 */
export default function FloatingLabelField({ id, label, error, className = '', dark = false, ...rest }: FloatingLabelFieldProps) {
  const borderClass = error
    ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
    : dark
      ? 'border-white/10 focus:border-brand-500 focus:ring-brand-500/10'
      : 'border-brand-200/60 focus:border-brand-600 focus:ring-brand-600/10';

  const fieldClass = `${FIELD_BASE} ${dark ? FIELD_DARK : FIELD_LIGHT} ${borderClass}`;
  const labelClass = `${LABEL_BASE} ${LABEL_ACTIVE} ${dark ? LABEL_DARK : LABEL_LIGHT}`;

  return (
    <div className={`relative ${className}`.trim()}>
      {rest.as === 'textarea' ? (
        <textarea id={id} placeholder=" " className={`${fieldClass} resize-none`} {...(rest as TextareaProps)} />
      ) : (
        <input id={id} placeholder=" " className={fieldClass} {...(rest as InputProps)} />
      )}
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      {error && (
        <p className="text-[11px] text-red-500 font-accent mt-1.5" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
