import { useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";

export default function CardMenu({
    items = [],
    dark = false,
    isOpen = false,
    onToggle,
    anchor = "button",
    contextPosition = { x: 0, y: 0 },
}) {
    const rootRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (!rootRef.current?.contains(event.target)) {
                onToggle?.(false);
            }
        }

        function handleKeyDown(event) {
            if (event.key === "Escape") {
                onToggle?.(false);
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onToggle]);

    const menuClassName = anchor === "context"
        ? "fixed z-[100] min-w-[140px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg"
        : "absolute right-0 top-8 z-30 min-w-[140px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg";

    return (
        <div ref={rootRef}>
            <div
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    onToggle?.(!isOpen, { anchor: "button" });
                }}
                className={`rounded-md transition cursor-pointer ${dark
                    ? "bg-white/10 text-white hover:bg-white/15"
                    : "bg-transparent text-slate-600 hover:bg-slate-100"
                    }`}
            >
                <MoreVertical size={14} />
            </div>

            {isOpen && (
                <div
                    className={menuClassName}
                    style={anchor === "context" ? { left: contextPosition.x, top: contextPosition.y, } : undefined}
                >
                    {items.map((item) => (
                        <button
                            key={item.label}
                            type="button"
                            onClick={() => { onToggle?.(false); item.onClick?.() }}
                            className={`flex w-full items-center cursor-pointer gap-2 px-3 py-2 text-left text-xs transition ${item.danger
                                ? "text-red-600 hover:bg-red-50"
                                : "text-slate-700 hover:bg-slate-50"
                                }`}
                        >
                            <item.icon size={13} />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
