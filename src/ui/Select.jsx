import { ChevronDown } from "lucide-react";
import { UI_VARIANTS } from "./../ui/theme/variants";

export default function Select({
    label,
    name,
    value,
    options = [],
    onChange,
    placeholder = "Seleziona...",
    error,
    disabled = false,
    required = false,

    className = "",
    selectClassName = "",

    optionLabelKey = "label",
    optionValueKey = "value",

    size = "md",
}) {
    const sizeClasses = {
        sm: "h-8 px-3 pr-8 text-xs",
        md: "h-10 px-3 pr-9 text-sm",
        lg: "h-11 px-4 pr-10 text-sm",
    };

    const iconSize = {
        sm: 14,
        md: 16,
        lg: 18,
    };

    const selectVariant = error
        ? UI_VARIANTS.select.error
        : UI_VARIANTS.select.default;

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label
                    htmlFor={name}
                    className="mb-1 block text-xs font-medium text-slate-600"
                >
                    {label}
                    {required && <span className="ml-1 text-red-500">*</span>}
                </label>
            )}

            <div className="relative">
                <select
                    id={name}
                    name={name}
                    value={value ?? ""}
                    onChange={onChange}
                    disabled={disabled}
                    className={`
                        w-full appearance-none rounded-xl border outline-none transition
                        focus:ring-2
                        disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400
                        ${sizeClasses[size]}
                        ${selectVariant}
                        ${selectClassName}
                    `}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}

                    {options.map((option) => {
                        const isObject =
                            option !== null && typeof option === "object";

                        const optionValue = isObject
                            ? option[optionValueKey]
                            : option;

                        const optionLabel = isObject
                            ? option[optionLabelKey]
                            : option;

                        return (
                            <option key={optionValue} value={optionValue}>
                                {optionLabel}
                            </option>
                        );
                    })}
                </select>

                <ChevronDown
                    size={iconSize[size]}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
            </div>

            {error && (
                <p className="mt-1 text-xs text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
}