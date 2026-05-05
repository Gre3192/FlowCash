import cn from "../utils/cn";

export default function LoadingState({
    text = "Caricamento...",
    className,
}) {
    return (
        <div
            className={cn(
                "flex h-full min-h-45 items-center justify-center",
                className
            )}
        >
            <div className="flex flex-col items-center gap-2">
                <div className="h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-slate-700" />

                <span className="text-xs text-slate-500">{text}</span>
            </div>
        </div>
    );
}