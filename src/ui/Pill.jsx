import cn from "../utils/cn";
import { UI_VARIANTS } from "./theme/variants";

export default function Pill({
    children,
    icon: Icon,
    variant = "neutral",
    className,
}) {
    return (
        <span
            className={cn(
                "inline-flex shrink-0 items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-medium leading-none",
                UI_VARIANTS.pill[variant] || UI_VARIANTS.pill.neutral,
                className
            )}
        >
            {Icon && <Icon size={11} />}
            {children}
        </span>
    );
}