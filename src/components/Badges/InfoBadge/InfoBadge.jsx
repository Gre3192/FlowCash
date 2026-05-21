export default function InfoBadge({
    label,
    children,
    variant = "default",
    size = "xs",
    className = "",
}) {
    const variants = {
        default: "border-slate-200 bg-slate-50 text-slate-600 group-hover:bg-white",
        income: "border-emerald-200 bg-emerald-50 text-emerald-700",
        expense: "border-red-200 bg-red-50 text-red-700",
        warning: "border-amber-200 bg-amber-50 text-amber-700",
        blue: "border-blue-200 bg-blue-50 text-blue-700",
    };

    const sizes = {
        xs: "px-1.5 py-0.5 text-[10px]",
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-1 text-sm",
    };

    const content = children ?? label;

    if (!content && content !== 0) return null;

    return (
        <span
            className={`
                inline-flex shrink-0 items-center rounded-full border
                font-medium leading-none transition-colors duration-200
                ${variants[variant] || variants.default}
                ${sizes[size] || sizes.xs}
                ${className}
            `}
        >
            {content}
        </span>
    );
}