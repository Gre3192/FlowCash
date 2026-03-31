import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const MONTHS = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];

export default function BulkUpdatePanel({ rows, setRows }) {
    const [isOpen, setIsOpen] = useState(true);
    const [bulkValue, setBulkValue] = useState("");
    const [selectedMonths, setSelectedMonths] = useState([]);
    const [selectedYears, setSelectedYears] = useState([]);
    const [valueMode, setValueMode] = useState("decimal");

    const inputRef = useRef(null);

    const selectAllMonths = () => {
        setSelectedMonths(MONTHS.map((_, index) => index));
    };

    const clearMonths = () => {
        setSelectedMonths([]);
    };

    const toggleMonth = (monthIndex) => {
        setSelectedMonths((prev) =>
            prev.includes(monthIndex)
                ? prev.filter((m) => m !== monthIndex)
                : [...prev, monthIndex].sort((a, b) => a - b)
        );
    };

    const toggleYear = (year) => {
        setSelectedYears((prev) =>
            prev.includes(year)
                ? prev.filter((y) => y !== year)
                : [...prev, year].sort((a, b) => a - b)
        );
    };

    const selectAllYears = () => {
        setSelectedYears(rows.map((row) => row.year));
    };

    const clearYears = () => {
        setSelectedYears([]);
    };

    const normalizeValueString = (value) => {
        return String(value).replace(",", ".");
    };

    const splitNumberParts = (value) => {
        const normalized = normalizeValueString(value);

        if (!normalized || Number.isNaN(Number(normalized))) {
            return { integerPart: 0, decimalPart: 0 };
        }

        const [intStr = "0", decStr = ""] = normalized.split(".");
        const integerPart = parseInt(intStr, 10) || 0;
        const decimalPart = parseInt((decStr + "00").slice(0, 2), 10) || 0;

        return { integerPart, decimalPart };
    };

    const buildValueFromParts = (integerPart, decimalPart) => {
        const safeInteger = Math.max(0, integerPart);
        const safeDecimal = Math.max(0, Math.min(99, decimalPart));
        return `${safeInteger},${String(safeDecimal).padStart(2, "0")}`;
    };

    const handleWheelValue = (e) => {
        const direction = e.deltaY < 0 ? 1 : -1;
        const { integerPart, decimalPart } = splitNumberParts(bulkValue);

        if (valueMode === "integer") {
            const nextInteger = Math.max(0, integerPart + direction);
            setBulkValue(buildValueFromParts(nextInteger, decimalPart));
            return;
        }

        let nextInteger = integerPart;
        let nextDecimal = decimalPart + direction;

        if (nextDecimal > 99) {
            nextDecimal = 0;
            nextInteger += 1;
        }

        if (nextDecimal < 0) {
            if (nextInteger > 0) {
                nextDecimal = 99;
                nextInteger -= 1;
            } else {
                nextDecimal = 0;
            }
        }

        setBulkValue(buildValueFromParts(nextInteger, nextDecimal));
    };

    const handleValueChange = (e) => {
        const value = e.target.value;

        if (value === "") {
            setBulkValue("");
            return;
        }

        if (!/^\d*([.,]?\d{0,2})?$/.test(value)) return;

        setBulkValue(value);
    };

    const handleApplyBulkValue = () => {
        if (bulkValue === "") return;
        if (selectedMonths.length === 0) return;
        if (selectedYears.length === 0) return;

        const normalizedBulkValue = bulkValue.replace(",", ".");

        setRows((prev) =>
            prev.map((row) => {
                if (!selectedYears.includes(row.year)) return row;

                return {
                    ...row,
                    values: row.values.map((currentValue, monthIndex) =>
                        selectedMonths.includes(monthIndex) ? normalizedBulkValue : currentValue
                    ),
                };
            })
        );
    };

    const handleClearTable = () => {
        setRows((prev) =>
            prev.map((row) => ({
                ...row,
                values: row.values.map(() => ""),
            }))
        );
    };

    useEffect(() => {
        const input = inputRef.current;
        if (!input) return;

        const onWheel = (e) => {
            e.preventDefault();
            handleWheelValue(e);
        };

        input.addEventListener("wheel", onWheel, { passive: false });

        return () => {
            input.removeEventListener("wheel", onWheel);
        };
    }, [bulkValue, valueMode]);

    const getToggleClass = (isActive) =>
        `h-10 rounded-full border px-3 sm:px-4 text-xs sm:text-sm font-semibold transition-all duration-200 shadow-sm ${
            isActive
                ? "border-rose-300 bg-blue-100 text-blue-700 shadow-rose-100"
                : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-300 hover:bg-white"
        }`;

    return (
        <div className="mb-3 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="flex w-full items-start justify-between gap-3 px-4 py-3 text-left transition hover:bg-zinc-50"
            >
                <div className="min-w-0">
                    <div className="text-sm font-semibold text-zinc-800 sm:text-base">
                        Aggiornamento massivo
                    </div>
                    <div className="text-xs text-zinc-500">
                        Seleziona anni, mesi e applica un valore in blocco
                    </div>
                </div>

                <ChevronDown
                    size={18}
                    className={`mt-0.5 shrink-0 text-zinc-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        key="bulk-panel-content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <motion.div
                            initial={{ y: -8 }}
                            animate={{ y: 0 }}
                            exit={{ y: -8 }}
                            transition={{ duration: 0.22, ease: "easeOut" }}
                            className="border-t border-zinc-200 p-3 sm:p-4"
                        >
                            <div className="grid gap-4 xl:grid-cols-[220px_1fr_1fr_auto]">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-zinc-700">
                                        Valore
                                    </label>

                                    <div className="relative">
                                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-zinc-500">
                                            &euro;
                                        </span>

                                        <input
                                            ref={inputRef}
                                            type="text"
                                            inputMode="decimal"
                                            value={bulkValue}
                                            onChange={handleValueChange}
                                            placeholder="0,00"
                                            className="h-10 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-8 pr-3 text-sm text-zinc-700 outline-none transition placeholder:text-zinc-400 focus:border-zinc-300 focus:bg-white focus:ring-2 focus:ring-zinc-200"
                                        />
                                    </div>

                                    <div className="mt-3 rounded-xl border border-zinc-200 bg-zinc-50/70 p-3">
                                        <div className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
                                            Tipo incremento
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700">
                                                <input
                                                    type="radio"
                                                    name="valueMode"
                                                    value="integer"
                                                    checked={valueMode === "integer"}
                                                    onChange={(e) => setValueMode(e.target.value)}
                                                    className="h-4 w-4"
                                                />
                                                Interi
                                            </label>

                                            <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700">
                                                <input
                                                    type="radio"
                                                    name="valueMode"
                                                    value="decimal"
                                                    checked={valueMode === "decimal"}
                                                    onChange={(e) => setValueMode(e.target.value)}
                                                    className="h-4 w-4"
                                                />
                                                Decimali
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                        <label className="block text-sm font-medium text-zinc-700">
                                            Mesi
                                        </label>

                                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
                                            <button
                                                type="button"
                                                onClick={selectAllMonths}
                                                className="text-zinc-500 transition hover:text-zinc-800"
                                            >
                                                Seleziona tutti
                                            </button>
                                            <button
                                                type="button"
                                                onClick={clearMonths}
                                                className="text-zinc-500 transition hover:text-zinc-800"
                                            >
                                                Reset
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid h-auto min-h-[176px] grid-cols-3 gap-2 rounded-2xl border border-zinc-200 bg-zinc-50/60 p-3 sm:h-44 sm:grid-cols-4">
                                        {MONTHS.map((month, index) => (
                                            <button
                                                key={month}
                                                type="button"
                                                onClick={() => toggleMonth(index)}
                                                className={getToggleClass(selectedMonths.includes(index))}
                                            >
                                                {month}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                        <label className="block text-sm font-medium text-zinc-700">
                                            Anni presenti
                                        </label>

                                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
                                            <button
                                                type="button"
                                                onClick={selectAllYears}
                                                className="text-zinc-500 transition hover:text-zinc-800"
                                            >
                                                Seleziona tutti
                                            </button>
                                            <button
                                                type="button"
                                                onClick={clearYears}
                                                className="text-zinc-500 transition hover:text-zinc-800"
                                            >
                                                Reset
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid h-44 content-start grid-cols-2 auto-rows-[40px] gap-2 overflow-y-auto rounded-2xl border border-zinc-200 bg-zinc-50/60 p-3 sm:grid-cols-3">
                                        {rows.map((row) => (
                                            <button
                                                key={row.year}
                                                type="button"
                                                onClick={() => toggleYear(row.year)}
                                                className={getToggleClass(selectedYears.includes(row.year))}
                                            >
                                                {row.year}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={handleApplyBulkValue}
                                        className="inline-flex h-10 w-full items-center justify-center rounded-xl bg-black px-5 text-sm font-medium text-white transition hover:bg-zinc-800"
                                    >
                                        Popola tabella
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleClearTable}
                                        className="inline-flex h-10 w-full items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                                    >
                                        Pulisci tabella
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}