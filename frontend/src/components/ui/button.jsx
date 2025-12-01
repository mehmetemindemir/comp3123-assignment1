import clsx from './clsx';

const base =
  'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:opacity-60 disabled:cursor-not-allowed';

const variants = {
  default: 'bg-slate-900 text-white shadow-lg shadow-slate-900/20 hover:-translate-y-0.5 hover:shadow-slate-900/30',
  primary: 'bg-sky-500 text-slate-900 shadow-lg shadow-sky-500/30 hover:-translate-y-0.5 hover:shadow-sky-400/40',
  ghost: 'border border-white/15 bg-white/5 text-slate-100 hover:bg-white/10',
  danger: 'bg-rose-500 text-slate-900 shadow-lg shadow-rose-500/30 hover:-translate-y-0.5 hover:shadow-rose-400/40'
};

export function Button({ variant = 'default', className, ...props }) {
  return <button className={clsx(base, variants[variant], className)} {...props} />;
}

export default Button;
