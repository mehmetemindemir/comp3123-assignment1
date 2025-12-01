import { CardHeader } from './ui/card';
import clsx from './ui/clsx';

function LoginSignupHeader({ eyebrow, title, description, accentClass, tabs, activeTab, onTabChange }) {
  return (
    <CardHeader className="flex flex-col items-center gap-4 pb-6 pt-4 text-center">
      
      <div>
        {tabs && tabs.length > 0 && (
        <div className="flex gap-2 rounded-full border border-white/10 bg-white/10 p-1 backdrop-blur">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onTabChange?.(tab.key)}
              className={clsx(
                'rounded-full px-4 py-2 text-sm font-semibold transition',
                activeTab === tab.key
                  ? 'bg-white text-slate-900 shadow shadow-slate-900/20'
                  : 'text-slate-100 hover:bg-white/10'
              )}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}
      </div>
      <div className="space-y-1">
        <p className={clsx('text-sm font-semibold uppercase tracking-[0.2em]', accentClass || 'text-slate-300')}>
          {eyebrow}
        </p>
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <p className="text-sm text-slate-200/80">{description}</p>
      </div>

      
      
    </CardHeader>
  );
}

export default LoginSignupHeader;
