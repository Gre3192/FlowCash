import { LoaderCircle } from "lucide-react";
import cn from "../utils/cn";
import { UI_VARIANTS } from "./theme/variants";

export default function IconButton({
    icon: Icon,
    variant = "default",
    size = "md",
    title,
    className,
    type = "button",
    onClick,
    loading = false,
    disabled = false,
    ...props
}) {
    const currentSize =
        UI_VARIANTS.iconButtonSize[size] || UI_VARIANTS.iconButtonSize.md;

    const isDisabled = disabled || loading;

    return (
        <button
            type={type}
            title={title}
            onClick={onClick}
            disabled={isDisabled}
            className={cn(
                "inline-flex cursor-pointer items-center justify-center rounded-lg transition disabled:cursor-not-allowed disabled:opacity-50",
                UI_VARIANTS.iconButton[variant] ||
                    UI_VARIANTS.iconButton.default,
                currentSize.button,
                className
            )}
            {...props}
        >
            {loading ? (
                <LoaderCircle
                    size={currentSize.icon}
                    className="animate-spin"
                />
            ) : (
                Icon && <Icon size={currentSize.icon} />
            )}
        </button>
    );
}