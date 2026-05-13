import { useEffect, useMemo, useState } from "react";
import {
    ArrowLeft,
    Save,
    PlusCircle,
    MinusCircle,
    CalendarRange,
    Eraser,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import BulkUpdatePanel from "../components/BulkUpdatePanel";

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

const INITIAL_DATA = {
    title: "Amazon prime",
    icon: "",
    rows: [
        {
            year: 2025,
            values: ["100", "120", "150", "", "180", "", "", "210", "", "", "250", "300"],
        },
        {
            year: 2026,
            values: ["90", "", "130", "160", "", "", "400", "", "220", "", "", "280"],
        },
        {
            year: 2027,
            values: ["110", "", "", "170", "200", "", "", "", "260", "", "290", ""],
        },
        {
            year: 2028,
            values: ["", "140", "", "", "190", "", "230", "", "", "270", "", "310"],
        },
        {
            year: 2029,
            values: ["125", "", "155", "", "", "205", "", "", "245", "", "", "295"],
        },
        {
            year: 2030,
            values: ["", "135", "", "175", "", "", "225", "", "255", "", "285", ""],
        },
        {
            year: 2031,
            values: ["150", "", "", "", "210", "", "", "240", "", "275", "", "320"],
        },
    ],
};

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

function formatEuro(value) {
    return value.toLocaleString("it-IT", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

export default function BudgetPage() {
    const [data] = useState(INITIAL_DATA);

    const [rows, setRows] = useState([]);
    const [startYear, setStartYear] = useState("");
    const [endYear, setEndYear] = useState("");
    const [isInitialized, setIsInitialized] = useState(false);
    const [isYearsModalOpen, setIsYearsModalOpen] = useState(false);

    const loading = false;

    useEffect(() => {
        if (!data?.rows || !Array.isArray(data.rows) || isInitialized) return;

        const mappedRows = data.rows.map((item) => ({
            year: Number(item.year),
            values: Array.from({ length: 12 }, (_, index) => {
                const value = item.values?.[index];
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

    const yearsLabel = useMemo(() => {
        if (!sortedRows.length) return "Nessun anno";

        const firstYear = sortedRows[0].year;
        const lastYear = sortedRows[sortedRows.length - 1].year;

        if (firstYear === lastYear) return String(firstYear);

        return `${firstYear} - ${lastYear}`;
    }, [sortedRows]);

    function handleValueChange(year, monthIndex, value) {
        if (!/^\d*([.,]?\d{0,2})?$/.test(value)) return;

        setRows((prev) =>
            prev.map((row) =>
                row.year === year
                    ? {
                        ...row,
                        values: row.values.map((currentValue, index) =>
                            index === monthIndex ? value : currentValue
                        ),
                    }
                    : row
            )
        );
    }

    function handleAddNextYear() {
        setRows((prev) => [...prev, createYearRow(nextYear)]);
    }

    function handleRemoveLastYear() {
        setRows((prev) => {
            if (prev.length <= 1) return prev;

            const sorted = [...prev].sort((a, b) => a.year - b.year);
            const lastYear = sorted[sorted.length - 1].year;

            return prev.filter((row) => row.year !== lastYear);
        });
    }

    function handleSave() {
        const payload = {
            title: data.title,
            icon: data.icon,
            rows: sortedRows.map((row) => ({
                year: row.year,
                values: row.values,
            })),
        };

        console.log("Salvataggio:", payload);
    }

    function handleOpenYearsModal() {
        if (sortedRows.length > 0) {
            setStartYear(String(sortedRows[0].year));
            setEndYear(String(sortedRows[sortedRows.length - 1].year));
        } else {
            const currentYear = new Date().getFullYear();

            setStartYear(String(currentYear));
            setEndYear(String(currentYear));
        }

        setIsYearsModalOpen(true);
    }

    function handleCloseYearsModal() {
        setIsYearsModalOpen(false);
    }

    function handleApplyYearsRange() {
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
    }

    function handleClearRow(year) {
        setRows((prev) =>
            prev.map((row) =>
                row.year === year
                    ? {
                        ...row,
                        values: row.values.map(() => ""),
                    }
                    : row
            )
        );
    }

    if (loading && !isInitialized) {
        return (
            <div className="h-full bg-slate-50 p-3 sm:p-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-500 shadow-sm">
                    Caricamento...
                </div>
            </div>
        );
    }

    return (
        <div className="h-full min-h-0 bg-slate-50">
            <div className="flex h-full min-h-0 flex-col px-3 pb-3 sm:px-4 md:px-6 lg:px-8">
                <BudgetHeader
                    title={data.title}
                    subtitle="Gestisci i budget annuali della transazione"
                    yearsLabel={yearsLabel}
                    onOpenYearsModal={handleOpenYearsModal}
                    onSave={handleSave}
                />

                <div className="flex min-h-0 flex-1 flex-col pt-3">
                    <BulkUpdatePanel
                        rows={sortedRows}
                        setRows={setRows}
                        handleAddNextYear={handleAddNextYear}
                        handleRemoveLastYear={handleRemoveLastYear}
                    />

                    <div className="mt-3 min-h-0 flex-1 rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="h-full overflow-x-auto overflow-y-scroll rounded-2xl md:overflow-x-hidden">
                            <BudgetTable
                                sortedRows={sortedRows}
                                handleValueChange={handleValueChange}
                                handleClearRow={handleClearRow}
                            />
                        </div>
                    </div>

                    <BudgetFooterActions
                        nextYear={nextYear}
                        rowsCount={sortedRows.length}
                        onAddNextYear={handleAddNextYear}
                        onRemoveLastYear={handleRemoveLastYear}
                    />
                </div>
            </div>

            {isYearsModalOpen && (
                <YearsRangeModal
                    startYear={startYear}
                    endYear={endYear}
                    setStartYear={setStartYear}
                    setEndYear={setEndYear}
                    onClose={handleCloseYearsModal}
                    onConfirm={handleApplyYearsRange}
                />
            )}
        </div>
    );
}

function BudgetHeader({
    title,
    subtitle,
    yearsLabel,
    onOpenYearsModal,
    onSave,
}) {
    const navigate = useNavigate();

    return (
        <div className="sticky top-0 z-40 shrink-0 bg-slate-50">
            <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50 py-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                    <button
                        type="button"
                        onClick={() => navigate("/budgetPage")}
                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-100 hover:text-slate-900"
                    >
                        <ArrowLeft size={20} />
                    </button>

                    <div className="min-w-0">
                        <div className="flex min-w-0 items-center gap-2">
                            <h1 className="truncate text-xl font-semibold text-slate-900 sm:text-2xl">
                                {title}
                            </h1>

                            <span className="hidden rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-500 shadow-sm sm:inline-flex">
                                {yearsLabel}
                            </span>
                        </div>

                        <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                            {subtitle}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:flex sm:justify-end">
                    <button
                        type="button"
                        onClick={onOpenYearsModal}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 hover:text-slate-900 sm:px-4"
                    >
                        <CalendarRange className="h-4 w-4 shrink-0" />
                        <span className="truncate">Gestisci anni</span>
                    </button>

                    <button
                        type="button"
                        onClick={onSave}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-900 px-3 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 sm:px-4"
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
        <table className="w-[980px] border-collapse md:w-full md:table-fixed">
            <thead className="sticky top-0 z-20 bg-white">
                <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="w-36 px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 md:w-40">
                        Anno
                    </th>

                    {MONTHS.map((month) => (
                        <th
                            key={month}
                            className="px-1 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500 md:px-2"
                        >
                            {month}
                        </th>
                    ))}

                    <th className="w-12 px-2 py-3 md:w-14" />
                </tr>
            </thead>

            <tbody>
                {sortedRows.map((row) => {
                    const total = getYearTotal(row.values);

                    return (
                        <tr
                            key={row.year}
                            className="border-b border-slate-100 transition hover:bg-slate-50/70"
                        >
                            <td className="px-3 py-2 align-middle">
                                <div className="text-sm font-semibold text-slate-800">
                                    {row.year}
                                </div>

                                <div className="mt-0.5 text-xs font-medium leading-tight text-slate-500">
                                    Totale{" "}
                                    <span className="font-semibold text-slate-800">
                                        {formatEuro(total)} €
                                    </span>
                                </div>
                            </td>

                            {row.values.map((value, monthIndex) => (
                                <td key={monthIndex} className="px-1 py-2 md:px-2">
                                    <input
                                        inputMode="decimal"
                                        step="0.01"
                                        value={value}
                                        onChange={(event) =>
                                            handleValueChange(
                                                row.year,
                                                monthIndex,
                                                event.target.value
                                            )
                                        }
                                        className="h-9 w-full rounded-xl border border-slate-200 bg-white px-2 text-center text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:ring-2 focus:ring-slate-200 sm:h-10 md:px-3"
                                    />
                                </td>
                            ))}

                            <td className="px-1 py-2 text-center md:px-2">
                                <button
                                    type="button"
                                    onClick={() => handleClearRow(row.year)}
                                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
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

function BudgetFooterActions({
    nextYear,
    rowsCount,
    onAddNextYear,
    onRemoveLastYear,
}) {
    return (
        <div className="mt-3 grid shrink-0 gap-2 sm:flex sm:justify-center">
            <button
                type="button"
                onClick={onRemoveLastYear}
                disabled={rowsCount <= 1}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
                <MinusCircle className="h-5 w-5 shrink-0" />
                <span className="truncate">Togli ultimo anno ({nextYear - 1})</span>
            </button>

            <button
                type="button"
                onClick={onAddNextYear}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 hover:text-slate-900 sm:w-auto"
            >
                <PlusCircle className="h-5 w-5 shrink-0" />
                <span className="truncate">Aggiungi anno successivo ({nextYear})</span>
            </button>
        </div>
    );
}

function YearsRangeModal({
    startYear,
    endYear,
    setStartYear,
    setEndYear,
    onClose,
    onConfirm,
}) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-3 sm:p-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="mb-4">
                    <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
                        Gestisci anni
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Inserisci l&apos;intervallo di anni da mostrare in tabella.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <YearInput
                        label="Anno iniziale"
                        value={startYear}
                        onChange={setStartYear}
                        placeholder="Es. 2025"
                    />

                    <YearInput
                        label="Anno finale"
                        value={endYear}
                        onChange={setEndYear}
                        placeholder="Es. 2031"
                    />
                </div>

                <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-10 w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-100 sm:w-auto"
                    >
                        Annulla
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        className="inline-flex h-10 w-full items-center justify-center rounded-xl bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800 sm:w-auto"
                    >
                        Conferma
                    </button>
                </div>
            </div>
        </div>
    );
}

function YearInput({
    label,
    value,
    onChange,
    placeholder,
}) {
    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
                {label}
            </label>

            <input
                type="number"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-slate-200"
            />
        </div>
    );
}