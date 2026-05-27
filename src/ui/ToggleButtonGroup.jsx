import { motion } from "framer-motion";

export default function ToggleButtonGroup({
    options = [],
    value,
    onChange,
    size = "sm",
    className = "",
    disabled = false,
}) {
    const sizes = {
        xs: {
            wrapper: "p-0.5",
            button: "px-2 py-1 text-[11px]",
            icon: 13,
        },
        sm: {
            wrapper: "p-0.5",
            button: "px-2.5 py-1.5 text-xs",
            icon: 14,
        },
        md: {
            wrapper: "p-1",
            button: "px-3 py-2 text-sm",
            icon: 16,
        },
    };

    const selectedSize = sizes[size] || sizes.sm;

    return (
        <div
            className={`
                inline-flex shrink-0 items-center rounded-xl border border-slate-200 
                bg-slate-50 ${selectedSize.wrapper}
                ${className}
            `}
        >
            {options.map((option) => {
                const isSelected = option.value === value;
                const isDisabled = disabled || option.disabled;
                const Icon = option.icon;

                const selectedColor = option.selectedColor || "text-slate-900";
                const color =
                    option.color || "text-slate-400 hover:text-slate-600";

                const buttonColorClass = isSelected ? selectedColor : color;

                return (
                    <button
                        key={option.value}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => {
                            if (isDisabled) return;
                            onChange?.(option.value);
                        }}
                        className={`
                            relative inline-flex items-center justify-center gap-1.5
                            rounded-lg font-medium transition-colors duration-200
                            ${selectedSize.button}
                            ${buttonColorClass}
                            ${
                                isDisabled
                                    ? "cursor-not-allowed opacity-65"
                                    : "cursor-pointer"
                            }
                        `}
                    >
                        {isSelected && (
                            <motion.span
                                layoutId="toggle-button-active-bg"
                                className="absolute inset-0 rounded-lg bg-white shadow-sm"
                                transition={{
                                    type: "spring",
                                    stiffness: 450,
                                    damping: 35,
                                }}
                            />
                        )}

                        {Icon && (
                            <Icon
                                size={selectedSize.icon}
                                className="relative z-10"
                            />
                        )}

                        <span className="relative z-10">
                            {option.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}