import clsx from './clsx';

export function Input({ className, ...props }) {
  return (
    <input
      className={clsx(
        'w-full rounded-xl border border-white/10 bg-white/10 px-3 py-3 text-base text-white placeholder:text-slate-300/70 shadow-inner shadow-slate-900/40 outline-none ring-0 transition focus:border-sky-300 focus:shadow-slate-900/40 focus:ring-2 focus:ring-sky-400/50',
        className
      )}
      {...props}
    />
  );
}

export default Input;
