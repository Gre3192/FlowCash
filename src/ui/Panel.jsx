import cn from "../utils/cn";
import { UI_VARIANTS } from "./theme/variants";

export default function Panel({
    children,
    variant = "default",
    className,
    ...props
}) {
    return (
        <section
            className={cn(
                "flex min-h-0 flex-col overflow-hidden rounded-xl border",
                UI_VARIANTS.panel[variant] || UI_VARIANTS.panel.default,
                className
            )}
            {...props}
        >
            {children}
        </section>
    );
}