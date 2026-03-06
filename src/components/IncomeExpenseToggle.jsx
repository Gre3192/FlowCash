
export default function IncomeExpenseToggle({
    mode,
    data,
    setActiveKeys,
    setMode
}) {

    const expandAll = () => setActiveKeys(data.map((_, i) => String(i)));
    const collapseAll = () => setActiveKeys([]);

    return (

        <div className="relative flex bg-white/60 backdrop-blur rounded-lg p-1 shadow-inner">
            <button
                className={`px-4 py-1 text-sm font-medium rounded-md transition-all duration-200 ${mode === 'expense'
                    ? 'bg-slate-800 text-white shadow'
                    : 'text-slate-700 hover:bg-white/70'
                    }`}
                onClick={() => setMode('expense')}
            >
                Uscite
            </button>
            <button
                className={`px-4 py-1 text-sm font-medium rounded-md transition-all duration-200 ${mode === 'budget'
                    ? 'bg-slate-800 text-white shadow'
                    : 'text-slate-700 hover:bg-white/70'
                    }`}
                onClick={() => setMode('budget')}
            >
                Bilancio
            </button>

            <button
                className={`px-4 py-1 text-sm font-medium rounded-md transition-all duration-200 ${mode === 'income'
                    ? 'bg-slate-800 text-white shadow'
                    : 'text-slate-700 hover:bg-white/70'
                    }`}
                onClick={() => setMode('income')}
            >
                Entrate
            </button>
        </div>
    )

}