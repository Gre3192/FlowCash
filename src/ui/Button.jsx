import cn from "../utils/cn";
import { UI_VARIANTS } from "./theme/variants";

export default function Button({
    children,
    variant = "primary",
    size = "md",
    className,
    type = "button",
    ...props
}) {
    return (
        <button
            type={type}
            className={cn(
                "inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl font-medium transition disabled:cursor-not-allowed disabled:opacity-50",
                UI_VARIANTS.button[variant] || UI_VARIANTS.button.primary,
                UI_VARIANTS.buttonSize[size] || UI_VARIANTS.buttonSize.md,
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}