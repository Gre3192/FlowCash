


export default function EdgeProgressBar({ value = 0, selected = false }) {
    const safeValue = Math.max(0, Math.min(100, value));

    return (
        <div className="pointer-events-none absolute bottom-0 left-0 h-1 w-full overflow-hidden rounded-b-lg">
            <div className={`h-full w-full ${selected ? "bg-white/10" : "bg-slate-100"}`}>
                <div
                    className={`h-full ${selected ? "bg-white" : "bg-slate-900"}`}
                    style={{ width: `${safeValue}%` }}
                />
            </div>
        </div>
    );
}