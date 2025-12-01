import clsx from './clsx';

const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const months = Array.from({ length: 12 }).map((_, i) =>
  new Date(2000, i, 1).toLocaleString('default', { month: 'long' })
);

export function Calendar({ value, onChange }) {
  const today = new Date();
  const current = value ? new Date(value) : today;
  const year = current.getFullYear();
  const month = current.getMonth();

  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);
  const leadingBlanks = start.getDay();
  const daysInMonth = end.getDate();

  const handleSelect = (day) => {
    const next = new Date(year, month, day);
    const iso = next.toISOString().slice(0, 10);
    onChange?.(iso);
  };

  const handlePrev = () => {
    const prevMonth = new Date(year, month - 1, 1);
    onChange?.(prevMonth.toISOString().slice(0, 10));
  };

  const handleNext = () => {
    const nextMonth = new Date(year, month + 1, 1);
    onChange?.(nextMonth.toISOString().slice(0, 10));
  };

  const handleMonthChange = (e) => {
    const next = new Date(year, Number(e.target.value), 1);
    onChange?.(next.toISOString().slice(0, 10));
  };

  const handleYearChange = (e) => {
    const next = new Date(Number(e.target.value), month, 1);
    onChange?.(next.toISOString().slice(0, 10));
  };

  const yearOptions = Array.from({ length: 10 }).map((_, idx) => year - 5 + idx);

  return (
    <div className="w-full rounded-xl border border-white/10 bg-slate-900/90 p-3 text-slate-100">
      <div className="flex items-center justify-between gap-2 pb-3">
        <button className="rounded-lg px-2 py-1 text-sm hover:bg-white/10" onClick={handlePrev}>&larr;</button>
        <div className="flex items-center gap-2">
          <select
            className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-sm font-semibold text-slate-100"
            value={month}
            onChange={handleMonthChange}
          >
            {months.map((m, i) => (
              <option className="bg-slate-900" key={m} value={i}>{m}</option>
            ))}
          </select>
          <select
            className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-sm font-semibold text-slate-100"
            value={year}
            onChange={handleYearChange}
          >
            {yearOptions.map((y) => (
              <option className="bg-slate-900" key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <button className="rounded-lg px-2 py-1 text-sm hover:bg-white/10" onClick={handleNext}>&rarr;</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-300">
        {days.map((d) => <div key={d} className="pb-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-sm mt-1">
        {Array.from({ length: leadingBlanks }).map((_, i) => (
          <div key={`b-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const iso = new Date(year, month, day).toISOString().slice(0, 10);
          const isSelected = value && value.slice(0, 10) === iso;
          const isToday = iso === today.toISOString().slice(0, 10);
          return (
            <button
              key={day}
              onClick={() => handleSelect(day)}
              className={clsx(
                'rounded-lg px-2 py-2 transition hover:bg-white/10',
                isSelected && 'bg-sky-500 text-slate-900 font-bold',
                !isSelected && isToday && 'border border-white/20'
              )}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Calendar;
