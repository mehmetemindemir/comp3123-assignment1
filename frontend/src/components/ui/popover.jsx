import { useEffect, useRef, useState } from 'react';
import clsx from './clsx';

export function Popover({ trigger, children, placement = 'bottom' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div className="relative inline-block" ref={ref}>
      <div onClick={() => setOpen((v) => !v)}>
        {typeof trigger === 'function' ? trigger({ open }) : trigger}
      </div>
      {open && (
        <div
          className={clsx(
            'absolute z-50 min-w-[240px] rounded-xl border border-white/10 bg-slate-900/95 p-3 shadow-xl shadow-slate-900/40',
            placement === 'top' ? 'bottom-full mb-2' : 'mt-2'
          )}
        >
          {typeof children === 'function' ? children({ close: () => setOpen(false) }) : children}
        </div>
      )}
    </div>
  );
}

export function PopoverItem({ className, ...props }) {
  return (
    <button
      className={clsx(
        'w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-100 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400',
        className
      )}
      {...props}
    />
  );
}

export default Popover;
