'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import { CheckCircle2, XCircle, X } from 'lucide-react';
import { cn } from '@/app/_lib/utils';

type ToastType = 'success' | 'error';

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} });

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const remove = (id: number) => setToasts(prev => prev.filter(t => t.id !== id));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium min-w-[280px]',
              'animate-in slide-in-from-bottom-2 duration-200',
              toast.type === 'success'
                ? 'bg-text-primary text-surface'
                : 'bg-red-600 text-white'
            )}
          >
            {toast.type === 'success'
              ? <CheckCircle2 size={16} className="flex-shrink-0 text-env" />
              : <XCircle size={16} className="flex-shrink-0" />
            }
            <span className="flex-1">{toast.message}</span>
            <button onClick={() => remove(toast.id)} className="opacity-60 hover:opacity-100">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
