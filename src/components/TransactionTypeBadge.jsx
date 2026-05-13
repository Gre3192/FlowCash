import {
    ArrowDownLeft,
    ArrowUpRight,
} from "lucide-react";

export default function TransactionTypeBadge({
    type,
    className = "",
}) {
    const isIncome = type === "Income";

    const TypeIcon = isIncome ? ArrowDownLeft : ArrowUpRight;
    const typeLabel = isIncome ? "Entrata" : "Uscita";

    return (
        <span
            className={`
                inline-flex shrink-0 items-center gap-1 rounded-full border px-1.5 py-0.5
                text-[10px] font-medium leading-none
                ${isIncome
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-red-200 bg-red-50 text-red-700"
                }
                ${className}
            `}
        >
            <TypeIcon size={11} />
            {typeLabel}
        </span>
    );
}