import cn from "../utils/cn";
import { UI_VARIANTS } from "./theme/variants";

export default function Card({
    children,
    clickable = false,
    selected = false,
    danger = false,
    className,
    ...props
}) {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-xl border transition-all",
                UI_VARIANTS.card.default,
                clickable && "cursor-pointer duration-200 ease-out",
                clickable && UI_VARIANTS.card.hover,
                selected && UI_VARIANTS.card.selected,
                danger && UI_VARIANTS.card.danger,
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}