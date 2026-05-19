import cn from "../utils/cn";
import { UI_VARIANTS } from "./theme/variants";

export default function Button({
    children,
    label,
    icon: Icon,
    iconPosition = "left",
    variant = "primary",
    size = "md",
    className,
    type = "button",
    onClick,
    ...props
}) {
    const content = children ?? label;

    return (
        <button
            type={type}
            onClick={onClick}
            className={cn(
                "inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl font-medium transition disabled:cursor-not-allowed disabled:opacity-50",
                UI_VARIANTS.button[variant] || UI_VARIANTS.button.primary,
                UI_VARIANTS.buttonSize[size] || UI_VARIANTS.buttonSize.md,
                className
            )}
            {...props}
        >
            {Icon && iconPosition === "left" && <Icon size={16} />}

            {content}

            {Icon && iconPosition === "right" && <Icon size={16} />}
        </button>
    );
}