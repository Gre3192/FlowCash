import { useEffect, useRef, useState } from "react";
import {
    Wallet,
    TrendingUp,
    TrendingDown,
    PiggyBank,
    Pencil,
    Lock,
    ChevronDown,
} from "lucide-react";

import formatCurrency from "../utils/formatCurrency";
import { useGet } from "../hooks/useGet";
import { API_ENDPOINTS } from "../api/endpoint";

const EDITABLE_ROWS = [
    "hypothetical_start",
    "hypothetical_saving",
    "real_end",
];

const START_MONTH_SOURCE = {
    API: "api",
    CUSTOM: "custom",
    HYPOTHETICAL: "hypothetical",
    REAL: "real",
};

const SURPLUS_DESTINATION = {
    NONE: null,
    WALLET: "wallet",
    NEXT_MONTH: "nextMonth",
};

function sanitizeCurrencyInput(value) {
    if (value === null || value === undefined) return "";

    let sanitizedValue = String(value)
        .replace(/[^\d.,-]/g, "")
        .replace(/\s/g, "");

    const isNegative = sanitizedValue.startsWith("-");

    sanitizedValue = sanitizedValue.replace(/-/g, "");

    const firstSeparatorIndex = sanitizedValue.search(/[.,]/);

    if (firstSeparatorIndex === -1) {
        return `${isNegative ? "-" : ""}${sanitizedValue}`;
    }

    const integerPart = sanitizedValue.slice(0, firstSeparatorIndex);
    const separator = sanitizedValue[firstSeparatorIndex];
    const decimalPart = sanitizedValue
        .slice(firstSeparatorIndex + 1)
        .replace(/[.,]/g, "")
        .slice(0, 2);

    return `${isNegative ? "-" : ""}${integerPart}${separator}${decimalPart}`;
}

function normalizeNumberValue(value) {
    if (
        value === "" ||
        value === null ||
        value === undefined ||
        value === "-"
    ) {
        return null;
    }

    const normalizedValue = String(value).replace(",", ".");
    const numericValue = Number(normalizedValue);

    if (Number.isNaN(numericValue)) return null;

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

function toCurrencyString(value) {
    const numericValue = normalizeNumberValue(value);

    if (numericValue === null || numericValue === undefined) {
        return null;
    }

    return numericValue.toFixed(2);
}

function formatInputValue(value) {
    if (value === null || value === undefined) return "";
    return String(value);
}

function getSurplusDestination(month) {
    if (month?.surplus_carried_to_saving_wallet) {
        return SURPLUS_DESTINATION.WALLET;
    }

    if (month?.surplus_carried_to_next_month) {
        return SURPLUS_DESTINATION.NEXT_MONTH;
    }

    return SURPLUS_DESTINATION.NONE;
}

function normalizeMonths(months = []) {
    return months.map((month) => ({
        ...month,
        hypothetical_start: month?.hypothetical_start ?? "0.00",
        income_total: month?.income_total ?? "0.00",
        expense_total: month?.expense_total ?? "0.00",
        hypothetical_saving: month?.hypothetical_saving ?? "0.00",
        hypothetical_end: month?.hypothetical_end ?? "0.00",
        real_end: month?.real_end ?? null,
        surplus: month?.surplus ?? null,
        surplusDestination: getSurplusDestination(month),
        startMonthSource: START_MONTH_SOURCE.API,
    }));
}

function SummaryCard({ title, value, icon: Icon, variant = "default" }) {
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
                        {formatCurrency(normalizeNumberValue(value) ?? 0)}
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
    onFocus,
    walletIncluded = false,
    nextMonthIncluded = false,
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
                <div className="flex min-h-[24px] flex-col items-end justify-center gap-1">
                    <input
                        type="text"
                        inputMode="decimal"
                        value={formatInputValue(value)}
                        onFocus={onFocus}
                        onChange={(event) => onChange?.(event.target.value)}
                        onKeyDown={onKeyDown}
                        placeholder="-"
                        className={`
                            h-6 w-full min-w-0 rounded-md border border-slate-200 bg-white px-1.5 text-right text-xs font-medium
                            outline-none transition placeholder:text-slate-400
                            focus:border-slate-400 focus:ring-2 focus:ring-slate-200
                            ${variants[variant] || variants.default}
                        `}
                    />
                </div>
            </td>
        );
    }

    return (
        <td
            title={
                walletIncluded
                    ? "Surplus incluso nel portafoglio risparmio"
                    : nextMonthIncluded
                        ? "Surplus portato all'inizio del mese successivo"
                        : ""
            }
            className={`
                relative whitespace-nowrap px-3 py-3 text-right text-xs
                ${walletIncluded ? "bg-sky-50/70 ring-1 ring-inset ring-sky-200" : ""}
                ${nextMonthIncluded ? "bg-amber-50/70 ring-1 ring-inset ring-amber-200" : ""}
            `}
        >
            <span
                className={`
                    block leading-none
                    ${
                        strong || walletIncluded || nextMonthIncluded
                            ? "font-semibold"
                            : "font-medium"
                    }
                    ${
                        value === null || value === undefined || value === ""
                            ? "text-slate-400"
                            : variants[variant] || variants.default
                    }
                `}
            >
                {value === null || value === undefined || value === ""
                    ? "-"
                    : formatCurrency(normalizeNumberValue(value) ?? 0)}
            </span>

            {walletIncluded && (
                <Wallet
                    size={10}
                    className="pointer-events-none absolute bottom-1 right-3 text-sky-600"
                />
            )}

            {nextMonthIncluded && (
                <span className="pointer-events-none absolute bottom-1 right-3 text-[9px] font-bold text-amber-600">
                    +M
                </span>
            )}
        </td>
    );
}

export default function YearBalanceSummaryPage({ selectedYear = 2026 }) {
    const { data, loading, error } = useGet(
        API_ENDPOINTS.annualSummary({
            year: selectedYear,
        }),
        {
            delayMs: 0,
        }
    );

    const rowRefs = useRef({});
    const monthMenuRef = useRef(null);

    const [monthMenu, setMonthMenu] = useState({
        isOpen: false,
        monthIndex: null,
        top: 0,
        left: 0,
    });

    const [monthsData, setMonthsData] = useState([]);
    const [previousYearDecember, setPreviousYearDecember] = useState(null);
    const [runtimeRecalculationStartIndex, setRuntimeRecalculationStartIndex] =
        useState(null);

    const [activeInputCell, setActiveInputCell] = useState(null);

    const [editableRows, setEditableRows] = useState({
        hypothetical_start: false,
        hypothetical_saving: false,
        real_end: false,
    });

    useEffect(() => {
        if (!data?.months) return;

        setPreviousYearDecember(data.previous_year_december ?? null);
        setMonthsData(normalizeMonths(data.months));
        setRuntimeRecalculationStartIndex(null);
        setActiveInputCell(null);
    }, [data]);

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
                        setActiveInputCell(null);
                    }
                });

                return hasChanges ? nextEditableRows : prev;
            });
        }

        function handleClickOutsideMonthMenu(event) {
            if (!monthMenuRef.current) return;

            const clickedInsideMenu = monthMenuRef.current.contains(event.target);

            if (!clickedInsideMenu) {
                setMonthMenu((prev) => ({
                    ...prev,
                    isOpen: false,
                    monthIndex: null,
                }));
            }
        }

        document.addEventListener("mousedown", handleClickOutsideEditableRow);
        document.addEventListener("mousedown", handleClickOutsideMonthMenu);

        return () => {
            document.removeEventListener("mousedown", handleClickOutsideEditableRow);
            document.removeEventListener("mousedown", handleClickOutsideMonthMenu);
        };
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 px-4 py-6">
                <div className="mx-auto w-full max-w-7xl rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
                    Caricamento riepilogo annuale...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 px-4 py-6">
                <div className="mx-auto w-full max-w-7xl rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-sm">
                    Errore durante il caricamento del riepilogo annuale.
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen bg-slate-50 px-4 py-6">
                <div className="mx-auto w-full max-w-7xl rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
                    Nessun dato disponibile.
                </div>
            </div>
        );
    }

    const year = data.year;

    const computedMonths = monthsData.reduce((acc, month, index) => {
        const previousMonth =
            index === 0
                ? previousYearDecember
                : acc[index - 1];

        const incomeTotal = normalizeNumberValue(month.income_total) ?? 0;
        const expenseTotal = normalizeNumberValue(month.expense_total) ?? 0;
        const hypotheticalSaving =
            normalizeNumberValue(month.hypothetical_saving) ?? 0;

        let hypotheticalStart =
            normalizeNumberValue(month.hypothetical_start) ?? 0;

        const shouldRecalculateFromPrevious =
            runtimeRecalculationStartIndex !== null &&
            index > runtimeRecalculationStartIndex;

        if (previousMonth && shouldRecalculateFromPrevious) {
            if (month.startMonthSource === START_MONTH_SOURCE.REAL) {
                const previousRealEnd = normalizeNumberValue(previousMonth.real_end);

                hypotheticalStart =
                    previousRealEnd !== null && previousRealEnd !== undefined
                        ? previousRealEnd
                        : normalizeNumberValue(previousMonth.hypothetical_end) ?? 0;
            } else if (month.startMonthSource === START_MONTH_SOURCE.CUSTOM) {
                hypotheticalStart =
                    normalizeNumberValue(month.hypothetical_start) ?? 0;
            } else {
                hypotheticalStart =
                    normalizeNumberValue(previousMonth.hypothetical_end) ?? 0;
            }

            if (
                previousMonth.surplusDestination ===
                SURPLUS_DESTINATION.NEXT_MONTH
            ) {
                hypotheticalStart +=
                    normalizeNumberValue(previousMonth.surplus) ?? 0;
            }
        }

        if (
            previousMonth &&
            !shouldRecalculateFromPrevious &&
            month.startMonthSource === START_MONTH_SOURCE.HYPOTHETICAL
        ) {
            hypotheticalStart =
                normalizeNumberValue(previousMonth.hypothetical_end) ?? 0;
        }

        if (
            previousMonth &&
            !shouldRecalculateFromPrevious &&
            month.startMonthSource === START_MONTH_SOURCE.REAL
        ) {
            const previousRealEnd = normalizeNumberValue(previousMonth.real_end);

            hypotheticalStart =
                previousRealEnd !== null && previousRealEnd !== undefined
                    ? previousRealEnd
                    : normalizeNumberValue(previousMonth.hypothetical_end) ?? 0;
        }

        const hypotheticalEnd =
            hypotheticalStart + incomeTotal - expenseTotal - hypotheticalSaving;

        const realEnd = normalizeNumberValue(month.real_end);

        const surplus =
            realEnd !== null && realEnd !== undefined
                ? realEnd - hypotheticalEnd
                : null;

        acc.push({
            ...month,
            hypothetical_start: toCurrencyString(hypotheticalStart),
            hypothetical_end: toCurrencyString(hypotheticalEnd),
            surplus: surplus === null ? null : toCurrencyString(surplus),
        });

        return acc;
    }, []);

    const months = computedMonths;

    const incomeAnnualTotal = months.reduce(
        (total, month) => total + (normalizeNumberValue(month.income_total) ?? 0),
        0
    );

    const expenseAnnualTotal = months.reduce(
        (total, month) => total + (normalizeNumberValue(month.expense_total) ?? 0),
        0
    );

    const hypotheticalSavingAnnualTotal = months.reduce(
        (total, month) =>
            total + (normalizeNumberValue(month.hypothetical_saving) ?? 0),
        0
    );

    const totalSurplusToWallet = months.reduce((total, month) => {
        if (month.surplusDestination !== SURPLUS_DESTINATION.WALLET) {
            return total;
        }

        return total + (normalizeNumberValue(month.surplus) ?? 0);
    }, 0);

    const savingWallet =
        (normalizeNumberValue(data.saving_wallet_total) ?? 0) + totalSurplusToWallet;

    const lastHypotheticalEnd =
        months[months.length - 1]?.hypothetical_end ?? "0.00";

    const lastRealEnd = months[months.length - 1]?.real_end ?? null;

    const annualSurplus =
        lastRealEnd !== null && lastRealEnd !== undefined
            ? (normalizeNumberValue(lastRealEnd) ?? 0) -
              (normalizeNumberValue(lastHypotheticalEnd) ?? 0)
            : null;

    const balance = incomeAnnualTotal - expenseAnnualTotal;

    const savingProgress =
        hypotheticalSavingAnnualTotal > 0
            ? Math.min((balance / hypotheticalSavingAnnualTotal) * 100, 100)
            : 0;

    const rows = [
        {
            key: "hypothetical_start",
            label: "Inizio mese ipotetico",
            variant: "default",
            rowClassName: "bg-white",
        },
        {
            key: "income_total",
            label: "Entrate",
            variant: "income",
            rowClassName: "bg-emerald-50/60",
        },
        {
            key: "expense_total",
            label: "Uscite",
            variant: "expense",
            rowClassName: "bg-red-50/60",
        },
        {
            key: "hypothetical_saving",
            label: "Risparmio ipotetico",
            variant: "saving",
            rowClassName: "bg-sky-50/60",
        },
        {
            key: "hypothetical_end",
            label: "Fine mese ipotetico",
            variant: "total",
            rowClassName: "bg-slate-50",
        },
        {
            key: "real_end",
            label: "Fine mese reale",
            variant: "real",
            rowClassName: "bg-indigo-50/60",
            separator: true,
        },
        {
            key: "surplus",
            label: "Surplus fine mese",
            subtitle: "(reale - ipotetico)",
            variant: "surplus",
            rowClassName: "bg-fuchsia-50/60",
        },
    ];

    function isRowEditable(rowKey) {
        return EDITABLE_ROWS.includes(rowKey);
    }

    function getPreviousMonthByIndex(monthIndex) {
        if (monthIndex === 0) {
            return previousYearDecember;
        }

        return months[monthIndex - 1];
    }

    function getPreviousHypotheticalEnd(monthIndex) {
        const previousMonth = getPreviousMonthByIndex(monthIndex);
        return previousMonth?.hypothetical_end ?? null;
    }

    function getPreviousRealEnd(monthIndex) {
        const previousMonth = getPreviousMonthByIndex(monthIndex);
        return previousMonth?.real_end ?? null;
    }

    function getStartMonthVariant(monthIndex, month) {
        const previousHypotheticalEnd = getPreviousHypotheticalEnd(monthIndex);

        if (
            areCurrencyValuesEqual(
                month.hypothetical_start,
                previousHypotheticalEnd
            )
        ) {
            return "total";
        }

        const previousRealEnd = getPreviousRealEnd(monthIndex);

        if (
            previousRealEnd !== null &&
            previousRealEnd !== undefined &&
            areCurrencyValuesEqual(month.hypothetical_start, previousRealEnd)
        ) {
            return "real";
        }

        return "custom";
    }

    function getCellVariant(row, value, month, monthIndex) {
        if (row.key === "hypothetical_start") {
            return getStartMonthVariant(monthIndex, month);
        }

        if (row.key !== "surplus") {
            return row.variant;
        }

        const numericValue = normalizeNumberValue(value);

        if (numericValue === null) {
            return "muted";
        }

        return numericValue >= 0 ? "surplusPositive" : "surplusNegative";
    }

    function handleToggleEditableRow(rowKey) {
        setEditableRows((prev) => ({
            ...prev,
            [rowKey]: !prev[rowKey],
        }));

        setActiveInputCell(null);
    }

    function handleRowInputKeyDown(event, rowKey) {
        if (event.key !== "Enter") return;

        event.preventDefault();

        setEditableRows((prev) => ({
            ...prev,
            [rowKey]: false,
        }));

        setActiveInputCell(null);
        event.currentTarget.blur();
    }

    function updateRuntimeStartIndex(monthIndex) {
        setRuntimeRecalculationStartIndex((prev) => {
            if (prev === null) return monthIndex;
            return Math.min(prev, monthIndex);
        });
    }

    function handleMonthValueChange(monthIndex, fieldKey, value) {
        const sanitizedValue = sanitizeCurrencyInput(value);

        updateRuntimeStartIndex(monthIndex);

        setMonthsData((prev) =>
            prev.map((month, index) => {
                if (index !== monthIndex) return month;

                if (fieldKey === "hypothetical_start") {
                    return {
                        ...month,
                        hypothetical_start: sanitizedValue,
                        startMonthSource: START_MONTH_SOURCE.CUSTOM,
                    };
                }

                return {
                    ...month,
                    [fieldKey]: sanitizedValue,
                };
            })
        );
    }

    function handleOpenMonthMenu(event, monthIndex) {
        event.stopPropagation();

        const rect = event.currentTarget.getBoundingClientRect();

        setMonthMenu((prev) => ({
            isOpen: !(prev.isOpen && prev.monthIndex === monthIndex),
            monthIndex,
            top: rect.bottom + 6,
            left: rect.right - 200,
        }));
    }

    function handleUsePreviousEndAsStart(monthIndex, source) {
        const previousValue =
            source === START_MONTH_SOURCE.REAL
                ? getPreviousRealEnd(monthIndex)
                : getPreviousHypotheticalEnd(monthIndex);

        const nextStartValue = normalizeNumberValue(previousValue);

        if (nextStartValue === null || nextStartValue === undefined) return;

        updateRuntimeStartIndex(monthIndex);

        setMonthsData((prev) =>
            prev.map((month, index) => {
                if (index !== monthIndex) return month;

                return {
                    ...month,
                    hypothetical_start: nextStartValue.toFixed(2),
                    startMonthSource: source,
                };
            })
        );

        setMonthMenu((prev) => ({
            ...prev,
            isOpen: false,
            monthIndex: null,
        }));
    }

    function handleToggleSurplusDestination(monthIndex, destination) {
        const targetMonth = months[monthIndex];

        if (!targetMonth) return;

        const surplusValue = normalizeNumberValue(targetMonth.surplus);

        if (
            surplusValue === null ||
            surplusValue === undefined ||
            surplusValue === 0
        ) {
            return;
        }

        updateRuntimeStartIndex(monthIndex);

        const isAlreadySelected = targetMonth.surplusDestination === destination;

        setMonthsData((prev) =>
            prev.map((month, index) => {
                if (index !== monthIndex) return month;

                const nextDestination = isAlreadySelected
                    ? SURPLUS_DESTINATION.NONE
                    : destination;

                return {
                    ...month,
                    surplusDestination: nextDestination,
                    surplus_carried_to_saving_wallet:
                        nextDestination === SURPLUS_DESTINATION.WALLET,
                    surplus_carried_to_next_month:
                        nextDestination === SURPLUS_DESTINATION.NEXT_MONTH,
                };
            })
        );

        setMonthMenu((prev) => ({
            ...prev,
            isOpen: false,
            monthIndex: null,
        }));
    }

    function getMonthMenuOptionState(monthIndex, source) {
        const currentMonth = months[monthIndex];

        if (!currentMonth) {
            return {
                value: null,
                isActive: false,
                disabled: true,
            };
        }

        const value =
            source === START_MONTH_SOURCE.REAL
                ? getPreviousRealEnd(monthIndex)
                : getPreviousHypotheticalEnd(monthIndex);

        const normalizedValue = normalizeNumberValue(value);

        return {
            value,
            isActive: areCurrencyValuesEqual(
                currentMonth.hypothetical_start,
                value
            ),
            disabled: normalizedValue === null || normalizedValue === undefined,
        };
    }

    function getSurplusMenuOptionState(monthIndex) {
        const targetMonth = months[monthIndex];
        const surplusValue = normalizeNumberValue(targetMonth?.surplus);

        const hasSurplus =
            surplusValue !== null &&
            surplusValue !== undefined &&
            surplusValue !== 0;

        return {
            value: targetMonth?.surplus ?? null,
            walletActive:
                targetMonth?.surplusDestination === SURPLUS_DESTINATION.WALLET,
            nextMonthActive:
                targetMonth?.surplusDestination === SURPLUS_DESTINATION.NEXT_MONTH,
            walletDisabled: !hasSurplus,
            nextMonthDisabled: !hasSurplus || monthIndex >= months.length - 1,
        };
    }

    const openedMonth =
        monthMenu.isOpen && monthMenu.monthIndex !== null
            ? months[monthMenu.monthIndex]
            : null;

    const hypotheticalOption = monthMenu.isOpen
        ? getMonthMenuOptionState(
              monthMenu.monthIndex,
              START_MONTH_SOURCE.HYPOTHETICAL
          )
        : null;

    const realOption = monthMenu.isOpen
        ? getMonthMenuOptionState(monthMenu.monthIndex, START_MONTH_SOURCE.REAL)
        : null;

    const surplusOption = monthMenu.isOpen
        ? getSurplusMenuOptionState(monthMenu.monthIndex)
        : null;

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-6">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
                <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <SummaryCard
                        title="Portafoglio risparmio"
                        value={savingWallet}
                        icon={Wallet}
                    />

                    <SummaryCard
                        title="Entrate annuali"
                        value={incomeAnnualTotal}
                        icon={TrendingUp}
                        variant="income"
                    />

                    <SummaryCard
                        title="Uscite annuali"
                        value={expenseAnnualTotal}
                        icon={TrendingDown}
                        variant="expense"
                    />

                    <SummaryCard
                        title="Risparmio ipotetico"
                        value={hypotheticalSavingAnnualTotal}
                        icon={PiggyBank}
                        variant="saving"
                    />
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-col gap-3 border-b border-slate-200 p-5 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-base font-semibold text-slate-900">
                                Andamento {year}
                            </h2>

                            <p className="text-sm text-slate-500">
                                Confronto tra valori ipotetici e valori reali
                            </p>
                        </div>

                        <div className="w-full max-w-xs">
                            <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                                <span>Risparmio ipotetico</span>
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

                                {months.map((month) => (
                                    <col
                                        key={month.id ?? month.label}
                                        className="w-[72px]"
                                    />
                                ))}
                            </colgroup>

                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50">
                                    <th className="sticky left-0 z-10 bg-slate-50 px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                        Voce
                                    </th>

                                    {months.map((month, monthIndex) => {
                                        const isOpen =
                                            monthMenu.isOpen &&
                                            monthMenu.monthIndex === monthIndex;

                                        return (
                                            <th
                                                key={month.id ?? month.label}
                                                className="px-2 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-slate-500"
                                            >
                                                <button
                                                    type="button"
                                                    onClick={(event) =>
                                                        handleOpenMonthMenu(
                                                            event,
                                                            monthIndex
                                                        )
                                                    }
                                                    className={`
                                                        ml-auto inline-flex items-center justify-end gap-1 rounded-lg border px-2 py-1 text-[11px] font-semibold uppercase tracking-wide transition
                                                        ${
                                                            isOpen
                                                                ? "border-slate-300 bg-white text-slate-900 shadow-sm"
                                                                : "border-transparent text-slate-500 hover:border-slate-200 hover:bg-white hover:text-slate-900"
                                                        }
                                                    `}
                                                >
                                                    <span>{month.label}</span>

                                                    <ChevronDown
                                                        size={12}
                                                        className={`
                                                            transition
                                                            ${isOpen ? "rotate-180" : ""}
                                                        `}
                                                    />
                                                </button>
                                            </th>
                                        );
                                    })}
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
                                                                handleToggleEditableRow(
                                                                    row.key
                                                                )
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

                                            {months.map((month, monthIndex) => {
                                                const isCurrentInputCell =
                                                    activeInputCell?.rowKey === row.key &&
                                                    activeInputCell?.monthIndex === monthIndex;

                                                const displayValue =
                                                    rowCanBeEditable &&
                                                    rowIsEditable &&
                                                    isCurrentInputCell
                                                        ? monthsData[monthIndex]?.[row.key]
                                                        : month[row.key];

                                                const walletIncluded =
                                                    row.key === "surplus" &&
                                                    month.surplusDestination ===
                                                        SURPLUS_DESTINATION.WALLET;

                                                const nextMonthIncluded =
                                                    row.key === "surplus" &&
                                                    month.surplusDestination ===
                                                        SURPLUS_DESTINATION.NEXT_MONTH;

                                                return (
                                                    <MoneyCell
                                                        key={`${month.id ?? month.label}-${row.key}`}
                                                        value={displayValue}
                                                        variant={getCellVariant(
                                                            row,
                                                            month[row.key],
                                                            month,
                                                            monthIndex
                                                        )}
                                                        isEditable={
                                                            rowCanBeEditable &&
                                                            rowIsEditable
                                                        }
                                                        onFocus={() =>
                                                            setActiveInputCell({
                                                                rowKey: row.key,
                                                                monthIndex,
                                                            })
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
                                                        walletIncluded={walletIncluded}
                                                        nextMonthIncluded={nextMonthIncluded}
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
            </div>

            {monthMenu.isOpen && openedMonth && (
                <div
                    ref={monthMenuRef}
                    className="fixed z-50 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl"
                    style={{
                        top: `${monthMenu.top}px`,
                        left: `${Math.max(monthMenu.left, 8)}px`,
                    }}
                >
                    <div className="border-b border-slate-100 px-2 pb-2">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                            Opzioni {openedMonth.label}
                        </p>

                        <p className="mt-0.5 text-[11px] text-slate-400">
                            Inizio mese e surplus
                        </p>
                    </div>

                    <div className="mt-2 flex flex-col gap-1">
                        <button
                            type="button"
                            disabled={hypotheticalOption?.disabled}
                            onClick={() =>
                                handleUsePreviousEndAsStart(
                                    monthMenu.monthIndex,
                                    START_MONTH_SOURCE.HYPOTHETICAL
                                )
                            }
                            className={`
                                flex w-full flex-col rounded-lg border px-2 py-2 text-left transition
                                ${
                                    hypotheticalOption?.disabled
                                        ? "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300"
                                        : hypotheticalOption?.isActive
                                            ? "border-slate-300 bg-slate-100 text-slate-900"
                                            : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50"
                                }
                            `}
                        >
                            <span className="text-[11px] font-medium">
                                Inizio da fine ipotetico
                            </span>

                            <span className="mt-0.5 text-xs font-semibold">
                                {hypotheticalOption?.value === null ||
                                hypotheticalOption?.value === undefined
                                    ? "-"
                                    : formatCurrency(
                                          normalizeNumberValue(
                                              hypotheticalOption.value
                                          ) ?? 0
                                      )}
                            </span>
                        </button>

                        <button
                            type="button"
                            disabled={realOption?.disabled}
                            onClick={() =>
                                handleUsePreviousEndAsStart(
                                    monthMenu.monthIndex,
                                    START_MONTH_SOURCE.REAL
                                )
                            }
                            className={`
                                flex w-full flex-col rounded-lg border px-2 py-2 text-left transition
                                ${
                                    realOption?.disabled
                                        ? "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300"
                                        : realOption?.isActive
                                            ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                                            : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50"
                                }
                            `}
                        >
                            <span className="text-[11px] font-medium">
                                Inizio da fine reale
                            </span>

                            <span className="mt-0.5 text-xs font-semibold">
                                {realOption?.value === null ||
                                realOption?.value === undefined
                                    ? "-"
                                    : formatCurrency(
                                          normalizeNumberValue(realOption.value) ?? 0
                                      )}
                            </span>
                        </button>

                        <div className="my-1 border-t border-slate-100" />

                        <button
                            type="button"
                            disabled={surplusOption?.walletDisabled}
                            onClick={() =>
                                handleToggleSurplusDestination(
                                    monthMenu.monthIndex,
                                    SURPLUS_DESTINATION.WALLET
                                )
                            }
                            className={`
                                flex w-full flex-col rounded-lg border px-2 py-2 text-left transition
                                ${
                                    surplusOption?.walletDisabled
                                        ? "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300"
                                        : surplusOption?.walletActive
                                            ? "border-sky-200 bg-sky-50 text-sky-700"
                                            : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50"
                                }
                            `}
                        >
                            <span className="text-[11px] font-medium">
                                {surplusOption?.walletActive
                                    ? "Rimuovi dal portafoglio"
                                    : "Aggiungi al portafoglio"}
                            </span>

                            <span className="mt-0.5 text-xs font-semibold">
                                {surplusOption?.value === null ||
                                surplusOption?.value === undefined
                                    ? "-"
                                    : formatCurrency(
                                          normalizeNumberValue(
                                              surplusOption.value
                                          ) ?? 0
                                      )}
                            </span>
                        </button>

                        <button
                            type="button"
                            disabled={surplusOption?.nextMonthDisabled}
                            onClick={() =>
                                handleToggleSurplusDestination(
                                    monthMenu.monthIndex,
                                    SURPLUS_DESTINATION.NEXT_MONTH
                                )
                            }
                            className={`
                                flex w-full flex-col rounded-lg border px-2 py-2 text-left transition
                                ${
                                    surplusOption?.nextMonthDisabled
                                        ? "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300"
                                        : surplusOption?.nextMonthActive
                                            ? "border-amber-200 bg-amber-50 text-amber-700"
                                            : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50"
                                }
                            `}
                        >
                            <span className="text-[11px] font-medium">
                                {surplusOption?.nextMonthActive
                                    ? "Rimuovi dal mese successivo"
                                    : "Porta al mese successivo"}
                            </span>

                            <span className="mt-0.5 text-xs font-semibold">
                                {surplusOption?.value === null ||
                                surplusOption?.value === undefined
                                    ? "-"
                                    : formatCurrency(
                                          normalizeNumberValue(
                                              surplusOption.value
                                          ) ?? 0
                                      )}
                            </span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}