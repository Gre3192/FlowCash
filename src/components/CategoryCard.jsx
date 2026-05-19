function CategoryCard({
    category,
    colorTheme,
    progress,
    categoryCurrentTotal,
    categoryBudgetTotal,
    transactions,
    onExpand,
}) {

    return (
        <button
            type="button"
            onClick={onExpand}
            className={`group flex w-full cursor-pointer items-center gap-3 rounded-xl border border-l-4 border-slate-200 ${colorTheme.border} bg-white px-3 py-3 text-left shadow-sm transition-all hover:shadow-md ${colorTheme.borderHover} sm:px-4`}
        >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${colorTheme.iconBg} ${colorTheme.iconColor} transition-transform group-hover:scale-105`}>
                <FolderOpen size={18} />
            </div>

            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-semibold text-slate-900">
                        {category.name}
                    </span>
                    <span className={`shrink-0 rounded-full ${colorTheme.bg} px-1.5 py-0.5 text-[10px] font-medium ${colorTheme.iconColor}`}>
                        {transactions.length}
                    </span>
                    <span className="ml-auto flex shrink-0 items-center gap-1 text-[11px] text-slate-500">
                        <span>{formatCurrency(categoryCurrentTotal)}</span>
                        <span className="text-slate-300">/</span>
                        <span>{formatCurrency(categoryBudgetTotal)}</span>
                    </span>
                </div>

                <ProgressBar currentValue={categoryCurrentTotal} totalValue={categoryBudgetTotal}/>
                
            </div>
            <ChevronRight
                size={18}
                className="shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-500"
            />
        </button>
    );
}