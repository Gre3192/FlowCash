const PROGRESS_BAR_SIZES = {
    sm: {
        wrapper: "mt-1 flex items-center gap-1.5",
        track: "h-1",
        text: "text-[9px]",
    },
    md: {
        wrapper: "mt-1.5 flex items-center gap-2",
        track: "h-1.5",
        text: "text-[10px]",
    },
    lg: {
        wrapper: "mt-2 flex items-center gap-2.5",
        track: "h-2",
        text: "text-xs",
    },
    xl: {
        wrapper: "mt-2.5 flex items-center gap-3",
        track: "h-3",
        text: "text-sm",
    },
};

export default function ProgressBar({
    currentValue = 0,
    totalValue = 0,
    color = "bg-blue-500",
    size = "md",
    showPercentage = true,
    className = "",
}) {
    const current = Number(currentValue || 0);
    const total = Number(totalValue || 0);

    const progress =
        total > 0
            ? Math.min((current / total) * 100, 100)
            : 0;

    const sizeClasses = PROGRESS_BAR_SIZES[size] || PROGRESS_BAR_SIZES.md;

    return (
        <div className={`${sizeClasses.wrapper} ${className}`}>
            <div className={`${sizeClasses.track} min-w-0 flex-1 overflow-hidden rounded-full bg-slate-100`}  >
                <div
                    className={`h-full rounded-full ${color} transition-all duration-500`}
                    style={{ width: `${progress}%` }}
                />
            </div>

            {showPercentage && (
                <span
                    className={`shrink-0 font-medium text-slate-500 ${sizeClasses.text}`}
                >
                    {progress.toFixed(0)}%
                </span>
            )}
        </div>
    );
}