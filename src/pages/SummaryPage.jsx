import { useEffect, useMemo, useRef, useState } from "react";
import { Wallet, TrendingUp, TrendingDown, PiggyBank, Pencil, Lock, ChevronDown } from "lucide-react";
import formatCurrency from "../utils/formatCurrency";
import { useGet } from "../hooks/useGet";
import { API_ENDPOINTS } from "../api/endpoint";
import SummaryTable from "../components/SummaryTable/SummaryTable";

const START_SOURCE = {
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

const EDITABLE_ROWS = [
    "hypothetical_start",
    "hypothetical_saving",
    "real_end"
];

const ROWS = [
    {
        key: "hypothetical_start",
        label: "Inizio mese ipotetico",
        variant: "default",
        className: "bg-white",
    },
    {
        key: "income_total",
        label: "Entrate",
        variant: "income",
        className: "bg-emerald-50/60",
    },
    {
        key: "expense_total",
        label: "Uscite",
        variant: "expense",
        className: "bg-red-50/60",
    },
    {
        key: "hypothetical_saving",
        label: "Risparmio ipotetico",
        variant: "saving",
        className: "bg-sky-50/60",
    },
    {
        key: "hypothetical_end",
        label: "Fine mese ipotetico",
        variant: "total",
        className: "bg-slate-50",
    },
    {
        key: "real_end",
        label: "Fine mese reale",
        variant: "real",
        className: "bg-indigo-50/60",
        separator: true,
    },
    {
        key: "surplus",
        label: "Surplus fine mese",
        subtitle: "(reale - ipotetico)",
        variant: "surplus",
        className: "bg-fuchsia-50/60",
    },
];

const TEXT_VARIANTS = {
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

function toNumber(value) {
    if (value === "" || value === null || value === undefined || value === "-") {
        return null;
    }

    const number = Number(String(value).replace(",", "."));
    return Number.isNaN(number) ? null : number;
}

function toCurrencyValue(value) {
    const number = toNumber(value);
    return number === null ? null : number.toFixed(2);
}

function sameCurrency(a, b) {
    const first = toNumber(a);
    const second = toNumber(b);

    if (first === null || second === null) return false;

    return Math.round(first * 100) === Math.round(second * 100);
}

function sanitizeCurrencyInput(value) {
    if (value === null || value === undefined) return "";

    let text = String(value).replace(/[^\d.,-]/g, "").replace(/\s/g, "");
    const isNegative = text.startsWith("-");

    text = text.replace(/-/g, "");

    const separatorIndex = text.search(/[.,]/);

    if (separatorIndex === -1) {
        return `${isNegative ? "-" : ""}${text}`;
    }

    const integerPart = text.slice(0, separatorIndex);
    const separator = text[separatorIndex];
    const decimalPart = text
        .slice(separatorIndex + 1)
        .replace(/[.,]/g, "")
        .slice(0, 2);

    return `${isNegative ? "-" : ""}${integerPart}${separator}${decimalPart}`;
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
        startSource: START_SOURCE.API,
        surplusDestination: getSurplusDestination(month),
    }));
}

function SummaryCard({ title, value, icon: Icon, variant = "default" }) {
    const styles = {
        default: ["border-slate-200 bg-white", "bg-slate-100 text-slate-700", "text-slate-900"],
        income: ["border-emerald-200 bg-emerald-50", "bg-emerald-100 text-emerald-700", "text-emerald-700"],
        expense: ["border-red-200 bg-red-50", "bg-red-100 text-red-700", "text-red-700"],
        saving: ["border-sky-200 bg-sky-50", "bg-sky-100 text-sky-700", "text-sky-700"],
    };

    const [wrapperClass, iconClass, valueClass] = styles[variant] ?? styles.default;

    return (
        <div className={`rounded-2xl border p-4 shadow-sm ${wrapperClass}`}>
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        {title}
                    </p>

                    <p className={`mt-2 text-xl font-semibold ${valueClass}`}>
                        {formatCurrency(toNumber(value) ?? 0)}
                    </p>
                </div>

                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}>
                    <Icon size={18} />
                </div>
            </div>
        </div>
    );
}

function MoneyCell({
    value,
    variant,
    editable,
    onChange,
    onFocus,
    onKeyDown,
    walletIncluded,
    nextMonthIncluded,
}) {
    const hasValue = value !== null && value !== undefined && value !== "";

    if (editable) {
        return (
            <td className="whitespace-nowrap px-3 py-2 text-right text-xs font-medium">
                <input
                    type="text"
                    inputMode="decimal"
                    value={hasValue ? String(value) : ""}
                    onFocus={onFocus}
                    onChange={(event) => onChange(event.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder="-"
                    className={`
                        h-6 w-full min-w-0 rounded-md border border-slate-200 bg-white px-1.5
                        text-right text-xs font-medium outline-none transition
                        placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200
                        ${TEXT_VARIANTS[variant] ?? TEXT_VARIANTS.default}
                    `}
                />
            </td>
        );
    }

    return (
        <td
            title={
                walletIncluded
                    ? "Surplus incluso nel portafoglio risparmio"
                    : nextMonthIncluded
                        ? "Surplus portato al mese successivo"
                        : ""
            }
            className={`
                whitespace-nowrap px-3 py-3 text-right text-xs
                ${walletIncluded ? "bg-sky-50/70 ring-1 ring-inset ring-sky-200" : ""}
                ${nextMonthIncluded ? "bg-amber-50/70 ring-1 ring-inset ring-amber-200" : ""}
            `}
        >
            <span
                className={`
                    block leading-none
                    ${walletIncluded || nextMonthIncluded ? "font-semibold" : "font-medium"}
                    ${hasValue ? TEXT_VARIANTS[variant] ?? TEXT_VARIANTS.default : TEXT_VARIANTS.muted}
                `}
            >
                {hasValue ? formatCurrency(toNumber(value) ?? 0) : "-"}
            </span>
        </td>
    );
}

export default function YearBalanceSummaryPage({ selectedYear = 2027 }) {

    const { data, loading, error } = useGet(
        API_ENDPOINTS.annualSummary({ year: selectedYear }),
        { delayMs: 0 }
    );



    const rowRefs = useRef({});
    const monthMenuRef = useRef(null);

    const [monthsData, setMonthsData] = useState([]);
    const [previousYearDecember, setPreviousYearDecember] = useState(null);
    const [runtimeStartIndex, setRuntimeStartIndex] = useState(null);
    const [activeInputCell, setActiveInputCell] = useState(null);

    const [editableRows, setEditableRows] = useState({
        hypothetical_start: false,
        hypothetical_saving: false,
        real_end: false,
    });

    const [monthMenu, setMonthMenu] = useState({
        open: false,
        monthIndex: null,
        top: 0,
        left: 0,
    });

    useEffect(() => {
        if (!data?.months) return;

        setMonthsData(normalizeMonths(data.months));
        setPreviousYearDecember(data.previous_year_december ?? null);
        setRuntimeStartIndex(null);
        setActiveInputCell(null);
        setMonthMenu({ open: false, monthIndex: null, top: 0, left: 0 });
    }, [data]);

    useEffect(() => {
        function handleDocumentMouseDown(event) {
            const clickedInsideMenu = monthMenuRef.current?.contains(event.target);

            if (!clickedInsideMenu) {
                setMonthMenu((prev) => ({ ...prev, open: false, monthIndex: null }));
            }

            setEditableRows((prev) => {
                let changed = false;
                const next = { ...prev };

                Object.entries(prev).forEach(([rowKey, isEditable]) => {
                    if (!isEditable) return;

                    const rowElement = rowRefs.current[rowKey];
                    const clickedInsideRow = rowElement?.contains(event.target);

                    if (!clickedInsideRow) {
                        next[rowKey] = false;
                        changed = true;
                    }
                });

                if (changed) {
                    setActiveInputCell(null);
                }

                return changed ? next : prev;
            });
        }

        document.addEventListener("mousedown", handleDocumentMouseDown);

        return () => {
            document.removeEventListener("mousedown", handleDocumentMouseDown);
        };
    }, []);

    const months = useMemo(() => {
        return monthsData.reduce((acc, month, index) => {
            const previousMonth = index === 0 ? previousYearDecember : acc[index - 1];

            const income = toNumber(month.income_total) ?? 0;
            const expense = toNumber(month.expense_total) ?? 0;
            const saving = toNumber(month.hypothetical_saving) ?? 0;

            let start = toNumber(month.hypothetical_start) ?? 0;

            const shouldRecalculateFromPrevious =
                runtimeStartIndex !== null && index > runtimeStartIndex;

            if (previousMonth && shouldRecalculateFromPrevious) {
                if (month.startSource === START_SOURCE.REAL) {
                    start =
                        toNumber(previousMonth.real_end) ??
                        toNumber(previousMonth.hypothetical_end) ??
                        0;
                } else if (month.startSource === START_SOURCE.CUSTOM) {
                    start = toNumber(month.hypothetical_start) ?? 0;
                } else {
                    start = toNumber(previousMonth.hypothetical_end) ?? 0;
                }

                if (previousMonth.surplusDestination === SURPLUS_DESTINATION.NEXT_MONTH) {
                    start += toNumber(previousMonth.surplus) ?? 0;
                }
            }

            if (
                previousMonth &&
                !shouldRecalculateFromPrevious &&
                month.startSource === START_SOURCE.HYPOTHETICAL
            ) {
                start = toNumber(previousMonth.hypothetical_end) ?? 0;
            }

            if (
                previousMonth &&
                !shouldRecalculateFromPrevious &&
                month.startSource === START_SOURCE.REAL
            ) {
                start =
                    toNumber(previousMonth.real_end) ??
                    toNumber(previousMonth.hypothetical_end) ??
                    0;
            }

            const hypotheticalEnd = start + income - expense - saving;
            const realEnd = toNumber(month.real_end);
            const surplus = realEnd === null ? null : realEnd - hypotheticalEnd;

            acc.push({
                ...month,
                hypothetical_start: toCurrencyValue(start),
                hypothetical_end: toCurrencyValue(hypotheticalEnd),
                surplus: surplus === null ? null : toCurrencyValue(surplus),
            });

            return acc;
        }, []);
    }, [monthsData, previousYearDecember, runtimeStartIndex]);

    const totals = useMemo(() => {
        const income = months.reduce((sum, month) => sum + (toNumber(month.income_total) ?? 0), 0);
        const expense = months.reduce((sum, month) => sum + (toNumber(month.expense_total) ?? 0), 0);
        const saving = months.reduce((sum, month) => sum + (toNumber(month.hypothetical_saving) ?? 0), 0);
        const surplusToWallet = months.reduce((sum, month) => {
            if (month.surplusDestination !== SURPLUS_DESTINATION.WALLET) return sum;
            return sum + (toNumber(month.surplus) ?? 0);
        }, 0);

        const wallet = (toNumber(data?.saving_wallet_total) ?? 0) + surplusToWallet;
        const balance = income - expense;

        return {
            income,
            expense,
            saving,
            wallet,
            balance,
            progress: saving > 0 ? Math.min((balance / saving) * 100, 100) : 0,
        };
    }, [months, data]);

    if (loading) {
        return (
            <PageMessage>
                Caricamento riepilogo annuale...
            </PageMessage>
        );
    }

    if (error) {
        return (
            <PageMessage variant="error">
                Errore durante il caricamento del riepilogo annuale.
            </PageMessage>
        );
    }

    if (!data) {
        return (
            <PageMessage>
                Nessun dato disponibile.
            </PageMessage>
        );
    }

    function updateRuntimeStartIndex(monthIndex) {
        setRuntimeStartIndex((prev) => (prev === null ? monthIndex : Math.min(prev, monthIndex)));
    }

    function updateMonth(monthIndex, patch) {
        setMonthsData((prev) =>
            prev.map((month, index) =>
                index === monthIndex ? { ...month, ...patch } : month
            )
        );
    }

    function handleInputChange(monthIndex, key, value) {
        const sanitizedValue = sanitizeCurrencyInput(value);

        updateRuntimeStartIndex(monthIndex);

        updateMonth(monthIndex, {
            [key]: sanitizedValue,
            ...(key === "hypothetical_start"
                ? { startSource: START_SOURCE.CUSTOM }
                : {}),
        });
    }

    function handleToggleEditableRow(rowKey) {
        setEditableRows((prev) => ({
            ...prev,
            [rowKey]: !prev[rowKey],
        }));

        setActiveInputCell(null);
    }

    function handleInputKeyDown(event, rowKey) {
        if (event.key !== "Enter") return;

        event.preventDefault();

        setEditableRows((prev) => ({
            ...prev,
            [rowKey]: false,
        }));

        setActiveInputCell(null);
        event.currentTarget.blur();
    }

    function getPreviousMonth(monthIndex) {
        return monthIndex === 0 ? previousYearDecember : months[monthIndex - 1];
    }

    function getPreviousEnd(monthIndex, source) {
        const previousMonth = getPreviousMonth(monthIndex);

        if (!previousMonth) return null;

        if (source === START_SOURCE.REAL) {
            return previousMonth.real_end ?? previousMonth.hypothetical_end;
        }

        return previousMonth.hypothetical_end;
    }

    function setStartFromPreviousEnd(monthIndex, source) {
        const value = getPreviousEnd(monthIndex, source);
        const number = toNumber(value);

        if (number === null) return;

        updateRuntimeStartIndex(monthIndex);

        updateMonth(monthIndex, {
            hypothetical_start: number.toFixed(2),
            startSource: source,
        });

        closeMonthMenu();
    }

    function toggleSurplusDestination(monthIndex, destination) {
        const month = months[monthIndex];
        const surplus = toNumber(month?.surplus);

        if (!surplus) return;

        updateRuntimeStartIndex(monthIndex);

        const nextDestination =
            month.surplusDestination === destination
                ? SURPLUS_DESTINATION.NONE
                : destination;

        updateMonth(monthIndex, {
            surplusDestination: nextDestination,
            surplus_carried_to_saving_wallet:
                nextDestination === SURPLUS_DESTINATION.WALLET,
            surplus_carried_to_next_month:
                nextDestination === SURPLUS_DESTINATION.NEXT_MONTH,
        });

        closeMonthMenu();
    }

    function openMonthMenu(event, monthIndex) {
        event.stopPropagation();

        const rect = event.currentTarget.getBoundingClientRect();

        setMonthMenu((prev) => ({
            open: !(prev.open && prev.monthIndex === monthIndex),
            monthIndex,
            top: rect.bottom + 6,
            left: rect.right - 200,
        }));
    }

    function closeMonthMenu() {
        setMonthMenu((prev) => ({
            ...prev,
            open: false,
            monthIndex: null,
        }));
    }

    function getStartVariant(month, monthIndex) {
        const previousMonth = getPreviousMonth(monthIndex);

        if (sameCurrency(month.hypothetical_start, previousMonth?.hypothetical_end)) {
            return "total";
        }

        if (
            previousMonth?.real_end !== null &&
            previousMonth?.real_end !== undefined &&
            sameCurrency(month.hypothetical_start, previousMonth.real_end)
        ) {
            return "real";
        }

        return "custom";
    }

    function getCellVariant(row, month, monthIndex) {
        if (row.key === "hypothetical_start") {
            return getStartVariant(month, monthIndex);
        }

        if (row.key !== "surplus") {
            return row.variant;
        }

        const surplus = toNumber(month.surplus);

        if (surplus === null) return "muted";

        return surplus >= 0 ? "surplusPositive" : "surplusNegative";
    }

    const openedMonth = monthMenu.open ? months[monthMenu.monthIndex] : null;
    const previousMonth = monthMenu.open ? getPreviousMonth(monthMenu.monthIndex) : null;
    const openedSurplus = toNumber(openedMonth?.surplus);

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-6">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
                <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <SummaryCard
                        title="Portafoglio risparmio"
                        value={totals.wallet}
                        icon={Wallet}
                    />

                    <SummaryCard
                        title="Entrate annuali"
                        value={totals.income}
                        icon={TrendingUp}
                        variant="income"
                    />

                    <SummaryCard
                        title="Uscite annuali"
                        value={totals.expense}
                        icon={TrendingDown}
                        variant="expense"
                    />

                    <SummaryCard
                        title="Risparmio ipotetico"
                        value={totals.saving}
                        icon={PiggyBank}
                        variant="saving"
                    />
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-col gap-3 border-b border-slate-200 p-5 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-base font-semibold text-slate-900">
                                Andamento {data.year}
                            </h2>

                            <p className="text-sm text-slate-500">
                                Confronto tra valori ipotetici e valori reali
                            </p>
                        </div>

                        <div className="w-full max-w-xs">
                            <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                                <span>Risparmio ipotetico</span>
                                <span>{Math.round(totals.progress)}%</span>
                            </div>

                            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                <div
                                    className="h-full rounded-full bg-slate-900 transition-all"
                                    style={{ width: `${totals.progress}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <SummaryTable monthsData={data.months} />
                    </div>
                </section>
            </div>

            {openedMonth && (
                <div
                    ref={monthMenuRef}
                    className="fixed z-50 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl"
                    style={{
                        top: monthMenu.top,
                        left: Math.max(monthMenu.left, 8),
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
                        <MenuButton
                            label="Inizio da fine ipotetico"
                            value={previousMonth?.hypothetical_end}
                            active={sameCurrency(
                                openedMonth.hypothetical_start,
                                previousMonth?.hypothetical_end
                            )}
                            disabled={toNumber(previousMonth?.hypothetical_end) === null}
                            onClick={() =>
                                setStartFromPreviousEnd(
                                    monthMenu.monthIndex,
                                    START_SOURCE.HYPOTHETICAL
                                )
                            }
                        />

                        <MenuButton
                            label="Inizio da fine reale"
                            value={previousMonth?.real_end}
                            active={sameCurrency(
                                openedMonth.hypothetical_start,
                                previousMonth?.real_end
                            )}
                            disabled={toNumber(previousMonth?.real_end) === null}
                            activeClass="border-indigo-200 bg-indigo-50 text-indigo-700"
                            onClick={() =>
                                setStartFromPreviousEnd(
                                    monthMenu.monthIndex,
                                    START_SOURCE.REAL
                                )
                            }
                        />

                        <div className="my-1 border-t border-slate-100" />

                        <MenuButton
                            label={
                                openedMonth.surplusDestination ===
                                    SURPLUS_DESTINATION.WALLET
                                    ? "Rimuovi dal portafoglio"
                                    : "Aggiungi al portafoglio"
                            }
                            value={openedMonth.surplus}
                            active={
                                openedMonth.surplusDestination ===
                                SURPLUS_DESTINATION.WALLET
                            }
                            disabled={!openedSurplus}
                            activeClass="border-sky-200 bg-sky-50 text-sky-700"
                            onClick={() =>
                                toggleSurplusDestination(
                                    monthMenu.monthIndex,
                                    SURPLUS_DESTINATION.WALLET
                                )
                            }
                        />

                        <MenuButton
                            label={
                                openedMonth.surplusDestination ===
                                    SURPLUS_DESTINATION.NEXT_MONTH
                                    ? "Rimuovi dal mese successivo"
                                    : "Porta al mese successivo"
                            }
                            value={openedMonth.surplus}
                            active={
                                openedMonth.surplusDestination ===
                                SURPLUS_DESTINATION.NEXT_MONTH
                            }
                            disabled={
                                !openedSurplus ||
                                monthMenu.monthIndex >= months.length - 1
                            }
                            activeClass="border-amber-200 bg-amber-50 text-amber-700"
                            onClick={() =>
                                toggleSurplusDestination(
                                    monthMenu.monthIndex,
                                    SURPLUS_DESTINATION.NEXT_MONTH
                                )
                            }
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

function MenuButton({
    label,
    value,
    active = false,
    disabled = false,
    activeClass = "border-slate-300 bg-slate-100 text-slate-900",
    onClick,
}) {
    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            className={`
                flex w-full flex-col rounded-lg border px-2 py-2 text-left transition
                ${disabled
                    ? "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300"
                    : active
                        ? activeClass
                        : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50"
                }
            `}
        >
            <span className="text-[11px] font-medium">{label}</span>

            <span className="mt-0.5 text-xs font-semibold">
                {value === null || value === undefined
                    ? "-"
                    : formatCurrency(toNumber(value) ?? 0)}
            </span>
        </button>
    );
}

function PageMessage({ children, variant = "default" }) {
    const isError = variant === "error";

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-6">
            <div
                className={`
                    mx-auto w-full max-w-7xl rounded-2xl border p-6 text-sm shadow-sm
                    ${isError
                        ? "border-red-200 bg-red-50 text-red-700"
                        : "border-slate-200 bg-white text-slate-500"
                    }
                `}
            >
                {children}
            </div>
        </div>
    );
}

