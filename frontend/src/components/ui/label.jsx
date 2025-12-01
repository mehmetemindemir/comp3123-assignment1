import clsx from './clsx';

export function Label({ className, children, ...props }) {
  return (
    <label className={clsx('grid gap-2 text-sm font-semibold text-slate-100', className)} {...props}>
      {children}
    </label>
  );
}

export default Label;
