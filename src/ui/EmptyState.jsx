import cn from "../utils/cn";

export default function EmptyState({
    text = "Nessun dato disponibile",
    className,
}) {
    return (
        <div
            className={cn(
                "rounded-lg border border-dashed border-slate-300 p-4 text-center text-xs text-slate-500",
                className
            )}
        >
            {text}
        </div>
    );
}