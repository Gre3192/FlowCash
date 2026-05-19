import { useEffect, useRef, useState } from "react";
import {
    ChevronDown,
    Eraser,
    MinusCircle,
    PlusCircle,
    RotateCcw,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

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

export default function BulkUpdatePanel({
    rows,
    setRows,
    handleAddNextYear,
    handleRemoveLastYear,
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [bulkValue, setBulkValue] = useState("");
    const [selectedMonths, setSelectedMonths] = useState([]);
    const [selectedYears, setSelectedYears] = useState([]);
    const [valueMode, setValueMode] = useState("decimal");
    const [isValueFocused, setIsValueFocused] = useState(false);

    const inputRef = useRef(null);
    const lastWheelTimeRef = useRef(0);

    function toggleMonth(monthIndex) {
        setSelectedMonths((prev) =>
            prev.includes(monthIndex)
                ? prev.filter((month) => month !== monthIndex)
                : [...prev, monthIndex].sort((a, b) => a - b)
        );
    }

    function toggleYear(year) {
        setSelectedYears((prev) =>
            prev.includes(year)
                ? prev.filter((currentYear) => currentYear !== year)
                : [...prev, year].sort((a, b) => a - b)
        );
    }

    function selectAllMonths() {
        setSelectedMonths(MONTHS.map((_, index) => index));
    }

    function selectAllYears() {
        setSelectedYears(rows.map((row) => row.year));
    }

    function handleClearValue() {
        setBulkValue("");
    }

    function handleClearMonths() {
        setSelectedMonths([]);
    }

    function handleClearYears() {
        setSelectedYears([]);
    }

    function normalizeValueString(value) {
        return String(value).replace(",", ".");
    }

    function splitNumberParts(value) {
        const normalized = normalizeValueString(value);

        if (!normalized || Number.isNaN(Number(normalized))) {
            return {
                integerPart: 0,
                decimalPart: 0,
            };
        }

        const [integerString = "0", decimalString = ""] = normalized.split(".");

        const integerPart = parseInt(integerString, 10) || 0;
        const decimalPart = parseInt((decimalString + "00").slice(0, 2), 10) || 0;

        return {
            integerPart,
            decimalPart,
        };
    }

    function buildValueFromParts(integerPart, decimalPart) {
        const safeInteger = Math.max(0, integerPart);
        const safeDecimal = Math.max(0, Math.min(99, decimalPart));

        return `${safeInteger},${String(safeDecimal).padStart(2, "0")}`;
    }

    function getScrollStep(deltaY, deltaTime, mode) {
        const safeDeltaTime = deltaTime <= 0 ? 1 : deltaTime;
        const speed = Math.abs(deltaY) / safeDeltaTime;

        if (mode === "integer") {
            if (speed < 1.5) return 1;
            if (speed < 3) return 5;
            return 10;
        }

        if (speed < 1.5) return 1;
        if (speed < 3) return 5;
        return 10;
    }

    function handleWheelValue(event) {
        const now = performance.now();

        const deltaTime = lastWheelTimeRef.current
            ? now - lastWheelTimeRef.current
            : 999;

        lastWheelTimeRef.current = now;

        const direction = event.deltaY < 0 ? 1 : -1;
        const step = getScrollStep(event.deltaY, deltaTime, valueMode);
        const { integerPart, decimalPart } = splitNumberParts(bulkValue);

        if (valueMode === "integer") {
            const nextInteger = Math.max(0, integerPart + direction * step);

            setBulkValue(buildValueFromParts(nextInteger, decimalPart));
            return;
        }

        let totalCents = integerPart * 100 + decimalPart;
        totalCents = Math.max(0, totalCents + direction * step);

        const nextInteger = Math.floor(totalCents / 100);
        const nextDecimal = totalCents % 100;

        setBulkValue(buildValueFromParts(nextInteger, nextDecimal));
    }

    function handleValueChange(event) {
        const value = event.target.value;

        if (value === "") {
            setBulkValue("");
            return;
        }

        if (!/^\d*([.,]?\d{0,2})?$/.test(value)) return;

        setBulkValue(value);
    }

    function handleApplyBulkValue() {
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
                        selectedMonths.includes(monthIndex)
                            ? normalizedBulkValue
                            : currentValue
                    ),
                };
            })
        );
    }

    function handleClearTable() {
        setRows((prev) =>
            prev.map((row) => ({
                ...row,
                values: row.values.map(() => ""),
            }))
        );
    }

    function resetAllSelections() {
        setBulkValue("");
        setSelectedMonths([]);
        setSelectedYears([]);
    }

    useEffect(() => {
        function handleGlobalWheel(event) {
            if (!isValueFocused) return;
            if (document.activeElement !== inputRef.current) return;

            event.preventDefault();
            handleWheelValue(event);
        }

        window.addEventListener("wheel", handleGlobalWheel, {
            passive: false,
        });

        return () => {
            window.removeEventListener("wheel", handleGlobalWheel);
        };
    }, [isValueFocused, bulkValue, valueMode]);

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-slate-50"
            >
                <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900 sm:text-base">
                        Aggiornamento massivo
                    </div>

                    <div className="mt-0.5 text-xs text-slate-500">
                        Seleziona anni, mesi e applica un valore in blocco
                    </div>
                </div>

                <ChevronDown
                    size={22}
                    className={`shrink-0 text-slate-500 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                    }`}
                />
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        key="bulk-panel-content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                            duration: 0.28,
                            ease: "easeInOut",
                        }}
                        className="overflow-hidden"
                    >
                        <motion.div
                            initial={{ y: -8 }}
                            animate={{ y: 0 }}
                            exit={{ y: -8 }}
                            transition={{
                                duration: 0.22,
                                ease: "easeOut",
                            }}
                            className="border-t border-slate-200 p-3 sm:p-4"
                        >
                            <div className="grid gap-4 xl:grid-cols-[220px_1fr_1fr_auto]">
                                <BulkValueBox
                                    inputRef={inputRef}
                                    bulkValue={bulkValue}
                                    valueMode={valueMode}
                                    setValueMode={setValueMode}
                                    handleValueChange={handleValueChange}
                                    handleClearValue={handleClearValue}
                                    setIsValueFocused={setIsValueFocused}
                                />

                                <SelectionBox
                                    label="Mesi"
                                    onReset={handleClearMonths}
                                    onSelectAll={selectAllMonths}
                                >
                                    <div className="grid min-h-[176px] grid-cols-3 gap-2 rounded-2xl border border-slate-200 bg-slate-50/70 p-3 sm:h-44 sm:grid-cols-4">
                                        {MONTHS.map((month, index) => (
                                            <ToggleButton
                                                key={month}
                                                isActive={selectedMonths.includes(index)}
                                                onClick={() => toggleMonth(index)}
                                            >
                                                {month}
                                            </ToggleButton>
                                        ))}
                                    </div>
                                </SelectionBox>

                                <SelectionBox
                                    label="Anni presenti"
                                    onReset={handleClearYears}
                                    onSelectAll={selectAllYears}
                                    actions={
                                        <div className="flex items-center gap-1">
                                            <IconActionButton
                                                onClick={handleRemoveLastYear}
                                                title="Togli ultimo anno"
                                            >
                                                <MinusCircle size={15} />
                                            </IconActionButton>

                                            <IconActionButton
                                                onClick={handleAddNextYear}
                                                title="Aggiungi anno successivo"
                                            >
                                                <PlusCircle size={15} />
                                            </IconActionButton>
                                        </div>
                                    }
                                >
                                    <div className="grid h-44 content-start grid-cols-2 auto-rows-[40px] gap-2 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50/70 p-3 sm:grid-cols-3">
                                        {rows.map((row) => (
                                            <ToggleButton
                                                key={row.year}
                                                isActive={selectedYears.includes(row.year)}
                                                onClick={() => toggleYear(row.year)}
                                            >
                                                {row.year}
                                            </ToggleButton>
                                        ))}
                                    </div>
                                </SelectionBox>

                                <BulkActions
                                    onResetSelections={resetAllSelections}
                                    onApply={handleApplyBulkValue}
                                    onClearTable={handleClearTable}
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function BulkValueBox({
    inputRef,
    bulkValue,
    valueMode,
    setValueMode,
    handleValueChange,
    handleClearValue,
    setIsValueFocused,
}) {
    return (
        <div>
            <div className="mb-1 flex items-center gap-2">
                <label className="block text-sm font-medium text-slate-700">
                    Valore
                </label>

                <IconActionButton
                    onClick={handleClearValue}
                    title="Reset valore"
                >
                    <Eraser size={15} />
                </IconActionButton>
            </div>

            <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500">
                    €
                </span>

                <input
                    ref={inputRef}
                    type="text"
                    inputMode="decimal"
                    value={bulkValue}
                    onChange={handleValueChange}
                    onFocus={() => setIsValueFocused(true)}
                    onBlur={() => setIsValueFocused(false)}
                    placeholder="0,00"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-slate-200"
                />
            </div>

            <div className="mt-3">
                <div className="mb-2 text-xs font-medium text-slate-500">
                    Incremento scroll
                </div>

                <div className="flex flex-wrap gap-4">
                    <RadioOption
                        id="valueMode-integer"
                        name="valueMode"
                        value="integer"
                        label="Interi"
                        checked={valueMode === "integer"}
                        onChange={(value) => {
                            setValueMode(value);
                            inputRef.current?.focus();
                        }}
                    />

                    <RadioOption
                        id="valueMode-decimal"
                        name="valueMode"
                        value="decimal"
                        label="Decimali"
                        checked={valueMode === "decimal"}
                        onChange={(value) => {
                            setValueMode(value);
                            inputRef.current?.focus();
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

function SelectionBox({
    label,
    onReset,
    onSelectAll,
    actions,
    children,
}) {
    return (
        <div>
            <div className="mb-1 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                    <label className="block text-sm font-medium text-slate-700">
                        {label}
                    </label>

                    <IconActionButton
                        onClick={onReset}
                        title={`Reset ${label.toLowerCase()}`}
                    >
                        <RotateCcw size={15} />
                    </IconActionButton>

                    {actions}
                </div>

                <button
                    type="button"
                    onClick={onSelectAll}
                    className="w-fit text-xs font-medium text-slate-500 transition hover:text-slate-900"
                >
                    Seleziona tutti
                </button>
            </div>

            {children}
        </div>
    );
}

function BulkActions({
    onResetSelections,
    onApply,
    onClearTable,
}) {
    return (
        <div className="flex flex-col justify-end gap-2">
            <button
                type="button"
                onClick={onResetSelections}
                className="inline-flex h-10 w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
            >
                Reset selezioni
            </button>

            <button
                type="button"
                onClick={onApply}
                className="inline-flex h-10 w-full items-center justify-center rounded-xl bg-slate-900 px-5 text-sm font-medium text-white transition hover:bg-slate-800"
            >
                Popola tabella
            </button>

            <button
                type="button"
                onClick={onClearTable}
                className="inline-flex h-10 w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
            >
                Pulisci tabella
            </button>
        </div>
    );
}

function ToggleButton({
    isActive,
    onClick,
    children,
}) {
    const className = isActive
        ? "border-blue-200 bg-blue-50 text-blue-700 shadow-sm"
        : "border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-100 hover:text-slate-900";

    return (
        <button
            type="button"
            onClick={onClick}
            className={`h-10 rounded-full border px-3 text-xs font-semibold transition sm:px-4 sm:text-sm ${className}`}
        >
            {children}
        </button>
    );
}

function IconActionButton({
    onClick,
    title,
    children,
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label={title}
            title={title}
        >
            {children}
        </button>
    );
}

function RadioOption({
    id,
    name,
    value,
    label,
    checked,
    onChange,
}) {
    return (
        <div className="inline-flex items-center gap-1.5 text-sm text-slate-700">
            <input
                id={id}
                type="radio"
                name={name}
                value={value}
                checked={checked}
                onChange={(event) => onChange(event.target.value)}
                className="h-4 w-4 shrink-0 cursor-pointer accent-slate-900"
            />

            <label
                htmlFor={id}
                className="cursor-pointer select-none leading-none"
            >
                {label}
            </label>
        </div>
    );
}