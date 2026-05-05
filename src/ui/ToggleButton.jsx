import cn from "../utils/cn";
import { UI_VARIANTS } from "./theme/variants";

export default function ToggleButton({
    children,
    active = false,
    variant = "default",
    size = "md",
    icon: Icon,
    className,
    type = "button",
    ...props
}) {
    const currentVariant =
        UI_VARIANTS.toggleButton[variant] ||
        UI_VARIANTS.toggleButton.default;

    return (
        <button
            type={type}
            aria-pressed={active}
            className={cn(
                "inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border font-medium transition disabled:cursor-not-allowed disabled:opacity-50",
                active ? currentVariant.active : currentVariant.inactive,
                UI_VARIANTS.toggleButtonSize[size] ||
                    UI_VARIANTS.toggleButtonSize.md,
                className
            )}
            {...props}
        >
            {Icon && <Icon size={size === "sm" ? 14 : 16} />}
            {children}
        </button>
    );
}