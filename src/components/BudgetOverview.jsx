import React, { useState } from "react";
import { CalendarDays, ChevronDown } from "lucide-react";

const BudgetOverview = ({

  title = "Panoramica generale",
  current = 993.79,
  total = 1400,
  month = "Gennaio",
  years = [2024, 2025, 2026],
  defaultYear = 2026,

}) => {
  const [year, setYear] = useState(defaultYear);

  const percent = Math.min((current / total) * 100, 100).toFixed(1);

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-slate-700">
          {title} - {month} {year}
        </h3>

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <CalendarDays size={16} className="text-slate-500" />
          </div>

          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="
              appearance-none rounded-xl border border-slate-200 bg-white
              pl-10 pr-10 py-2 text-sm font-medium text-slate-700
              shadow-sm transition-all duration-200
              hover:border-slate-300 hover:bg-slate-50
              focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10
              cursor-pointer
            "
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ChevronDown size={16} className="text-slate-400" />
          </div>
        </div>
      </div>

      <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
        <span>
          €{current.toFixed(2)} di €{total.toFixed(2)}
        </span>
        <span className="font-semibold text-slate-700">{percent}%</span>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-slate-900 transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

export default BudgetOverview;