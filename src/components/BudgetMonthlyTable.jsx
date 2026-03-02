import React, { useMemo } from "react";
import euro from "../utils/formatEuro";
import sumArray from "../utils/sumArray";
import CustomInput from "./CustomInput";

const Cell = ({ children, className = "" }) => (
    <td className={`px-2 py-2 text-right align-middle ${className}`}>{children}</td>
);

const RowLabel = ({ children, className = "" }) => (
    <td className={`px-3 py-2 text-left align-middle font-medium whitespace-nowrap sticky left-0 bg-white/90 backdrop-blur border-r border-slate-200 ${className}`}>
        {children}
    </td>
);

export default function BudgetSummaryTableCard({

    monthsLabels,
    data,

    // dati: array da 12 valori (uno per mese)
    startMonthHyp = Array(12).fill(0),
    income = Array(12).fill(0),
    expenses = Array(12).fill(0),

    // opzionali
    endMonthReal = Array(12).fill(null), // null => cella vuota

}) {

    const getMonthlyTotals = (data) => {
        const monthlyTotals = Array.from({ length: 12 }, () => ({
            income: 0,
            expenditure: 0,
        }));

        data.forEach(category => {
            const { type, rows } = category;

            rows.forEach(row => {
                row.values.forEach((value, monthIndex) => {
                    monthlyTotals[monthIndex][type] += Number(value) || 0;
                });
            });
        });

        return monthlyTotals;
    };

    const totals = getMonthlyTotals(data);

    const totalIncomeYear = totals.reduce(
        (acc, month) => acc + month.income,
        0
    );

    const totalExpenditureYear = totals.reduce(
        (acc, month) => acc + month.expenditure,
        0
    );


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
            start: sumArray(start),
            inc: sumArray(inc),
            out: sumArray(out),
            saving: sumArray(savingHyp),
            endHyp: sumArray(endHyp),
            endReal: endReal.some((v) => v !== null) ? sumArray(endReal.filter((v) => v !== null)) : null,
            surplus:
                surplus.some((v) => v !== null) ? sumArray(surplus.filter((v) => v !== null)) : null,
        };

        return { start, inc, out, savingHyp, endHyp, endReal, surplus, year };
    }, [startMonthHyp, income, expenses, endMonthReal]);

    const headerCell = "px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 text-right";
    const headerLabelCell = "px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 text-left sticky left-0 bg-white/90 backdrop-blur border-r border-slate-200";

    return (
        <div className="w-full">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-275 w-full border-separate border-spacing-0">
                        <thead>
                            <tr className="bg-slate-50">
                                <th className={headerLabelCell}></th>
                                {monthsLabels.map((m) => (
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
                                <RowLabel className="text-slate-700">Inizio mese</RowLabel>
                                {computed.start.map((v, i) => (
                                    <Cell key={i} className="text-slate-700">
                                        <CustomInput value={32} onChange={() => { }} mode='income' />
                                    </Cell>
                                ))}
                                <Cell className="font-semibold text-slate-900 pr-4">{euro(computed.year.start)}</Cell>
                            </tr>

                            {/* Entrate */}
                            <tr className="border-b border-slate-100">
                                <RowLabel className="text-emerald-800">Entrate</RowLabel>
                                {totals.map((total, i) => (
                                    <Cell key={i} className="text-emerald-700">
                                        {euro(total.income)}
                                    </Cell>
                                ))}
                                <Cell className="font-semibold text-emerald-800 pr-4">{euro(totalIncomeYear)}</Cell>
                            </tr>

                            {/* Uscite */}
                            <tr className="border-b border-slate-100">
                                <RowLabel className="text-rose-800">Uscite</RowLabel>
                                {totals.map((total, i) => (
                                    <Cell key={i} className="text-rose-700">
                                        {euro(total.expenditure)}
                                    </Cell>
                                ))}
                                <Cell className="font-semibold text-rose-800 pr-4">{euro(totalExpenditureYear)}</Cell>
                            </tr>

                            {/* Risparmio ipotetico */}
                            <tr className="border-b border-slate-100">
                                <RowLabel className="text-slate-700">Risparmio</RowLabel>
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
                                <RowLabel className="text-slate-900">Fine mese previsto</RowLabel>
                                {totals.map((total, i) => (
                                    <Cell key={i} className="text-slate-900">
                                        {euro(total.income - total.expenditure)}
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
                                    Surplus fine mese 
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