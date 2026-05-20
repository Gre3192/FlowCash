export default function EdgeProgressBar({ value = 0, selected = false }) {
    const numericValue = Number(value) || 0;
    const safeValue = Math.max(0, Math.min(100, numericValue));

    function getProgressColor(value) {
        if (selected) return "bg-white";

        if (value > 100) return "bg-red-500";
        if (value === 100) return "bg-emerald-500";
        if (value >= 70) return "bg-blue-600";
        if (value >= 40) return "bg-blue-400";

        return "bg-sky-300";
    }

    const progressColor = getProgressColor(numericValue);

    return (
        <div className="pointer-events-none absolute bottom-0 left-0 h-1 w-full overflow-hidden rounded-b-2xl bg-slate-100">
            <div
                className={`h-full transition-all duration-300 ${progressColor}`}
                style={{ width: `${safeValue}%` }}
            />
        </div>
    );
}