import { getCategoryColorByType } from "../constants/categoryColors";

export default function ProgressBar({

    currentValue,
    totalValue,
    colorTheme

}) {

    const progress = totalValue > 0 ? Math.min((currentValue / totalValue) * 100, 100) : 0;

    return (
        <div className="mt-1.5 flex items-center gap-2">
            <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div
                    className={`h-full rounded-full ${colorTheme.progressBar} transition-all duration-500`}
                    style={{ width: `${progress}%` }}
                />
            </div>
            <span className="shrink-0 text-[10px] font-medium text-slate-500">
                {progress.toFixed(0)}%
            </span>
        </div>
    )
}