import cn from "../utils/cn";
import { UI_VARIANTS } from "./theme/variants";

export default function Input({
    label,
    error,
    className,
    inputClassName,
    ...props
}) {
    return (
        <div className={className}>
            {label && (
                <label className="mb-1 block text-xs font-medium text-slate-600">
                    {label}
                </label>
            )}

            <input
                className={cn(
                    "w-full rounded-xl border px-3 py-2 text-sm outline-none transition focus:ring-2",
                    error
                        ? UI_VARIANTS.input.error
                        : UI_VARIANTS.input.default,
                    inputClassName
                )}
                {...props}
            />

            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
}