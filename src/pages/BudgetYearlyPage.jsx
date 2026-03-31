import React, { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Save, PlusCircle, CalendarRange, Eraser } from "lucide-react";
import BulkUpdatePanel from "../components/BulkUpdatePanel";

function createYearRow(year) {
  return {
    year,
    values: Array(12).fill(""),
  };
}

function getYearTotal(values) {
  return values.reduce((sum, value) => {
    const num = Number(value);
    return sum + (Number.isNaN(num) ? 0 : num);
  }, 0);
}

const MONTHS = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];

export default function BudgetYearlyPage() {
  const [title] = useState("Amazon Prime");
  const [subtitle] = useState("Gestisci i tuoi budget");
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [tableMaxHeight, setTableMaxHeight] = useState(null);

  const tableSectionRef = useRef(null);
  const addButtonRef = useRef(null);

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

  useEffect(() => {
    if (isBulkOpen) return;

    const calculateTableMaxHeight = () => {
      if (!tableSectionRef.current || !addButtonRef.current) return;

      const tableTop = tableSectionRef.current.getBoundingClientRect().top;
      const addButtonHeight = addButtonRef.current.getBoundingClientRect().height;

      const bottomSafeSpace = 24;
      const gapAboveButton = 16;

      const availableHeight =
        window.innerHeight - tableTop - addButtonHeight - gapAboveButton - bottomSafeSpace;

      setTableMaxHeight(Math.max(220, Math.floor(availableHeight)));
    };

    calculateTableMaxHeight();

    window.addEventListener("resize", calculateTableMaxHeight);
    return () => window.removeEventListener("resize", calculateTableMaxHeight);
  }, [isBulkOpen, rows.length]);

  return (
    <div className="min-h-screen  bg-zinc-50">
      <div className="flex min-h-screen flex-col px-4 py-3 md:px-8">
        <div className="mb-1 flex shrink-0 items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <button
              type="button"
              className="mt-1 rounded-md p-1 text-zinc-500 transition hover:bg-white hover:text-zinc-800"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div>
              <h1 className="text-[34px] font-semibold leading-none text-zinc-900">
                {title}
              </h1>
              <p className="mt-1 text-sm text-zinc-500">
                {subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleOpenYearsModal}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50"
            >
              <CalendarRange className="h-4 w-4" />
              Gestisci anni
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800"
            >
              <Save className="h-4 w-4" />
              Salva
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

        <div ref={tableSectionRef} className="mt-0">
          <div
            className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm md:overflow-x-hidden"
            style={{
              maxHeight: tableMaxHeight ? `${tableMaxHeight}px` : "none",
              overflowY: "auto",
            }}
          >
            <table className="w-[1120px] border-collapse md:w-full md:table-fixed">
              <thead className="sticky top-0 z-10 bg-white">
                <tr className="border-b border-zinc-200 bg-zinc-50/80">
                  <th className="w-36 px-2 py-3 text-left text-sm font-medium text-zinc-500 md:w-40 md:px-3">
                    Anno
                  </th>

                  {MONTHS.map((month) => (
                    <th
                      key={month}
                      className="px-1 py-3 text-center text-xs font-medium text-zinc-500 md:px-2 md:text-sm"
                    >
                      {month}
                    </th>
                  ))}

                  <th className="w-14 px-2 py-3 md:w-16 md:px-3" />
                </tr>
              </thead>

              <tbody>
                {sortedRows.map((row) => {
                  const total = getYearTotal(row.values);

                  return (
                    <tr key={row.year} className="border-b border-zinc-100">
                      <td className="px-2 py-2 align-middle md:px-3">
                        <div className="text-sm font-semibold text-zinc-700">
                          {row.year}
                        </div>
                        <div className="mt-0 text-xs font-medium text-zinc-500">
                          Totale:{" "}
                          <span className="font-semibold text-zinc-800">
                            {total} &euro;
                          </span>
                        </div>
                      </td>

                      {row.values.map((value, monthIndex) => (
                        <td key={monthIndex} className="px-1 py-2 md:px-2">
                          <input
                            type="number"
                            value={value}
                            onChange={(e) =>
                              handleValueChange(row.year, monthIndex, e.target.value)
                            }
                            className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-2 text-center text-sm text-zinc-700 outline-none transition focus:border-zinc-300 focus:ring-2 focus:ring-zinc-200 md:px-3"
                          />
                        </td>
                      ))}

                      <td className="px-1 py-2 text-center md:px-2">
                        <button
                          type="button"
                          onClick={() => handleClearRow(row.year)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 transition hover:scale-125"
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

        <div ref={addButtonRef} className="mt-4 flex shrink-0 justify-center">
          <button
            type="button"
            onClick={handleAddNextYear}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-800 shadow-sm transition hover:bg-zinc-50"
          >
            <PlusCircle className="h-5 w-5" />
            Aggiungi anno successivo ({nextYear})
          </button>
        </div>
      </div>

      {isYearsModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={handleCloseYearsModal}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-zinc-800">
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

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={handleCloseYearsModal}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
              >
                Annulla
              </button>

              <button
                type="button"
                onClick={handleApplyYearsRange}
                className="inline-flex h-10 items-center justify-center rounded-xl bg-black px-4 text-sm font-medium text-white transition hover:bg-zinc-800"
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