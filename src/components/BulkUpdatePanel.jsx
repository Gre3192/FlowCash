import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const MONTHS = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];

export default function BulkUpdatePanel({ rows, setRows }) {
    const [isOpen, setIsOpen] = useState(true);
    const [bulkValue, setBulkValue] = useState("");
    const [selectedMonths, setSelectedMonths] = useState([]);
    const [selectedYears, setSelectedYears] = useState([]);

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

    const handleApplyBulkValue = () => {
        if (bulkValue === "") return;
        if (selectedMonths.length === 0) return;
        if (selectedYears.length === 0) return;

        setRows((prev) =>
            prev.map((row) => {
                if (!selectedYears.includes(row.year)) return row;

                return {
                    ...row,
                    values: row.values.map((currentValue, monthIndex) =>
                        selectedMonths.includes(monthIndex) ? bulkValue : currentValue
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

    const getToggleClass = (isActive) =>
        `h-10 rounded-full border px-4 text-sm font-semibold transition-all duration-200 shadow-sm ${
            isActive
                ? "border-rose-300 bg-rose-100 text-rose-700 shadow-rose-100"
                : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-300 hover:bg-white"
        }`;

    return (
        <div className="mb-4 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="flex w-full items-center justify-between py-3 px-4 text-left transition hover:bg-zinc-50"
            >
                <div>
                    <div className="text-base font-semibold text-zinc-800">Aggiornamento massivo</div>
                    <div className="text-xs text-zinc-500">Seleziona anni, mesi e applica un valore in blocco</div>
                </div>

                <ChevronDown
                    size={18}
                    className={`text-zinc-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
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
                            className="border-t border-zinc-200 p-4"
                        >
                            <div className="grid gap-4 xl:grid-cols-[220px_1fr_1fr_auto]">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-zinc-700">
                                        Valore
                                    </label>
                                    <input
                                        type="number"
                                        inputMode="numeric"
                                        value={bulkValue}
                                        onChange={(e) => setBulkValue(e.target.value)}
                                        placeholder="Es. 25"
                                        className="h-10 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-700 outline-none transition placeholder:text-zinc-400 focus:border-zinc-300 focus:bg-white focus:ring-2 focus:ring-zinc-200"
                                    />
                                </div>

                                <div>
                                    <div className="mb-2 flex items-center justify-between">
                                        <label className="block text-sm font-medium text-zinc-700">
                                            Mesi
                                        </label>
                                        <div className="flex gap-3 text-xs">
                                            <button
                                                type="button"
                                                onClick={selectAllMonths}
                                                className="text-zinc-500 hover:text-zinc-800"
                                            >
                                                Tutti
                                            </button>
                                            <button
                                                type="button"
                                                onClick={clearMonths}
                                                className="text-zinc-500 hover:text-zinc-800"
                                            >
                                                Pulisci
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid h-44 grid-cols-4 gap-2 rounded-2xl border border-zinc-200 bg-zinc-50/60 p-3">
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
                                    <div className="mb-2 flex items-center justify-between">
                                        <label className="block text-sm font-medium text-zinc-700">
                                            Anni presenti
                                        </label>
                                        <div className="flex gap-3 text-xs">
                                            <button
                                                type="button"
                                                onClick={selectAllYears}
                                                className="text-zinc-500 hover:text-zinc-800"
                                            >
                                                Tutti
                                            </button>
                                            <button
                                                type="button"
                                                onClick={clearYears}
                                                className="text-zinc-500 hover:text-zinc-800"
                                            >
                                                Pulisci
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid h-44 grid-cols-3 gap-2 overflow-y-auto rounded-2xl border border-zinc-200 bg-zinc-50/60 p-3">
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

                                <div className="flex flex-col items-center justify-center gap-2">
                                    <button
                                        type="button"
                                        onClick={handleApplyBulkValue}
                                        className="inline-flex h-10 w-full items-center justify-center rounded-xl bg-black px-5 text-sm font-medium text-white transition hover:bg-zinc-800"
                                    >
                                        Aggiungi
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