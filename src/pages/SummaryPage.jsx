import { useEffect, useRef, useState } from "react";
import {
    Wallet,
    TrendingUp,
    TrendingDown,
    PiggyBank,
    CalendarDays,
    Pencil,
    Lock,
    ArrowUpRight,
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
            surplusToWallet: 0,
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
            surplusToWallet: 0,
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
            surplusToWallet: 0,
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
            surplusToWallet: 0,
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
            surplusToWallet: 0,
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
            surplusToWallet: 0,
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
            surplusToWallet: 0,
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
            surplusToWallet: 0,
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
            surplusToWallet: 0,
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
            surplusToWallet: 0,
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
            surplusToWallet: 0,
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
            surplusToWallet: 0,
        },
    ],
};

const EDITABLE_ROWS = ["startMonth", "expectedSaving", "realEndMonth"];

const START_MONTH_SOURCE = {
    HYPOTHETICAL: "hypothetical",
    REAL: "real",
    CUSTOM: "custom",
};

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

function normalizeCurrencyNumber(value) {
    const numericValue = normalizeNumberValue(value);

    if (numericValue === null || numericValue === undefined) {
        return null;
    }

    return Math.round(numericValue * 100);
}

function areCurrencyValuesEqual(firstValue, secondValue) {
    const firstNormalizedValue = normalizeCurrencyNumber(firstValue);
    const secondNormalizedValue = normalizeCurrencyNumber(secondValue);

    if (firstNormalizedValue === null || secondNormalizedValue === null) {
        return false;
    }

    return firstNormalizedValue === secondNormalizedValue;
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

function ActionButton({ actionButton }) {
    const isDisabled = !actionButton || actionButton.disabled;

    return (
        <button
            type="button"
            disabled={isDisabled}
            onClick={actionButton?.onClick}
            title={actionButton?.title}
            className={`
                flex h-7 w-full items-center justify-center gap-1 rounded-md
                border px-1 text-[10px] font-medium transition sm:h-5
                ${
                    isDisabled
                        ? "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300"
                        : actionButton?.active
                            ? "border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100"
                            : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }
            `}
        >
            <span>{actionButton?.label ?? "-"}</span>
            <ArrowUpRight size={11} />
        </button>
    );
}

function MoneyCell({
    value,
    variant = "default",
    strong = false,
    isEditable = false,
    onChange,
    onKeyDown,
    actionButton = null,
    reserveActionSpace = false,
}) {
    const variants = {
        default: "text-slate-700",
        income: "text-emerald-700",
        expense: "text-red-700",
        saving: "text-sky-700",
        total: "text-slate-900",
        real: "text-indigo-700",
        custom: "text-amber-700",
        surplusPositive: "text-emerald-700",
        surplusNegative: "text-red-700",
        muted: "text-slate-400",
    };

    if (isEditable) {
        return (
            <td className="whitespace-nowrap px-3 py-2 text-right text-xs font-medium">
                <div
                    className={`
                        flex flex-col items-end justify-center gap-1
                        ${reserveActionSpace ? "min-h-[44px] sm:min-h-[44px]" : "min-h-[24px]"}
                    `}
                >
                    <input
                        type="text"
                        inputMode="decimal"
                        value={formatInputValue(value)}
                        onChange={(event) => onChange?.(event.target.value)}
                        onKeyDown={onKeyDown}
                        placeholder="-"
                        className={`
                            h-6 w-full min-w-0 rounded-md border border-slate-200 bg-white px-1.5 text-right text-xs font-medium
                            outline-none transition
                            placeholder:text-slate-400
                            focus:border-slate-400 focus:ring-2 focus:ring-slate-200
                            ${variants[variant] || variants.default}
                        `}
                    />

                    {reserveActionSpace && (
                        <ActionButton actionButton={actionButton} />
                    )}
                </div>
            </td>
        );
    }

    if (value === null || value === undefined || value === "") {
        return (
            <td className="whitespace-nowrap px-3 py-3 text-right text-xs font-medium text-slate-400">
                <div
                    className={`
                        flex flex-col items-end justify-center gap-1
                        ${reserveActionSpace ? "min-h-[44px] sm:min-h-[44px]" : "min-h-[16px]"}
                    `}
                >
                    <span>-</span>

                    {reserveActionSpace && (
                        <ActionButton actionButton={actionButton} />
                    )}
                </div>
            </td>
        );
    }

    return (
        <td className="whitespace-nowrap px-3 py-3 text-right text-xs">
            <div
                className={`
                    flex flex-col items-end justify-center gap-1
                    ${reserveActionSpace ? "min-h-[44px] sm:min-h-[44px]" : "min-h-[16px]"}
                `}
            >
                <span
                    className={`
                        ${strong ? "font-semibold" : "font-medium"}
                        ${variants[variant] || variants.default}
                    `}
                >
                    {formatCurrency(value)}
                </span>

                {reserveActionSpace && (
                    <ActionButton actionButton={actionButton} />
                )}
            </div>
        </td>
    );
}

export default function YearBalanceSummaryPage() {
    const { year, annual } = summaryData;

    const rowRefs = useRef({});

    const [monthsData, setMonthsData] = useState(() =>
        summaryData.months.map((month, index) => ({
            ...month,
            startMonthSource:
                index === 0
                    ? START_MONTH_SOURCE.CUSTOM
                    : START_MONTH_SOURCE.HYPOTHETICAL,
        }))
    );

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

    const monthsWithSurplus = monthsData.reduce((computedMonths, month, index) => {
        const previousMonth = computedMonths[index - 1];

        const income = normalizeNumberValue(month.income) ?? 0;
        const expense = normalizeNumberValue(month.expense) ?? 0;
        const expectedSaving = normalizeNumberValue(month.expectedSaving) ?? 0;
        const surplusToWallet = normalizeNumberValue(month.surplusToWallet) ?? 0;

        let startMonthSource = month.startMonthSource;
        let startMonth = normalizeNumberValue(month.startMonth) ?? 0;

        if (index > 0) {
            const previousHypotheticalEndMonth =
                normalizeNumberValue(previousMonth?.endMonth) ?? 0;

            const previousRealEndMonth =
                normalizeNumberValue(previousMonth?.realEndMonth);

            if (startMonthSource === START_MONTH_SOURCE.REAL) {
                if (previousRealEndMonth !== null && previousRealEndMonth !== undefined) {
                    startMonth = previousRealEndMonth;
                } else {
                    startMonth = previousHypotheticalEndMonth;
                    startMonthSource = START_MONTH_SOURCE.HYPOTHETICAL;
                }
            }

            if (startMonthSource === START_MONTH_SOURCE.HYPOTHETICAL) {
                startMonth = previousHypotheticalEndMonth;
            }

            if (startMonthSource === START_MONTH_SOURCE.CUSTOM) {
                startMonth = normalizeNumberValue(month.startMonth) ?? 0;
            }
        }

        if (index === 0) {
            startMonthSource = START_MONTH_SOURCE.CUSTOM;
        }

        const endMonth = startMonth + income - expense - expectedSaving;

        const realEndMonth = normalizeNumberValue(month.realEndMonth);

        const surplusEndMonth =
            realEndMonth !== null && realEndMonth !== undefined
                ? realEndMonth - endMonth
                : null;

        computedMonths.push({
            ...month,
            startMonth,
            startMonthSource,
            expectedSaving,
            endMonth,
            realEndMonth,
            surplusEndMonth,
            surplusToWallet,
        });

        return computedMonths;
    }, []);

    const totalSurplusToWallet = monthsWithSurplus.reduce(
        (total, month) => total + (normalizeNumberValue(month.surplusToWallet) ?? 0),
        0
    );

    const savingWallet = summaryData.savingWallet + totalSurplusToWallet;

    const lastHypotheticalEndMonth =
        monthsWithSurplus[monthsWithSurplus.length - 1]?.endMonth ?? 0;

    const lastRealEndMonth =
        monthsWithSurplus[monthsWithSurplus.length - 1]?.realEndMonth ?? null;

    const annualSurplusEndMonth =
        lastRealEndMonth !== null && lastRealEndMonth !== undefined
            ? normalizeNumberValue(lastRealEndMonth) - lastHypotheticalEndMonth
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
            reserveActionSpace: true,
        },
        {
            key: "realEndMonth",
            label: "Fine mese reale",
            variant: "real",
            rowClassName: "bg-indigo-50/60",
            separator: true,
            reserveActionSpace: true,
        },
        {
            key: "surplusEndMonth",
            label: "Surplus fine mese",
            subtitle: "(reale - ipotetico)",
            variant: "surplus",
            rowClassName: "bg-fuchsia-50/60",
            reserveActionSpace: true,
        },
    ];

    function getStartMonthVariant(monthIndex, month) {
        if (monthIndex === 0) {
            return "custom";
        }

        const previousMonth = monthsWithSurplus[monthIndex - 1];

        const isSameAsPreviousHypotheticalEnd = areCurrencyValuesEqual(
            month.startMonth,
            previousMonth?.endMonth
        );

        if (isSameAsPreviousHypotheticalEnd) {
            return "total";
        }

        const isSameAsPreviousRealEnd =
            previousMonth?.realEndMonth !== null &&
            previousMonth?.realEndMonth !== undefined &&
            areCurrencyValuesEqual(month.startMonth, previousMonth.realEndMonth);

        if (isSameAsPreviousRealEnd) {
            return "real";
        }

        return "custom";
    }

    function getCellVariant(row, value, month, monthIndex) {
        if (row.key === "startMonth") {
            return getStartMonthVariant(monthIndex, month);
        }

        if (row.key !== "surplusEndMonth") {
            return row.variant;
        }

        if (value === null || value === undefined) {
            return "muted";
        }

        return value >= 0 ? "surplusPositive" : "surplusNegative";
    }

    function getNextStartMonthStatus(monthIndex) {
        const currentMonth = monthsWithSurplus[monthIndex];
        const nextMonth = monthsWithSurplus[monthIndex + 1];

        if (!currentMonth || !nextMonth) {
            return {
                hasNextMonth: false,
                matchesHypothetical: false,
                matchesReal: false,
                hasRealEndMonth: false,
            };
        }

        const hasRealEndMonth =
            currentMonth.realEndMonth !== null &&
            currentMonth.realEndMonth !== undefined &&
            currentMonth.realEndMonth !== "";

        const matchesHypothetical = areCurrencyValuesEqual(
            nextMonth.startMonth,
            currentMonth.endMonth
        );

        const matchesReal =
            hasRealEndMonth &&
            areCurrencyValuesEqual(nextMonth.startMonth, currentMonth.realEndMonth);

        return {
            hasNextMonth: true,
            matchesHypothetical,
            matchesReal,
            hasRealEndMonth,
        };
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

                if (fieldKey === "startMonth") {
                    return {
                        ...month,
                        startMonth: value,
                        startMonthSource: START_MONTH_SOURCE.CUSTOM,
                    };
                }

                return {
                    ...month,
                    [fieldKey]: value,
                };
            })
        );
    }

    function handleUseEndAsNextStart(monthIndex, source) {
        const currentMonth = monthsWithSurplus[monthIndex];
        const nextMonth = monthsWithSurplus[monthIndex + 1];

        if (!currentMonth || !nextMonth) return;

        const nextStartValue =
            source === START_MONTH_SOURCE.REAL
                ? normalizeNumberValue(currentMonth.realEndMonth)
                : normalizeNumberValue(currentMonth.endMonth);

        if (nextStartValue === null || nextStartValue === undefined) return;

        setMonthsData((prev) =>
            prev.map((month, index) => {
                if (index !== monthIndex + 1) {
                    return month;
                }

                return {
                    ...month,
                    startMonth: nextStartValue,
                    startMonthSource: source,
                };
            })
        );
    }

    function handleToggleSurplusToWallet(monthIndex) {
        const targetMonth = monthsWithSurplus[monthIndex];

        if (!targetMonth) return;

        const alreadyMoved = normalizeNumberValue(targetMonth.surplusToWallet) !== 0;

        if (alreadyMoved) {
            setMonthsData((prev) =>
                prev.map((month, index) => {
                    if (index !== monthIndex) {
                        return month;
                    }

                    return {
                        ...month,
                        surplusToWallet: 0,
                    };
                })
            );

            return;
        }

        const surplusValue = normalizeNumberValue(targetMonth.surplusEndMonth);

        if (surplusValue === null || surplusValue === undefined || surplusValue === 0) {
            return;
        }

        setMonthsData((prev) =>
            prev.map((month, index) => {
                if (index !== monthIndex) {
                    return month;
                }

                return {
                    ...month,
                    surplusToWallet: surplusValue,
                };
            })
        );
    }

    function getEndMonthActionButton(row, value, monthIndex) {
        const {
            hasNextMonth,
            matchesHypothetical,
            matchesReal,
            hasRealEndMonth,
        } = getNextStartMonthStatus(monthIndex);

        const nextMonth = monthsWithSurplus[monthIndex + 1];

        if (row.key === "endMonth") {
            const isDisabled = !hasNextMonth || matchesHypothetical;

            return {
                label: nextMonth?.shortLabel ?? "-",
                title: nextMonth
                    ? `Usa come inizio di ${nextMonth.label}`
                    : "Nessun mese successivo",
                disabled: isDisabled,
                onClick: () =>
                    handleUseEndAsNextStart(
                        monthIndex,
                        START_MONTH_SOURCE.HYPOTHETICAL
                    ),
            };
        }

        if (row.key === "realEndMonth") {
            const isDisabled = !hasNextMonth || !hasRealEndMonth || matchesReal;

            return {
                label: nextMonth?.shortLabel ?? "-",
                title: nextMonth
                    ? `Usa come inizio di ${nextMonth.label}`
                    : "Nessun mese successivo",
                disabled: isDisabled,
                onClick: () =>
                    handleUseEndAsNextStart(
                        monthIndex,
                        START_MONTH_SOURCE.REAL
                    ),
            };
        }

        if (row.key === "surplusEndMonth") {
            const targetMonth = monthsWithSurplus[monthIndex];
            const surplusValue = normalizeNumberValue(targetMonth?.surplusEndMonth);
            const isMoved = normalizeNumberValue(targetMonth?.surplusToWallet) !== 0;

            return {
                label: "PORT",
                title: isMoved
                    ? "Rimuovi dal portafoglio risparmio"
                    : "Sposta nel portafoglio risparmio",
                active: isMoved,
                disabled:
                    !isMoved &&
                    (surplusValue === null ||
                        surplusValue === undefined ||
                        surplusValue === 0),
                onClick: () => handleToggleSurplusToWallet(monthIndex),
            };
        }

        return null;
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
                                                const displayValue =
                                                    rowCanBeEditable && rowIsEditable
                                                        ? monthsData[monthIndex]?.[row.key]
                                                        : month[row.key];

                                                return (
                                                    <MoneyCell
                                                        key={`${month.label}-${row.key}`}
                                                        value={displayValue}
                                                        variant={getCellVariant(
                                                            row,
                                                            month[row.key],
                                                            month,
                                                            monthIndex
                                                        )}
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
                                                        actionButton={getEndMonthActionButton(
                                                            row,
                                                            month[row.key],
                                                            monthIndex
                                                        )}
                                                        reserveActionSpace={row.reserveActionSpace}
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