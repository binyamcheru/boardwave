import { useEffect } from 'react';
import { FiAlertCircle, FiCheckCircle, FiX } from 'react-icons/fi';
import { m } from 'framer-motion';

interface ToastProps {
  message: string;
  variant?: 'success' | 'error';
  onDismiss: () => void;
}

export const Toast = ({ message, variant = 'success', onDismiss }: ToastProps) => {
  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(onDismiss, 3500);
    return () => window.clearTimeout(timer);
  }, [message, onDismiss]);

  if (!message) return null;

  const Icon = variant === 'success' ? FiCheckCircle : FiAlertCircle;

  return (
    <m.div
      role={variant === 'error' ? 'alert' : 'status'}
      aria-live={variant === 'error' ? 'assertive' : 'polite'}
      initial={{ opacity: 0, y: -12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`fixed right-4 top-20 z-[80] flex w-[calc(100%-2rem)] max-w-sm items-start gap-3 rounded-md border px-4 py-3 shadow-2xl sm:right-6 ${
        variant === 'success'
          ? 'border-emerald-400/30 bg-[#0b2f32] text-emerald-100'
          : 'border-red-400/30 bg-[#341b28] text-red-100'
      }`}
    >
      <Icon className="mt-0.5 shrink-0 text-lg" />
      <p className="min-w-0 flex-1 text-sm font-semibold leading-5">{message}</p>
      <button type="button" onClick={onDismiss} className="rounded p-0.5 opacity-70 transition hover:bg-white/10 hover:opacity-100" aria-label="Dismiss notification">
        <FiX />
      </button>
    </m.div>
  );
};