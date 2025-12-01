import clsx from './clsx';

export function Card({ className, ...props }) {
  return (
    <div
      className={clsx('rounded-2xl border border-white/10 bg-white/5 backdrop-blur shadow-lg shadow-slate-900/20', className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }) {
  return <div className={clsx('border-b border-white/10 px-6 py-5', className)} {...props} />;
}

export function CardContent({ className, ...props }) {
  return <div className={clsx('px-6 py-5', className)} {...props} />;
}

export default Card;
