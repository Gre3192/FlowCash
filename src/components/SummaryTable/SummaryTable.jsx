import { Pencil, Lock, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import formatCurrency from "../../utils/formatCurrency";
import { IconButton, Input } from "../../ui";
import toNumber from "../../utils/toNumber";
import { API_ENDPOINTS } from "../../api/endpoint";
import { usePost } from "../../hooks/usePost"
import { toast } from "react-toastify";

const ROWS_CONFIG = [
    {
        key: "hypothetical_start",
        label: "Inizio mese ipotetico",
        variant: "default",
        className: "bg-white",
        isEditable: true,
    },
    {
        key: "income_total",
        label: "Entrate",
        variant: "income",
        className: "bg-emerald-50/60 text-emerald-700",
    },
    {
        key: "expense_total",
        label: "Uscite",
        variant: "expense",
        className: "bg-red-50/60 text-red-700",
    },
    {
        key: "hypothetical_saving",
        label: "Risparmio ipotetico",
        variant: "saving",
        className: "bg-sky-50/60 text-sky-700",
        isEditable: true,
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
        className: "bg-indigo-50/60 text-indigo-700",
        separator: true,
        isEditable: true,
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

function recalculateMonthsChain(months, changedMonthNum, cellType, newValue) {
    const updatedMonths = months.map((month) => ({ ...month }));
    const changedIndex = updatedMonths.findIndex((month) => Number(month.month) === Number(changedMonthNum));
    if (changedIndex === -1) return updatedMonths;
    updatedMonths[changedIndex] = { ...updatedMonths[changedIndex], [cellType]: toNumber(newValue) };
    for (let i = changedIndex; i < updatedMonths.length; i++) {

        const currentMonth = updatedMonths[i];

        if (i > changedIndex) {
            const previousMonth = updatedMonths[i - 1];
            currentMonth.hypothetical_start = toNumber(previousMonth.hypothetical_end);
        }

        const newHpEnd = toNumber(currentMonth.hypothetical_start) +
            toNumber(currentMonth.income_total) -
            toNumber(currentMonth.expense_total) -
            toNumber(currentMonth.hypothetical_saving)

        const surplus = toNumber(currentMonth.real_end) -
            toNumber(currentMonth.hypothetical_end);

        currentMonth.hypothetical_end = newHpEnd;
        currentMonth.surplus = surplus;
    }
    return updatedMonths;
}

export default function SummaryTable({
    data,
    selectedYear,
}) {

    const [months, setMonths] = useState(data?.months ?? []);

    const previous_year_december = data?.previous_year_december ?? null

    useEffect(() => {
        setMonths(data?.months ?? []);
    }, [data]);


    return (
        <table className="w-full min-w-[980px] table-fixed border-collapse">
            <colgroup>
                <col className="w-[160px]" />
                {months?.map((month) => (
                    <col key={month.id ?? month.label} className="w-[72px]" />
                ))}
            </colgroup>

            <HeadTable months={months} />
            <BodyTable
                months={months}
                setMonths={setMonths}
                selectedYear={selectedYear}
                previous_year_december={previous_year_december}
            />
        </table>
    );
}

function HeadTable({ months }) {
    return (
        <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
                <th className="sticky left-0 z-10 bg-slate-50 px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Voce
                </th>

                {months.map((month) => (
                    <th
                        key={month.id ?? month.label}
                        className="px-2 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-slate-500"
                    >
                        <MonthLabelButton label={month.label} />
                    </th>
                ))}
            </tr>
        </thead>
    );
}

function BodyTable({ months, setMonths, selectedYear, previous_year_december }) {
    return (
        <tbody>
            {ROWS_CONFIG.map((row) => (
                <RowTable
                    key={row.key}
                    row={row}
                    months={months}
                    setMonths={setMonths}
                    selectedYear={selectedYear}
                    previous_year_december={previous_year_december}
                />
            ))}
        </tbody>
    );
}

function RowTable({ row, months, setMonths, selectedYear, previous_year_december }) {

    console.log(previous_year_december);

    const [rowIsEditing, setRowIsEditing] = useState(false);
    const { postData, loading } = usePost();

    async function handleEditing() {
        if (!rowIsEditing) {
            setRowIsEditing(true);
            return;
        }

        const payload = { months };

        try {
            await postData(
                API_ENDPOINTS.monthlySummaries() + "/" + selectedYear + "/",
                payload
            );
            toast.success("Riepilogo mensile salvato");
            setRowIsEditing(false);
            return true;
        } catch (error) {
            console.error("Errore salvataggio riepilogo mensile:", error);
            toast.error("Errore durante il salvataggio");
            return false;
        }
    }

    return (
        <tr className={`border-b border-slate-100 last:border-b-0 hover:bg-slate-100/60 ${row.className} ${row.separator ? "border-t-4 border-t-slate-200" : ""}`}>
            <td className={`sticky left-0 z-10 px-3 py-3 text-xs font-semibold text-slate-700${row.className}`}>
                <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 flex-col leading-tight">
                        <span className="truncate">{row.label}</span>
                        {row.subtitle && (
                            <span className="mt-0.5 truncate text-[11px] font-normal italic text-slate-500">
                                {row.subtitle}
                            </span>
                        )}
                    </div>
                    {row.isEditable && (
                        <IconButton
                            icon={rowIsEditing ? Lock : Pencil}
                            onClick={handleEditing}
                            size="sm"
                            loading={loading}
                        />
                    )}
                </div>
            </td>

            {months.map((month) => {
                console.log(month);
                const value = month[row.key]

                let textColor = ''
                if (month.month === 1 && row.key === "hypothetical_start") {

                    textColor = month[row.key] === previous_year_december.hypothetical_end ? TEXT_VARIANTS.default :
                        month[row.key] === previous_year_december.real_end ? TEXT_VARIANTS.real : TEXT_VARIANTS.custom

                } else {


                }

                return (
                    <MoneyCell
                        key={`${row.key}-${month.month}`}
                        value={value}
                        rowIsEditing={rowIsEditing}
                        setMonths={setMonths}
                        cellType={row.key}
                        monthNum={month.month}
                        textColor={textColor}
                    />
                )
            }
            )}
        </tr>
    );
}

function MoneyCell({
    value,
    rowIsEditing,
    setMonths,
    cellType,
    monthNum,
    textColor
}) {
    const [valueCell, setValueCell] = useState(value ?? "");

    useEffect(() => {
        setValueCell(value ?? "");
    }, [value]);

    function handleChangeValue(e) {
        const newValue = e.target.value;
        setValueCell(newValue);
        setMonths((prevMonths) =>
            recalculateMonthsChain(
                prevMonths,
                monthNum,
                cellType,
                newValue
            )
        );
    }

    if (rowIsEditing) {
        return (
            <td className="whitespace-nowrap px-3 py-2 text-right text-xs font-medium">
                <Input
                    value={valueCell}
                    onChange={handleChangeValue}
                    placeholder="-"
                    inputClassName={`
                        h-6 w-full min-w-0 rounded-md border border-slate-200 bg-white px-1.5
                        text-right text-xs font-medium outline-none transition
                        placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200
                        ${textColor}
                    `}
                />
            </td>
        );
    }

    return (
        <td
            title=""
            className={`whitespace-nowrap px-3 py-3 text-right text-xs ${textColor}`}
        >
            <span className="block leading-none font-medium">
                {formatCurrency(toNumber(valueCell), true)}
            </span>
        </td>
    );
}

function MonthLabelButton({ label }) {
    const buttonRef = useRef(null);

    const [isOpen, setIsOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState(null);

    function handleToggleMenu() {
        if (!buttonRef.current) return;

        const rect = buttonRef.current.getBoundingClientRect();

        setMenuPosition({
            top: rect.bottom + 6,
            left: rect.right - 224,
        });

        setIsOpen((prev) => !prev);
    }

    return (
        <>
            <button
                ref={buttonRef}
                type="button"
                onClick={handleToggleMenu}
                className={`
                    ml-auto inline-flex items-center justify-end gap-1 rounded-lg border px-2 py-1
                    text-[11px] font-semibold uppercase tracking-wide transition
                    ${isOpen
                        ? "border-slate-300 bg-white text-slate-900 shadow-sm"
                        : "border-transparent text-slate-500 hover:border-slate-200 hover:bg-white hover:text-slate-900"
                    }
                `}
            >
                <span>{label}</span>

                <ChevronDown
                    size={12}
                    className={`transition ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            {isOpen && menuPosition && (
                <div
                    className="fixed z-50 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl"
                    style={{
                        top: menuPosition.top,
                        left: menuPosition.left,
                    }}
                >
                    <div className="border-b border-slate-100 px-2 pb-2">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                            Opzioni
                        </p>

                        <p className="mt-0.5 text-[11px] text-slate-400">
                            Inizio mese e surplus
                        </p>
                    </div>

                    <div className="mt-2 flex flex-col gap-1">
                        <MenuButton
                            label="Inizio da fine ipotetico"
                            value={0}
                            active={false}
                            disabled={false}
                            onClick={() => { }}
                        />

                        <MenuButton
                            label="Inizio da fine reale"
                            value={0}
                            active={false}
                            disabled={false}
                            activeClass="border-indigo-200 bg-indigo-50 text-indigo-700"
                            onClick={() => { }}
                        />

                        <div className="my-1 border-t border-slate-100" />

                        <MenuButton
                            label="Aggiungi al portafoglio"
                            value={0}
                            active={false}
                            disabled={false}
                            activeClass="border-sky-200 bg-sky-50 text-sky-700"
                            onClick={() => { }}
                        />

                        <MenuButton
                            label="Porta al mese successivo"
                            value={0}
                            active={false}
                            disabled={false}
                            activeClass="border-amber-200 bg-amber-50 text-amber-700"
                            onClick={() => { }}
                        />
                    </div>
                </div>
            )}
        </>
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
                    : formatCurrency(value ?? 0)}
            </span>
        </button>
    );
}