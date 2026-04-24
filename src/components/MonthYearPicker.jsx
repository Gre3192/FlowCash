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






  return (
    <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-3">
      <div className="min-w-0">
        <div className="text-sm font-semibold text-slate-900">Periodo</div>
        <div className="text-[11px] text-slate-500">Seleziona mese e anno</div>
      </div>

      <div className="flex ml-7 flex-col gap-2 sm:flex-row">
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