import { useEffect, useRef, useState } from "react";
import {
    Wallet,
    TrendingUp,
    TrendingDown,
    PiggyBank,
    CalendarDays,
    Pencil,
    Lock,
} from "lucide-react";

import formatCurrency from "../utils/formatCurrency";

const summaryData = {
    year: 2028,
    savingWallet: 4869.33,

    annual: {
        startMonth: 8223.86,
        income: 18100,
        expense: 12358.04,
        expectedSaving: 4800,
        realEndMonth: null,
    },

    months: [
        {
            label: "Gennaio",
            shortLabel: "GEN",
            startMonth: 1156.97,
            income: 1400,
            expense: 1257.49,
            endMonth: 899.48,
            expectedSaving: 400,
            realEndMonth: null,
        },
        {
            label: "Febbraio",
            shortLabel: "FEB",
            startMonth: 899.48,
            income: 1400,
            expense: 1443.34,
            endMonth: 456.14,
            expectedSaving: 400,
            realEndMonth: null,
        },
        {
            label: "Marzo",
            shortLabel: "MAR",
            startMonth: 456.14,
            income: 1400,
            expense: 858.05,
            endMonth: 598.09,
            expectedSaving: 400,
            realEndMonth: null,
        },
        {
            label: "Aprile",
            shortLabel: "APR",
            startMonth: 598.09,
            income: 1400,
            expense: 1018.34,
            endMonth: 579.75,
            expectedSaving: 400,
            realEndMonth: null,
        },
        {
            label: "Maggio",
            shortLabel: "MAG",
            startMonth: 579.75,
            income: 1400,
            expense: 808.14,
            endMonth: 771.61,
            expectedSaving: 400,
            realEndMonth: null,
        },
        {
            label: "Giugno",
            shortLabel: "GIU",
            startMonth: 771.61,
            income: 1400,
            expense: 1018.34,
            endMonth: 753.27,
            expectedSaving: 400,
            realEndMonth: null,
        },
        {
            label: "Luglio",
            shortLabel: "LUG",
            startMonth: 753.27,
            income: 1400,
            expense: 1283.04,
            endMonth: 470.23,
            expectedSaving: 400,
            realEndMonth: null,
        },
        {
            label: "Agosto",
            shortLabel: "AGO",
            startMonth: 470.23,
            income: 1400,
            expense: 1018.34,
            endMonth: 451.89,
            expectedSaving: 400,
            realEndMonth: null,
        },
        {
            label: "Settembre",
            shortLabel: "SET",
            startMonth: 451.89,
            income: 1400,
            expense: 808.14,
            endMonth: 643.75,
            expectedSaving: 400,
            realEndMonth: null,
        },
        {
            label: "Ottobre",
            shortLabel: "OTT",
            startMonth: 643.75,
            income: 1400,
            expense: 1018.34,
            endMonth: 625.41,
            expectedSaving: 400,
            realEndMonth: null,
        },
        {
            label: "Novembre",
            shortLabel: "NOV",
            startMonth: 625.41,
            income: 1400,
            expense: 808.14,
            endMonth: 817.27,
            expectedSaving: 400,
            realEndMonth: null,
        },
        {
            label: "Dicembre",
            shortLabel: "DIC",
            startMonth: 817.27,
            income: 2700,
            expense: 1018.34,
            endMonth: 2098.93,
            expectedSaving: 400,
            realEndMonth: null,
        },
    ],
};

const EDITABLE_ROWS = ["startMonth", "expectedSaving", "realEndMonth"];

function normalizeNumberValue(value) {
    if (value === "" || value === null || value === undefined) {
        return null;
    }

    const normalizedValue = String(value).replace(",", ".");
    const numericValue = Number(normalizedValue);

    if (Number.isNaN(numericValue)) {
        return null;
    }

    return numericValue;
}

function formatInputValue(value) {
    if (value === null || value === undefined) {
        return "";
    }

    return String(value);
}

function SummaryCard({
    title,
    value,
    icon: Icon,
    variant = "default",
}) {
    const variants = {
        default: {
            wrapper: "border-slate-200 bg-white",
            icon: "bg-slate-100 text-slate-700",
            value: "text-slate-900",
        },
        income: {
            wrapper: "border-emerald-200 bg-emerald-50",
            icon: "bg-emerald-100 text-emerald-700",
            value: "text-emerald-700",
        },
        expense: {
            wrapper: "border-red-200 bg-red-50",
            icon: "bg-red-100 text-red-700",
            value: "text-red-700",
        },
        saving: {
            wrapper: "border-sky-200 bg-sky-50",
            icon: "bg-sky-100 text-sky-700",
            value: "text-sky-700",
        },
    };

    const selectedVariant = variants[variant] || variants.default;

    return (
        <div
            className={`
                rounded-2xl border p-4 shadow-sm
                ${selectedVariant.wrapper}
            `}
        >
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        {title}
                    </p>

                    <p className={`mt-2 text-xl font-semibold ${selectedVariant.value}`}>
                        {formatCurrency(value)}
                    </p>
                </div>

                <div
                    className={`
                        flex h-10 w-10 items-center justify-center rounded-xl
                        ${selectedVariant.icon}
                    `}
                >
                    <Icon size={18} />
                </div>
            </div>
        </div>
    );
}

function MoneyCell({
    value,
    variant = "default",
    strong = false,
    isEditable = false,
    onChange,
    onKeyDown,
}) {
    const variants = {
        default: "text-slate-700",
        income: "text-emerald-700",
        expense: "text-red-700",
        saving: "text-sky-700",
        total: "text-slate-900",
        real: "text-indigo-700",
        surplusPositive: "text-emerald-700",
        surplusNegative: "text-red-700",
        muted: "text-slate-400",
    };

    if (isEditable) {
        return (
            <td className="whitespace-nowrap px-3 py-3 text-right text-xs font-medium">
                <input
                    type="text"
                    inputMode="decimal"
                    value={formatInputValue(value)}
                    onChange={(event) => onChange?.(event.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder="-"
                    className={`
                        h-7 w-full min-w-0 rounded-md border border-slate-200 bg-white px-1.5 text-right text-xs font-medium
                        outline-none transition
                        placeholder:text-slate-400
                        focus:border-slate-400 focus:ring-2 focus:ring-slate-200
                        ${variants[variant] || variants.default}
                    `}
                />
            </td>
        );
    }

    if (value === null || value === undefined || value === "") {
        return (
            <td className="whitespace-nowrap px-3 py-3 text-right text-xs font-medium text-slate-400">
                -
            </td>
        );
    }

    return (
        <td
            className={`
                whitespace-nowrap px-3 py-3 text-right text-xs
                ${strong ? "font-semibold" : "font-medium"}
                ${variants[variant] || variants.default}
            `}
        >
            {formatCurrency(value)}
        </td>
    );
}

export default function YearBalanceSummaryPage() {
    const { year, savingWallet, annual } = summaryData;

    const rowRefs = useRef({});

    const [monthsData, setMonthsData] = useState(summaryData.months);

    const [editableRows, setEditableRows] = useState({
        startMonth: false,
        expectedSaving: false,
        realEndMonth: false,
    });

    useEffect(() => {
        function handleClickOutsideEditableRow(event) {
            setEditableRows((prev) => {
                let hasChanges = false;
                const nextEditableRows = { ...prev };

                Object.entries(prev).forEach(([rowKey, isEditable]) => {
                    if (!isEditable) return;

                    const rowElement = rowRefs.current[rowKey];

                    if (!rowElement) return;

                    const clickedInsideRow = rowElement.contains(event.target);

                    if (!clickedInsideRow) {
                        nextEditableRows[rowKey] = false;
                        hasChanges = true;
                    }
                });

                return hasChanges ? nextEditableRows : prev;
            });
        }

        document.addEventListener("mousedown", handleClickOutsideEditableRow);

        return () => {
            document.removeEventListener("mousedown", handleClickOutsideEditableRow);
        };
    }, []);

    const monthsWithSurplus = monthsData.map((month) => {
        const startMonth = normalizeNumberValue(month.startMonth) ?? 0;
        const income = normalizeNumberValue(month.income) ?? 0;
        const expense = normalizeNumberValue(month.expense) ?? 0;
        const expectedSaving = normalizeNumberValue(month.expectedSaving) ?? 0;

        const endMonth = startMonth + income - expense - expectedSaving;

        const realEndMonth = normalizeNumberValue(month.realEndMonth);

        const surplusEndMonth =
            realEndMonth !== null && realEndMonth !== undefined
                ? realEndMonth - endMonth
                : null;

        return {
            ...month,
            endMonth,
            surplusEndMonth,
        };
    });

    const annualRealEndMonth = annual.realEndMonth;

    const lastHypotheticalEndMonth =
        monthsWithSurplus[monthsWithSurplus.length - 1]?.endMonth ?? 0;

    const annualSurplusEndMonth =
        annualRealEndMonth !== null && annualRealEndMonth !== undefined
            ? annualRealEndMonth - lastHypotheticalEndMonth
            : null;

    const balance = annual.income - annual.expense;

    const savingProgress =
        annual.expectedSaving > 0
            ? Math.min((balance / annual.expectedSaving) * 100, 100)
            : 0;

    const rows = [
        {
            key: "startMonth",
            label: "Inizio mese ipotetico",
            variant: "default",
            rowClassName: "bg-white",
        },
        {
            key: "income",
            label: "Entrate",
            variant: "income",
            rowClassName: "bg-emerald-50/60",
        },
        {
            key: "expense",
            label: "Uscite",
            variant: "expense",
            rowClassName: "bg-red-50/60",
        },
        {
            key: "expectedSaving",
            label: "Risparmio ipotetico",
            variant: "saving",
            rowClassName: "bg-sky-50/60",
        },
        {
            key: "endMonth",
            label: "Fine mese ipotetico",
            variant: "total",
            rowClassName: "bg-slate-50",
        },
        {
            key: "realEndMonth",
            label: "Fine mese reale",
            variant: "real",
            rowClassName: "bg-indigo-50/60",
            separator: true,
        },
        {
            key: "surplusEndMonth",
            label: "Surplus fine mese",
            subtitle: "(reale - ipotetico)",
            variant: "surplus",
            rowClassName: "bg-fuchsia-50/60",
        },
    ];

    function getCellVariant(row, value) {
        if (row.key !== "surplusEndMonth") {
            return row.variant;
        }

        if (value === null || value === undefined) {
            return "muted";
        }

        return value >= 0 ? "surplusPositive" : "surplusNegative";
    }

    function isRowEditable(rowKey) {
        return EDITABLE_ROWS.includes(rowKey);
    }

    function handleToggleEditableRow(rowKey) {
        setEditableRows((prev) => ({
            ...prev,
            [rowKey]: !prev[rowKey],
        }));
    }

    function handleRowInputKeyDown(event, rowKey) {
        if (event.key !== "Enter") return;

        event.preventDefault();

        setEditableRows((prev) => ({
            ...prev,
            [rowKey]: false,
        }));

        event.currentTarget.blur();
    }

    function handleMonthValueChange(monthIndex, fieldKey, value) {
        setMonthsData((prev) =>
            prev.map((month, index) => {
                if (index !== monthIndex) {
                    return month;
                }

                return {
                    ...month,
                    [fieldKey]: value,
                };
            })
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-6">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
                <header className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                            <CalendarDays size={18} />
                        </div>

                        <div>
                            <h1 className="text-xl font-semibold text-slate-900">
                                Bilancio {year}
                            </h1>

                            <p className="text-sm text-slate-500">
                                Riepilogo annuale di entrate, uscite e risparmio
                            </p>
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-right">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            Portafoglio risparmio
                        </p>

                        <p className="text-lg font-semibold text-slate-900">
                            {formatCurrency(savingWallet)}
                        </p>
                    </div>
                </header>

                <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <SummaryCard
                        title="Portafoglio risparmio"
                        value={savingWallet}
                        icon={Wallet}
                    />

                    <SummaryCard
                        title="Entrate annuali"
                        value={annual.income}
                        icon={TrendingUp}
                        variant="income"
                    />

                    <SummaryCard
                        title="Uscite annuali"
                        value={annual.expense}
                        icon={TrendingDown}
                        variant="expense"
                    />

                    <SummaryCard
                        title="Risparmio ipotetico"
                        value={annual.expectedSaving}
                        icon={PiggyBank}
                        variant="saving"
                    />
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-col gap-3 border-b border-slate-200 p-5 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-base font-semibold text-slate-900">
                                Andamento mensile
                            </h2>

                            <p className="text-sm text-slate-500">
                                Confronto tra valori ipotetici e valori reali
                            </p>
                        </div>

                        <div className="w-full max-w-xs">
                            <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                                <span>Obiettivo risparmio</span>
                                <span>{Math.round(savingProgress)}%</span>
                            </div>

                            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                <div
                                    className="h-full rounded-full bg-slate-900 transition-all"
                                    style={{ width: `${savingProgress}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[980px] table-fixed border-collapse">
                            <colgroup>
                                <col className="w-[160px]" />

                                {monthsWithSurplus.map((month) => (
                                    <col
                                        key={month.label}
                                        className="w-[72px]"
                                    />
                                ))}
                            </colgroup>

                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50">
                                    <th className="sticky left-0 z-10 bg-slate-50 px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                        Voce
                                    </th>

                                    {monthsWithSurplus.map((month) => (
                                        <th
                                            key={month.label}
                                            className="px-3 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-slate-500"
                                        >
                                            {month.shortLabel}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {rows.map((row) => {
                                    const rowCanBeEditable = isRowEditable(row.key);
                                    const rowIsEditable = editableRows[row.key];

                                    return (
                                        <tr
                                            key={row.key}
                                            ref={(element) => {
                                                if (rowCanBeEditable) {
                                                    rowRefs.current[row.key] = element;
                                                }
                                            }}
                                            className={`
                                                border-b border-slate-100 last:border-b-0
                                                hover:bg-slate-100/60
                                                ${row.rowClassName}
                                                ${row.separator ? "border-t-4 border-t-slate-200" : ""}
                                            `}
                                        >
                                            <td
                                                className={`
                                                    sticky left-0 z-10 px-3 py-3 text-xs font-semibold text-slate-700
                                                    ${row.rowClassName}
                                                `}
                                            >
                                                <div className="flex items-center justify-between gap-2">
                                                    <div className="flex min-w-0 flex-col leading-tight">
                                                        <span className="truncate">
                                                            {row.label}
                                                        </span>

                                                        {row.subtitle && (
                                                            <span className="mt-0.5 truncate text-[11px] font-normal italic text-slate-500">
                                                                {row.subtitle}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {rowCanBeEditable && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleToggleEditableRow(row.key)
                                                            }
                                                            className={`
                                                                inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition
                                                                ${
                                                                    rowIsEditable
                                                                        ? "border-slate-300 bg-slate-900 text-white hover:bg-slate-800"
                                                                        : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                                                }
                                                            `}
                                                            title={
                                                                rowIsEditable
                                                                    ? "Passa a sola lettura"
                                                                    : "Rendi editabile"
                                                            }
                                                        >
                                                            {rowIsEditable ? (
                                                                <Pencil size={13} />
                                                            ) : (
                                                                <Lock size={13} />
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                            </td>

                                            {monthsWithSurplus.map((month, monthIndex) => {
                                                const value = month[row.key];

                                                return (
                                                    <MoneyCell
                                                        key={`${month.label}-${row.key}`}
                                                        value={value}
                                                        variant={getCellVariant(row, value)}
                                                        isEditable={
                                                            rowCanBeEditable && rowIsEditable
                                                        }
                                                        onChange={(newValue) =>
                                                            handleMonthValueChange(
                                                                monthIndex,
                                                                row.key,
                                                                newValue
                                                            )
                                                        }
                                                        onKeyDown={(event) =>
                                                            handleRowInputKeyDown(
                                                                event,
                                                                row.key
                                                            )
                                                        }
                                                    />
                                                );
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm font-medium text-slate-500">
                            Saldo entrate / uscite
                        </p>

                        <p
                            className={`
                                mt-2 text-2xl font-semibold
                                ${balance >= 0 ? "text-emerald-700" : "text-red-700"}
                            `}
                        >
                            {formatCurrency(balance)}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm font-medium text-slate-500">
                            Fine anno ipotetico
                        </p>

                        <p className="mt-2 text-2xl font-semibold text-slate-900">
                            {formatCurrency(lastHypotheticalEndMonth)}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm font-medium text-slate-500">
                            Surplus annuale
                        </p>

                        <p
                            className={`
                                mt-2 text-2xl font-semibold
                                ${
                                    annualSurplusEndMonth === null
                                        ? "text-slate-400"
                                        : annualSurplusEndMonth >= 0
                                            ? "text-emerald-700"
                                            : "text-red-700"
                                }
                            `}
                        >
                            {annualSurplusEndMonth === null
                                ? "-"
                                : formatCurrency(annualSurplusEndMonth)}
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}