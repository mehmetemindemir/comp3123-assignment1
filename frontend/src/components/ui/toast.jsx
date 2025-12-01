import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const add = ({ title, description, variant = 'default', duration = 3500 }) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, title, description, variant }]);
    if (duration > 0) setTimeout(() => remove(id), duration);
    return id;
  };

  const value = useMemo(() => ({ toast: add }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-[9999] flex w-full max-w-sm flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`rounded-xl border px-4 py-3 shadow-lg shadow-slate-900/30 ${
              t.variant === 'destructive'
                ? 'border-rose-300/50 bg-rose-500/15 text-rose-50'
                : 'border-emerald-300/50 bg-emerald-500/10 text-emerald-50'
            }`}
          >
            {t.title && <p className="text-sm font-semibold">{t.title}</p>}
            {t.description && <p className="text-sm opacity-90">{t.description}</p>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
