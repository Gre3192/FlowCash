import React, { useMemo } from "react";

const MONTHS = [
    "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
    "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre",
];

const euro = (value) =>
    new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(
        Number(value || 0)
    );

const sum = (arr) => arr.reduce((acc, v) => acc + (Number(v) || 0), 0);

const Cell = ({ children, className = "" }) => (
    <td className={`px-3 py-2 text-right align-middle ${className}`}>{children}</td>
);

const RowLabel = ({ children, className = "" }) => (
    <td className={`px-3 py-2 text-left align-middle font-medium whitespace-nowrap sticky left-0 bg-white/90 backdrop-blur border-r border-slate-200 ${className}`}>
        {children}
    </td>
);

export default function BudgetSummaryTableCard({
    title = "BILANCIO 2026",
    savingsLabel = "Portafoglio risparmi",
    savingsValue = 0,

    // dati: array da 12 valori (uno per mese)
    startMonthHyp = Array(12).fill(0),
    income = Array(12).fill(0),
    expenses = Array(12).fill(0),

    // opzionali
    endMonthReal = Array(12).fill(null), // null => cella vuota
}) {
    const computed = useMemo(() => {
        const start = startMonthHyp.map((v) => Number(v) || 0);
        const inc = income.map((v) => Number(v) || 0);
        const out = expenses.map((v) => Number(v) || 0);

        const savingHyp = inc.map((v, i) => v - out[i]); // risparmio ipotetico mese
        const endHyp = start.map((v, i) => v + savingHyp[i]); // fine mese ipotetico

        const endReal = (endMonthReal || []).map((v) =>
            v === null || v === undefined || v === "" ? null : Number(v)
        );

        const surplus = endReal.map((v, i) => (v === null ? null : v - endHyp[i]));

        const year = {
            start: sum(start),
            inc: sum(inc),
            out: sum(out),
            saving: sum(savingHyp),
            endHyp: sum(endHyp),
            endReal: endReal.some((v) => v !== null) ? sum(endReal.filter((v) => v !== null)) : null,
            surplus:
                surplus.some((v) => v !== null) ? sum(surplus.filter((v) => v !== null)) : null,
        };

        return { start, inc, out, savingHyp, endHyp, endReal, surplus, year };
    }, [startMonthHyp, income, expenses, endMonthReal]);

    const headerCell =
        "px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 text-right";
    const headerLabelCell =
        "px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 text-left sticky left-0 bg-white/90 backdrop-blur border-r border-slate-200";

    return (
        <div className="w-full">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                {/* Header card */}
                {/* <div className="flex flex-col gap-2 px-5 py-4 border-b border-slate-200">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-bold tracking-tight text-slate-900">
                                {title}
                            </h2>
                            <p className="text-sm text-slate-500">
                                Riepilogo mensile (ipotetico / reale)
                            </p>
                        </div>

                        <div className="text-right">
                            <div className="text-xs font-medium text-slate-500">
                                {savingsLabel}:
                            </div>
                            <div className="text-sm font-semibold text-slate-900">
                                {euro(savingsValue)}
                            </div>
                        </div>
                    </div>
                </div> */}

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-275 w-full border-separate border-spacing-0">
                        <thead>
                            <tr className="bg-slate-50">
                                <th className={headerLabelCell}></th>
                                {MONTHS.map((m) => (
                                    <th key={m} className={headerCell}>
                                        {m}
                                    </th>
                                ))}
                                <th className={`${headerCell} pr-4`}>ALL&apos;ANNO</th>
                            </tr>
                        </thead>

                        <tbody className="text-sm">
                            {/* Inizio mese ipotetico */}
                            <tr className="border-b border-slate-100">
                                <RowLabel className="text-slate-700">Inizio mese ipotetico</RowLabel>
                                {computed.start.map((v, i) => (
                                    <Cell key={i} className="text-slate-700">
                                        {euro(v)}
                                    </Cell>
                                ))}
                                <Cell className="font-semibold text-slate-900 pr-4">{euro(computed.year.start)}</Cell>
                            </tr>

                            {/* Entrate */}
                            <tr className="border-b border-slate-100">
                                <RowLabel className="text-emerald-800">Entrate</RowLabel>
                                {computed.inc.map((v, i) => (
                                    <Cell key={i} className="text-emerald-700">
                                        {euro(v)}
                                    </Cell>
                                ))}
                                <Cell className="font-semibold text-emerald-800 pr-4">{euro(computed.year.inc)}</Cell>
                            </tr>

                            {/* Uscite */}
                            <tr className="border-b border-slate-100">
                                <RowLabel className="text-rose-800">Uscite</RowLabel>
                                {computed.out.map((v, i) => (
                                    <Cell key={i} className="text-rose-700">
                                        {euro(v)}
                                    </Cell>
                                ))}
                                <Cell className="font-semibold text-rose-800 pr-4">{euro(computed.year.out)}</Cell>
                            </tr>

                            {/* Risparmio ipotetico */}
                            <tr className="border-b border-slate-100">
                                <RowLabel className="text-slate-700">Risparmio ipotetico</RowLabel>
                                {computed.savingHyp.map((v, i) => (
                                    <Cell key={i} className={v >= 0 ? "text-emerald-700" : "text-rose-700"}>
                                        {euro(v)}
                                    </Cell>
                                ))}
                                <Cell
                                    className={`font-semibold pr-4 ${computed.year.saving >= 0 ? "text-emerald-800" : "text-rose-800"
                                        }`}
                                >
                                    {euro(computed.year.saving)}
                                </Cell>
                            </tr>

                            {/* Fine mese ipotetico */}
                            <tr className="border-b border-slate-200 bg-slate-50/60">
                                <RowLabel className="text-slate-900">Fine mese ipotetico</RowLabel>
                                {computed.endHyp.map((v, i) => (
                                    <Cell key={i} className="text-slate-900">
                                        {euro(v)}
                                    </Cell>
                                ))}
                                <Cell className="font-semibold text-slate-900 pr-4">{euro(computed.year.endHyp)}</Cell>
                            </tr>

                            {/* Separatore leggero */}
                            <tr>
                                <td colSpan={14} className="h-2 bg-white"></td>
                            </tr>

                            {/* Fine mese reale */}
                            <tr className="border-b border-slate-100">
                                <RowLabel className="text-slate-700">Fine mese reale</RowLabel>
                                {computed.endReal.map((v, i) => (
                                    <Cell key={i} className="text-slate-700">
                                        {v === null ? <span className="text-slate-300">—</span> : euro(v)}
                                    </Cell>
                                ))}
                                <Cell className="font-semibold text-slate-900 pr-4">
                                    {computed.year.endReal === null ? <span className="text-slate-300">—</span> : euro(computed.year.endReal)}
                                </Cell>
                            </tr>

                            {/* Surplus (Reale - Ipotetico) */}
                            <tr>
                                <RowLabel className="text-slate-700">
                                    Surplus fine mese <span className="italic font-normal">(Reale - Ipotetico)</span>
                                </RowLabel>
                                {computed.surplus.map((v, i) => (
                                    <Cell key={i} className="text-slate-700">
                                        {v === null ? <span className="text-slate-300">—</span> : euro(v)}
                                    </Cell>
                                ))}
                                <Cell className="font-semibold text-slate-900 pr-4">
                                    {computed.year.surplus === null ? <span className="text-slate-300">—</span> : euro(computed.year.surplus)}
                                </Cell>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="px-5 py-3 border-t border-slate-200 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
                    <div className="text-xs text-slate-500">
                        Tip: su mobile scorri orizzontalmente la tabella.
                    </div>
                    <div className="text-xs text-slate-500">
                        Formato valuta: <span className="font-medium">it-IT</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * ESEMPIO USO
 *
 * <BudgetSummaryTableCard
 *   savingsValue={0}
 *   startMonthHyp={[0, 4551.34, 4690.8, 2328.98, 2136.77, 2154.76, 1962.55, 1930.64, 1313.43, 1331.42, 1139.21, 1139.21]}
 *   income={[0, 1672, 1400, 1400, 1400, 1400, 1400, 1400, 1400, 1400, 1400, 2700]}
 *   expenses={[0, 1532.54, 3761.82, 1592.21, 1382.01, 1592.21, 1431.91, 2017.21, 1382.01, 1592.21, 1382.01, 1592.21]}
 *   endMonthReal={[4551.34, null, null, null, null, null, null, null, null, null, null, null]}
 * />
 */