import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Save,
  PlusCircle,
  MinusCircle,
  CalendarRange,
  Eraser,
} from "lucide-react";
import BulkUpdatePanel from "../components/Old/BulkUpdatePanel";
import { useNavigate } from "react-router-dom";
import { useGet } from "../hooks/useGet";
import { API_ENDPOINTS } from "../api/endpoint";

function createYearRow(year) {
  return {
    year,
    values: Array(12).fill(""),
  };
}

function getYearTotal(values) {
  const totalCents = values.reduce((sum, value) => {
    const normalized = String(value).replace(",", ".");
    const num = Number(normalized);

    if (Number.isNaN(num)) return sum;

    return sum + Math.round(num * 100);
  }, 0);

  return totalCents / 100;
}

const MONTHS = [
  "Gen",
  "Feb",
  "Mar",
  "Apr",
  "Mag",
  "Giu",
  "Lug",
  "Ago",
  "Set",
  "Ott",
  "Nov",
  "Dic",
];

export default function BudgetYearlyPage() {
  
  const { data, loading } = useGet(API_ENDPOINTS.transactionBudget());
  const [isYearsModalOpen, setIsYearsModalOpen] = useState(false);
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [rows, setRows] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!data?.rows || !Array.isArray(data.rows) || isInitialized) return;

    const mappedRows = data.rows.map((item) => ({
      year: Number(item.year),
      values: Array.from({ length: 12 }, (_, i) => {
        const value = item.values?.[i];
        return value === null || value === undefined ? "" : String(value);
      }),
    }));

    setRows(mappedRows);
    setIsInitialized(true);
  }, [data, isInitialized]);

  const sortedRows = useMemo(() => {
    return [...rows].sort((a, b) => a.year - b.year);
  }, [rows]);

  const nextYear = useMemo(() => {
    if (!sortedRows.length) return new Date().getFullYear();
    return sortedRows[sortedRows.length - 1].year + 1;
  }, [sortedRows]);

  const handleValueChange = (year, monthIndex, value) => {
    if (!/^\d*([.,]?\d{0,2})?$/.test(value)) return;

    setRows((prev) =>
      prev.map((row) =>
        row.year === year
          ? {
            ...row,
            values: row.values.map((v, i) =>
              i === monthIndex ? value : v
            ),
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
    const payload = {
      title: "Amazon prime",
      icon: "",
      rows: sortedRows.map((row) => ({
        year: row.year,
        values: row.values,
      })),
    };

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
        row.year === year ? { ...row, values: row.values.map(() => "") } : row
      )
    );
  };

  if (loading && !isInitialized) {
    return (
      <div className="bg-zinc-50">
        <div className="flex flex-col px-3 pb-3 sm:px-4 md:px-6 lg:px-8">
          <div className="py-6 text-sm text-zinc-500">Caricamento...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-50">
      <div className="flex flex-col px-3 pb-3 sm:px-4 md:px-6 lg:px-8">
        <BudgetHeader
          title={data.title}
          subtitle={"Gestisci i tuoi budget"}
          handleOpenYearsModal={handleOpenYearsModal}
          handleSave={handleSave}
        />

        <div className="pt-3 px-1">
          <BulkUpdatePanel
            rows={sortedRows}
            setRows={setRows}
            handleAddNextYear={handleAddNextYear}
            handleRemoveLastYear={handleRemoveLastYear}
          />

          <div className="rounded-2xl mt-2 border border-zinc-200 bg-white shadow-sm h-[52vh] overflow-x-auto overflow-y-scroll pb-2 sm:h-[56vh] lg:h-[54vh] md:overflow-x-hidden">
            <BudgetTable
              sortedRows={sortedRows}
              handleValueChange={handleValueChange}
              handleClearRow={handleClearRow}
            />
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
              <span className="truncate">
                Aggiungi anno successivo ({nextYear})
              </span>
            </button>
          </div>
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
                Inserisci l&apos;intervallo di anni da mostrare in tabella.
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

function BudgetHeader({
  title,
  subtitle,
  handleOpenYearsModal,
  handleSave,
}) {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-40 overflow-hidden">
      <div className="absolute inset-0 bg-zinc-50 shadow-sm" />
      <div className="relative flex flex-col gap-3 py-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <ArrowLeft
            size={25}
            className="cursor-pointer"
            onClick={() => navigate("/budgetPage")}
          />
          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-2">
              <div className="truncate text-2xl font-semibold leading-none text-zinc-900 sm:text-3xl md:text-3xl">
                {title}
              </div>
            </div>

            <div className="mt-1 text-sm text-zinc-500">{subtitle}</div>
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
    </div>
  );
}

function BudgetTable({
  sortedRows,
  handleValueChange,
  handleClearRow,
}) {
  return (
    <table className="w-245 border-collapse sm:w-270 md:w-full md:table-fixed">
      <thead className="sticky top-0 z-20 bg-white">
        <tr className="border-b border-zinc-200 bg-zinc-50">
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

      <tbody className="pb-2">
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
                  aria-label="Pulisci riga"
                  title="Pulisci riga"
                >
                  <Eraser size={16} />
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}