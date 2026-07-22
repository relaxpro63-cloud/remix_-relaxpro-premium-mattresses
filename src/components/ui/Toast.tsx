import React, { createContext, useContext, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, AlertCircle, AlertTriangle, Loader2, X, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  persistent?: boolean;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, 'id'>) => string;
  hideToast: (id: string) => void;
  showSuccess: (title: string, message?: string, options?: Partial<Toast>) => string;
  showError: (title: string, message?: string, options?: Partial<Toast>) => string;
  showWarning: (title: string, message?: string, options?: Partial<Toast>) => string;
  showInfo: (title: string, message?: string, options?: Partial<Toast>) => string;
  showLoading: (title: string, message?: string, options?: Partial<Toast>) => string;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = { ...toast, id };
    
    setToasts(prev => [...prev, newToast]);
    
    if (!toast.persistent && toast.duration !== 0) {
      const duration = toast.duration || (toast.type === 'loading' ? 0 : 5000);
      if (duration > 0) {
        setTimeout(() => {
          hideToast(id);
        }, duration);
      }
    }
    
    return id;
  };

  const hideToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const showSuccess = (title: string, message?: string, options?: Partial<Toast>) => 
    showToast({ type: 'success', title, message, ...options });
  
  const showError = (title: string, message?: string, options?: Partial<Toast>) => 
    showToast({ type: 'error', title, message, persistent: true, ...options });
  
  const showWarning = (title: string, message?: string, options?: Partial<Toast>) => 
    showToast({ type: 'warning', title, message, ...options });
  
  const showInfo = (title: string, message?: string, options?: Partial<Toast>) => 
    showToast({ type: 'info', title, message, ...options });
  
  const showLoading = (title: string, message?: string, options?: Partial<Toast>) => 
    showToast({ type: 'loading', title, message, persistent: true, duration: 0, ...options });

  return (
    <ToastContext.Provider value={{ 
      toasts, 
      showToast, 
      hideToast,
      showSuccess,
      showError,
      showWarning,
      showInfo,
      showLoading,
    }}>
      {children}
      <ToastContainer toasts={toasts} onClose={hideToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts, onClose }: { toasts: Toast[]; onClose: (id: string) => void }) {
  return (
    <AnimatePresence>
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none max-w-sm w-full">
        {toasts.map(toast => (
          <Toast key={toast.id} toast={toast} onClose={onClose} />
        ))}
      </div>
    </AnimatePresence>
  );
}

function Toast({ toast, onClose }: { toast: Toast; onClose: (id: string) => void }) {
  const iconComponents = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
    loading: Loader2,
  };

  const iconColors = {
    success: 'text-emerald-500',
    error: 'text-red-500',
    warning: 'text-amber-500',
    info: 'text-blue-500',
    loading: 'text-accent animate-spin',
  };

  const bgColors = {
    success: 'bg-emerald-50 border-emerald-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-amber-50 border-amber-200',
    info: 'bg-blue-50 border-blue-200',
    loading: 'bg-accent/10 border-accent/30',
  };

  const textColors = {
    success: 'text-emerald-800',
    error: 'text-red-800',
    warning: 'text-amber-800',
    info: 'text-blue-800',
    loading: 'text-primary',
  };

  const Icon = iconComponents[toast.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, y: 20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, x: 100, y: 20 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={`pointer-events-auto rounded-2xl border shadow-xl p-4 flex items-start gap-3 min-w-0 ${bgColors[toast.type]}`}
      style={{ boxShadow: '0 20px 40px -15px rgba(0,0,0,0.15)' }}
    >
      <div className={`flex-shrink-0 w-5 h-5 mt-0.5 ${iconColors[toast.type]}`}>
        <Icon className="w-5 h-5" />
      </div>
      
      <div className="flex-1 min-w-0">
        <p className={`font-heading font-bold text-sm ${textColors[toast.type]}`}>
          {toast.title}
        </p>
        {toast.message && (
          <p className={`font-body text-xs mt-1 ${textColors[toast.type]}/80`}>
            {toast.message}
          </p>
        )}
        {toast.action && (
          <button
            onClick={toast.action.onClick}
            className={`mt-3 text-xs font-accent font-bold uppercase tracking-wider hover:underline ${textColors[toast.type]}`}
          >
            {toast.action.label}
          </button>
        )}
      </div>
      
      {!toast.persistent && (
        <button
          onClick={() => onClose(toast.id)}
          className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-lg hover:bg-black/5 transition-colors"
          aria-label="Dismiss"
        >
          <X className={`w-4 h-4 ${textColors[toast.type]}/60`} />
        </button>
      )}
    </motion.div>
  );
}