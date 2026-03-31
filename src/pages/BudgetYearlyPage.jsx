import React, { useMemo, useState } from "react";
import { ArrowLeft, Save, PlusCircle, MinusCircle, CalendarRange, Eraser } from "lucide-react";
import BulkUpdatePanel from "../components/BulkUpdatePanel";

function createYearRow(year) {
  return {
    year,
    values: Array(12).fill(""),
  };
}

function getYearTotal(values) {
  const totalCents = values.reduce((sum, value) => {
    const num = Number(value);
    if (Number.isNaN(num)) return sum;

    return sum + Math.round(num * 100);
  }, 0);

  return totalCents / 100;
}

const MONTHS = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];

export default function BudgetYearlyPage() {
  const [title] = useState("Amazon Prime");
  const [subtitle] = useState("Gestisci i tuoi budget");
  const [isBulkOpen, setIsBulkOpen] = useState(false);

  const [rows, setRows] = useState(() => {
    const initial = [];
    for (let year = 2025; year <= 2031; year++) {
      const row = createYearRow(year);

      if (year === 2026) {
        row.values[6] = "400";
      }

      initial.push(row);
    }
    return initial;
  });

  const [isYearsModalOpen, setIsYearsModalOpen] = useState(false);
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");

  const sortedRows = useMemo(() => {
    return [...rows].sort((a, b) => a.year - b.year);
  }, [rows]);

  const nextYear = useMemo(() => {
    if (!sortedRows.length) return new Date().getFullYear();
    return sortedRows[sortedRows.length - 1].year + 1;
  }, [sortedRows]);

  const handleValueChange = (year, monthIndex, value) => {
    setRows((prev) =>
      prev.map((row) =>
        row.year === year
          ? {
              ...row,
              values: row.values.map((v, i) => (i === monthIndex ? value : v)),
            }
          : row
      )
    );
  };

  const handleAddNextYear = () => {
    setRows((prev) => [...prev, createYearRow(nextYear)]);
  };

  const handleRemoveLastYear = () => {
    setRows((prev) => {
      if (prev.length <= 1) return prev;

      const sorted = [...prev].sort((a, b) => a.year - b.year);
      const lastYear = sorted[sorted.length - 1].year;

      return prev.filter((row) => row.year !== lastYear);
    });
  };

  const handleSave = () => {
    const payload = sortedRows.map((row) => ({
      year: row.year,
      values: row.values.map((v) => (v === "" ? null : Number(v))),
      total: getYearTotal(row.values),
    }));

    console.log("Salvataggio:", payload);
  };

  const handleOpenYearsModal = () => {
    if (sortedRows.length > 0) {
      setStartYear(String(sortedRows[0].year));
      setEndYear(String(sortedRows[sortedRows.length - 1].year));
    } else {
      const currentYear = new Date().getFullYear();
      setStartYear(String(currentYear));
      setEndYear(String(currentYear));
    }

    setIsYearsModalOpen(true);
  };

  const handleCloseYearsModal = () => {
    setIsYearsModalOpen(false);
  };

  const handleApplyYearsRange = () => {
    const start = Number(startYear);
    const end = Number(endYear);

    if (!Number.isInteger(start) || !Number.isInteger(end)) return;
    if (start > end) return;

    const nextRows = [];

    for (let year = start; year <= end; year++) {
      const existingRow = rows.find((row) => row.year === year);

      if (existingRow) {
        nextRows.push(existingRow);
      } else {
        nextRows.push(createYearRow(year));
      }
    }

    setRows(nextRows);
    setIsYearsModalOpen(false);
  };

  const handleClearRow = (year) => {
    setRows((prev) =>
      prev.map((row) =>
        row.year === year
          ? { ...row, values: row.values.map(() => "") }
          : row
      )
    );
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="flex min-h-screen flex-col px-3 py-3 sm:px-4 md:px-6 lg:px-8">
        <div className="mb-3 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <button
              type="button"
              className="mt-1 shrink-0 rounded-md p-1 text-zinc-500 transition hover:bg-white hover:text-zinc-800"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div className="min-w-0">
              <h1 className="truncate text-2xl font-semibold leading-none text-zinc-900 sm:text-3xl md:text-[34px]">
                {title}
              </h1>
              <p className="mt-1 text-sm text-zinc-500">
                {subtitle}
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap lg:justify-end">
            <button
              type="button"
              onClick={handleOpenYearsModal}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50 sm:w-auto"
            >
              <CalendarRange className="h-4 w-4 shrink-0" />
              <span className="truncate">Gestisci anni</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 sm:w-auto"
            >
              <Save className="h-4 w-4 shrink-0" />
              <span>Salva</span>
            </button>
          </div>
        </div>

        <div className="shrink-0">
          <BulkUpdatePanel
            rows={sortedRows}
            setRows={setRows}
            isOpen={isBulkOpen}
            setIsOpen={setIsBulkOpen}
          />
        </div>

        <div className="mt-2">
          <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <div className="h-[52vh] overflow-x-auto overflow-y-scroll sm:h-[56vh] lg:h-[58vh] md:overflow-x-hidden">
              <table className="w-[980px] border-collapse sm:w-[1080px] md:w-full md:table-fixed">
                <thead className="sticky top-0 z-10 bg-white">
                  <tr className="border-b border-zinc-200 bg-zinc-50/80">
                    <th className="w-32 px-3 py-3 text-left text-xs font-medium text-zinc-500 sm:w-36 sm:text-sm md:w-40 md:px-3">
                      Anno
                    </th>

                    {MONTHS.map((month) => (
                      <th
                        key={month}
                        className="px-1 py-3 text-center text-[11px] font-medium text-zinc-500 sm:text-xs md:px-2 md:text-sm"
                      >
                        {month}
                      </th>
                    ))}

                    <th className="w-12 px-2 py-3 sm:w-14 md:w-16 md:px-3" />
                  </tr>
                </thead>

                <tbody>
                  {sortedRows.map((row) => {
                    const total = getYearTotal(row.values);

                    return (
                      <tr key={row.year} className="border-b border-zinc-100">
                        <td className="px-3 py-2 align-middle md:px-3">
                          <div className="text-sm font-semibold text-zinc-700">
                            {row.year}
                          </div>
                          <div className="mt-0 text-xs font-medium leading-tight text-zinc-500">
                            Totale:{" "}
                            <span className="font-semibold text-zinc-800">
                              {total.toLocaleString("it-IT", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}{" "}
                              &euro;
                            </span>
                          </div>
                        </td>

                        {row.values.map((value, monthIndex) => (
                          <td key={monthIndex} className="px-1 py-2 md:px-2">
                            <input
                              type="number"
                              step="0.01"
                              value={value}
                              onChange={(e) =>
                                handleValueChange(row.year, monthIndex, e.target.value)
                              }
                              className="h-9 w-full rounded-xl border border-zinc-200 bg-white px-2 text-center text-sm text-zinc-700 outline-none transition focus:border-zinc-300 focus:ring-2 focus:ring-zinc-200 sm:h-10 md:px-3"
                            />
                          </td>
                        ))}

                        <td className="px-1 py-2 text-center md:px-2">
                          <button
                            type="button"
                            onClick={() => handleClearRow(row.year)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 transition hover:scale-110 sm:h-9 sm:w-9"
                          >
                            <Eraser size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-4 flex shrink-0 flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={handleRemoveLastYear}
            disabled={sortedRows.length <= 1}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-800 shadow-sm transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-5"
          >
            <MinusCircle className="h-5 w-5 shrink-0" />
            <span className="truncate">Togli ultimo anno ({nextYear - 1})</span>
          </button>

          <button
            type="button"
            onClick={handleAddNextYear}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-800 shadow-sm transition hover:bg-zinc-50 sm:w-auto sm:px-5"
          >
            <PlusCircle className="h-5 w-5 shrink-0" />
            <span className="truncate">Aggiungi anno successivo ({nextYear})</span>
          </button>
        </div>
      </div>

      {isYearsModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-4"
          onClick={handleCloseYearsModal}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-4 shadow-xl sm:p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4">
              <h2 className="text-base font-semibold text-zinc-800 sm:text-lg">
                Gestisci anni
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Inserisci l'intervallo di anni da mostrare in tabella.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Anno iniziale
                </label>
                <input
                  type="number"
                  value={startYear}
                  onChange={(e) => setStartYear(e.target.value)}
                  placeholder="Es. 2025"
                  className="h-10 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-700 outline-none transition placeholder:text-zinc-400 focus:border-zinc-300 focus:bg-white focus:ring-2 focus:ring-zinc-200"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Anno finale
                </label>
                <input
                  type="number"
                  value={endYear}
                  onChange={(e) => setEndYear(e.target.value)}
                  placeholder="Es. 2031"
                  className="h-10 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-700 outline-none transition placeholder:text-zinc-400 focus:border-zinc-300 focus:bg-white focus:ring-2 focus:ring-zinc-200"
                />
              </div>
            </div>

            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleCloseYearsModal}
                className="inline-flex h-10 w-full items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 sm:w-auto"
              >
                Annulla
              </button>

              <button
                type="button"
                onClick={handleApplyYearsRange}
                className="inline-flex h-10 w-full items-center justify-center rounded-xl bg-black px-4 text-sm font-medium text-white transition hover:bg-zinc-800 sm:w-auto"
              >
                Conferma
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}