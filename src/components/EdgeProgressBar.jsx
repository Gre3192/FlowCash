export default function EdgeProgressBar({ value = 0, selected = false }) {
    const safeValue = Math.max(0, Math.min(100, value));

    return (
        <div className="pointer-events-none absolute bottom-0 left-0 h-1 w-full overflow-hidden rounded-b-2xl bg-slate-100">
            <div
                className={`h-full transition-all duration-300 ${
                    selected ? "bg-white" : "bg-emerald-500"
                }`}
                style={{ width: `${safeValue}%` }}
            />
        </div>
    );
}