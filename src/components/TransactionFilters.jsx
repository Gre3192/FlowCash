import React from "react";
import { Search, ChevronDown } from "lucide-react";
import TransactionTypeToggle from "./TransactionTypeToggle";

export default function TransactionFilters({
  search,
  setSearch,
  type,
  setType,
  category,
  setCategory,
  month,
  setMonth,
}) {

  const months = [
    "Tutti i mesi",
    "Gennaio",
    "Febbraio",
    "Marzo",
    "Aprile",
    "Maggio",
    "Giugno",
    "Luglio",
    "Agosto",
    "Settembre",
    "Ottobre",
    "Novembre",
    "Dicembre"
  ];

  return (
    <div className="w-full bg-slate-100 border border-slate-200 rounded-xl p-4">
      
      <div className="flex gap-4 items-center flex-wrap">

        {/* SEARCH */}
        <div className="flex items-center gap-2 flex-1 bg-slate-200 rounded-lg px-3 py-2">
          <Search size={18} className="text-slate-500" />
          <input
            type="text"
            placeholder="Cerca transazioni..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none w-full text-sm text-slate-700 placeholder-slate-500"
          />
        </div>

        {/* MONTH FILTER */}
        <div className="relative">
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="appearance-none bg-slate-200 text-sm text-slate-700 rounded-lg px-4 py-2 pr-8 outline-none"
          >
            {months.map((m, i) => (
              <option key={i} value={i === 0 ? "all" : i}>
                {m}
              </option>
            ))}
          </select>

          <ChevronDown
            size={16}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
          />
        </div>

        {/* TYPE FILTER */}
        <div className="relative">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="appearance-none bg-slate-200 text-sm text-slate-700 rounded-lg px-4 py-2 pr-8 outline-none"
          >
            <option value="all">Tutti i tipi</option>
            <option value="income">Entrate</option>
            <option value="expense">Uscite</option>
          </select>

          <ChevronDown
            size={16}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
          />
        </div>

        {/* CATEGORY FILTER */}
        <div className="relative">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="appearance-none bg-slate-200 text-sm text-slate-700 rounded-lg px-4 py-2 pr-8 outline-none"
          >
            <option value="all">Tutte le categorie</option>
          </select>

          <ChevronDown
            size={16}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
          />
        </div>

      </div>
    </div>
  );
}