const MONTHS = [
  { value: 0, label: "Gen" },
  { value: 1, label: "Feb" },
  { value: 2, label: "Mar" },
  { value: 3, label: "Apr" },
  { value: 4, label: "Mag" },
  { value: 5, label: "Giu" },
  { value: 6, label: "Lug" },
  { value: 7, label: "Ago" },
  { value: 8, label: "Set" },
  { value: 9, label: "Ott" },
  { value: 10, label: "Nov" },
  { value: 11, label: "Dic" },
];

export default function MonthYearPicker({
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
  years,
}) {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);

  const isPrevDisabled = selectedYear === minYear && selectedMonth === 0;
  const isNextDisabled = selectedYear === maxYear && selectedMonth === 11;

  const goToPreviousMonth = () => {
    if (isPrevDisabled) return;

    if (selectedMonth === 0) {
      onMonthChange(11);
      onYearChange(selectedYear - 1);
    } else {
      onMonthChange(selectedMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (isNextDisabled) return;

    if (selectedMonth === 11) {
      onMonthChange(0);
      onYearChange(selectedYear + 1);
    } else {
      onMonthChange(selectedMonth + 1);
    }
  };

  const goToToday = () => {
    if (!years.includes(currentYear)) return;

    onMonthChange(currentMonth);
    onYearChange(currentYear);
  };

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-3">
      <div className="min-w-0">
        <div className="text-sm font-semibold text-slate-900">Periodo</div>
        <div className="text-[11px] text-slate-500">
          Seleziona mese e anno
        </div>
      </div>

      <div className="flex ml-7 flex-col gap-2 sm:flex-row sm:items-center">
        <div className="flex gap-1">
          <button
            type="button"
            onClick={goToPreviousMonth}
            disabled={isPrevDisabled}
            className="h-9 w-9 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 outline-none hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Mese precedente"
          >
            ←
          </button>

          <button
            type="button"
            onClick={goToToday}
            disabled={!years.includes(currentYear)}
            className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 outline-none hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Today
          </button>

          <button
            type="button"
            onClick={goToNextMonth}
            disabled={isNextDisabled}
            className="h-9 w-9 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 outline-none hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Mese successivo"
          >
            →
          </button>
        </div>

        <select
          value={selectedMonth}
          onChange={(e) => onMonthChange(Number(e.target.value))}
          className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none focus:border-slate-400"
        >
          {MONTHS.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>

        <select
          value={selectedYear}
          onChange={(e) => onYearChange(Number(e.target.value))}
          className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none focus:border-slate-400"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}