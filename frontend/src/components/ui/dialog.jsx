import { useEffect } from 'react';
import clsx from './clsx';

export function Dialog({ open, onClose, children }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    if (open) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-slate-900/90 shadow-2xl">
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({ className, ...props }) {
  return <div className={clsx('flex items-start justify-between gap-4 px-6 py-5', className)} {...props} />;
}

export function DialogContent({ className, ...props }) {
  return <div className={clsx('px-6 pb-6', className)} {...props} />;
}
