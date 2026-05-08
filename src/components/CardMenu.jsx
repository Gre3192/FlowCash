import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { MoreVertical } from "lucide-react";

export default function CardMenu({
    isOpen,
    anchor = "button",
    contextPosition = { x: 0, y: 0 },
    onToggle,
    items = [],
}) {
    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;

        function handleClickOutside(e) {
            const clickedMenu = menuRef.current?.contains(e.target);

            if (!clickedMenu) {
                onToggle?.(false);
            }
        }

        function handleKeyDown(e) {
            if (e.key === "Escape") {
                onToggle?.(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onToggle]);

    function getMenuStyle() {
        if (anchor === "context") {
            return {
                position: "fixed",
                top: contextPosition.y,
                left: contextPosition.x,
            };
        }

        const rect = buttonRef.current?.getBoundingClientRect();

        if (!rect) {
            return {
                position: "fixed",
                top: 0,
                left: 0,
            };
        }

        const menuWidth = 160;
        const viewportPadding = 12;

        let left = rect.right - menuWidth;
        let top = rect.bottom + 6;

        left = Math.max(
            viewportPadding,
            Math.min(left, window.innerWidth - menuWidth - viewportPadding)
        );

        return {
            position: "fixed",
            top,
            left,
        };
    }

    const menu = isOpen ? (
        <div
            ref={menuRef}
            style={getMenuStyle()}
            className="z-10000 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
        >
            {items.map((item, index) => {
                const Icon = item.icon;

                return (
                    <button
                        key={index}
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            item.onClick?.();
                            onToggle?.(false);
                        }}
                        className={`
                            flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-xs transition
                            ${item.danger
                                ? "text-red-600 hover:bg-red-50"
                                : "text-slate-700 hover:bg-slate-50"
                            }
                        `}
                    >
                        {Icon && <Icon size={14} />}
                        {item.label}
                    </button>
                );
            })}
        </div>
    ) : null;

    return (
        <>
            <button
                ref={buttonRef}
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    onToggle?.(!isOpen, {
                        anchor: "button",
                    });
                }}
                className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
                <MoreVertical size={17} />
            </button>

            {createPortal(menu, document.body)}
        </>
    );
}