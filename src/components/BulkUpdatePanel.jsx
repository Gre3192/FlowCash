import { useState } from "react"


const MONTHS = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];


export default function BulkUpdatePanel({ rows, setRows }) {

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


    return (
        <div className="mb-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
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


                    <div className="grid grid-cols-4 gap-2 h-40 rounded-xl border border-zinc-200 p-3">
                        {MONTHS.map((month, index) => (
                            <label
                                key={month}
                                className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-zinc-50"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedMonths.includes(index)}
                                    onChange={() => toggleMonth(index)}
                                    className="h-4 w-4 rounded border-zinc-300"
                                />
                                <span className="text-sm text-zinc-700">{month}</span>
                            </label>
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

                    <div className="grid h-40 grid-cols-3 gap-2 overflow-y-auto rounded-xl border border-zinc-200 p-3">
                        {rows.map((row) => (
                            <label
                                key={row.year}
                                className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-zinc-50"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedYears.includes(row.year)}
                                    onChange={() => toggleYear(row.year)}
                                    className="h-4 w-4 rounded border-zinc-300"
                                />
                                <span className="text-sm text-zinc-700">{row.year}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex items-center">
                    <button
                        type="button"
                        onClick={handleApplyBulkValue}
                        className="inline-flex h-10 items-center justify-center rounded-xl bg-black px-5 text-sm font-medium text-white transition hover:bg-zinc-800"
                    >
                        Aggiungi
                    </button>
                </div>
            </div>
        </div>
    )
}