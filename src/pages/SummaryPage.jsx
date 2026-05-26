import { useEffect, useMemo, useRef, useState } from "react";
import { Wallet, TrendingUp, TrendingDown, PiggyBank, Pencil, Lock, ChevronDown } from "lucide-react";
import formatCurrency from "../utils/formatCurrency";
import { useGet } from "../hooks/useGet";
import { API_ENDPOINTS } from "../api/endpoint";
import toNumber from "../utils/toNumber";
import SummaryTable from "../components/SummaryTable/SummaryTable";



export default function YearBalanceSummaryPage({ selectedYear = 2029 }) {

    const { data, loading, error } = useGet(
        API_ENDPOINTS.annualSummary({ year: selectedYear }),
        { delayMs: 0 }
    );

    const totals = useMemo(() => {
        const months = data?.months ?? []
        const income = months.reduce((sum, month) => sum + (toNumber(month.income_total) ?? 0), 0);
        const expense = months.reduce((sum, month) => sum + (toNumber(month.expense_total) ?? 0), 0);
        const saving = months.reduce((sum, month) => sum + (toNumber(month.hypothetical_saving) ?? 0), 0);
        const balance = income - expense;

        return {
            income,
            expense,
            saving,
            balance,
            progress: saving > 0 ? Math.min((balance / saving) * 100, 100) : 0,
        };
    }, [data]);


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
                                Andamento {data?.year}
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
                        <SummaryTable monthsData={data?.months} />
                    </div>
                </section>
            </div>
        </div>
    );
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