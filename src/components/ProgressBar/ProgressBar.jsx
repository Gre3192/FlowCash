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
    color,
    size = "md",
    showPercentage = true,
    className = "",
}) {
    const current = Number(currentValue || 0);
    const total = Number(totalValue || 0);

    const rawProgress = total > 0 ? (current / total) * 100 : 0;

    // La larghezza grafica resta massimo 100%
    const progressWidth = Math.max(0, Math.min(rawProgress, 100));

    // Il testo invece può superare 100%
    const displayedProgress = rawProgress.toFixed(1);

    function getProgressColor(value) {
        if (value > 100) return "bg-red-500";
        if (value === 100) return "bg-emerald-500";
        if (value >= 70) return "bg-blue-600";
        if (value >= 40) return "bg-blue-400";

        return "bg-sky-300";
    }

    function getTextColor(value) {
        if (value > 100) return "text-red-600";
        if (value === 100) return "text-emerald-600";
        if (value >= 70) return "text-blue-700";
        if (value >= 40) return "text-blue-500";

        return "text-sky-500";
    }

    const progressColor = color || getProgressColor(rawProgress);
    const percentageColor = getTextColor(rawProgress);

    const sizeClasses = PROGRESS_BAR_SIZES[size] || PROGRESS_BAR_SIZES.md;

    return (
        <div className={`${sizeClasses.wrapper} ${className}`}>
            <div
                className={`
                    ${sizeClasses.track}
                    min-w-0 flex-1 overflow-hidden rounded-full bg-slate-100
                `}
            >
                <div
                    className={`
                        h-full rounded-full transition-all duration-500
                        ${progressColor}
                    `}
                    style={{ width: `${progressWidth}%` }}
                />
            </div>

            {showPercentage && (
                <span
                    className={`
                        shrink-0 font-medium
                        ${percentageColor}
                        ${sizeClasses.text}
                    `}
                >
                    {displayedProgress}%
                </span>
            )}
        </div>
    );
}