
import { Calendar, TrendingUp, TrendingDown } from 'lucide-react';

export default function MonthCard({

    monthName,
    startValue,
    entryValue,
    exitValue,

}) {

    const formatEuro = (val) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(val);

    const endValue = startValue + entryValue - exitValue;
    const isPositive = endValue > 0;

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border  border-slate-100 hover:shadow-md transition-shadow group cursor-pointer">
            <div className="flex justify-between items-center mb-6">
                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold uppercase">
                    {monthName}
                </span>
                <Calendar size={18} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
            </div>

            {/* Sezione Cifre Principali */}
            <div className="space-y-4">
                <div className="flex justify-between items-end">
                    <div className="text-slate-400 text-xs font-medium">Saldo inizio mese</div>
                    <div className="font-semibold text-slate-700">{formatEuro(startValue)}</div>
                </div>

                <div className="py-4 border-y border-slate-50 space-y-3">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-emerald-600 font-medium">
                            <TrendingUp size={16} /> <span className="text-sm">Entrate</span>
                        </div>
                        <span className="font-bold">+{formatEuro(entryValue)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-rose-500 font-medium">
                            <TrendingDown size={16} /> <span className="text-sm">Uscite</span>
                        </div>
                        <span className="font-bold">-{formatEuro(endValue)}</span>
                    </div>
                </div>

                {/* Saldo Finale - Risultato Logico */}
                {/* <div className="text-[10px] uppercase font-black text-slate-400 mb-1">Saldo fine mese</div> */}
                <div>
                    <div className="text-slate-400 text-xs font-medium">Saldo fine mese</div>
                    <div className={`mt-2 p-3 rounded-2xl ${isPositive ? 'bg-emerald-50' : 'bg-rose-50'} transition-colors`}>
                        <div className={`text-lg font-black ${isPositive ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {formatEuro(endValue)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}