import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MoreVertical } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const MENU_WIDTH = 180;
const GAP = 8;
const PADDING = 12;

export default function MoreActionsMenu({
    item,
    actions = [],
    buttonClassName = "",
    menuClassName = "",
}) {
    const buttonRef = useRef(null);
    const menuRef = useRef(null);

    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });

    function updatePosition() {
        const button = buttonRef.current;
        if (!button) return;

        const rect = button.getBoundingClientRect();
        const menuHeight = menuRef.current?.offsetHeight ?? actions.length * 40 + 8;
        const openAbove = window.innerHeight - rect.bottom < menuHeight + GAP && rect.top > menuHeight + GAP;
        const top = openAbove ? rect.top - menuHeight - GAP : rect.bottom + GAP;
        const left = rect.right - MENU_WIDTH;

        setPosition({
            top: Math.max(PADDING, Math.min(top, window.innerHeight - menuHeight - PADDING)),
            left: Math.max(PADDING, Math.min(left, window.innerWidth - MENU_WIDTH - PADDING)),
        });
    }

    function toggleMenu(e) {
        e.preventDefault();
        e.stopPropagation();
        setIsOpen((prev) => !prev);
    }

    async function handleActionClick(e, action) {
        e.preventDefault();
        e.stopPropagation();

        if (action.disabled) return;

        await action.onClick?.(item, e);

        if (action.closeOnClick !== false) {
            setIsOpen(false);
        }
    }

    useEffect(() => {
        if (!isOpen) return;

        updatePosition();

        function handleClickOutside(e) {
            if (
                buttonRef.current?.contains(e.target) ||
                menuRef.current?.contains(e.target)
            ) {
                return;
            }
            setIsOpen(false);
        }

        document.addEventListener("mousedown", handleClickOutside);
        window.addEventListener("scroll", updatePosition, true);
        window.addEventListener("resize", updatePosition);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("scroll", updatePosition, true);
            window.removeEventListener("resize", updatePosition);
        };
    }, [isOpen, actions.length]);

    return (
        <>
            <button
                ref={buttonRef}
                type="button"
                onClick={toggleMenu}
                className={`
                    flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center 
                    rounded-lg text-slate-400 transition 
                    hover:bg-slate-100 hover:text-slate-600
                    ${buttonClassName}
                `}
            >
                <MoreVertical size={17} />
            </button>

            {createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            ref={menuRef}
                            initial={{ opacity: 0, scale: 0.95, y: -6 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -6 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                position: "fixed",
                                top: position.top,
                                left: position.left,
                                width: MENU_WIDTH,
                                maxHeight: `calc(100vh - ${PADDING * 2}px)`,
                                overflowY: "auto",
                            }}
                            className={`z-9999 origin-top-right rounded-xl border border-slate-200 bg-white py-1 shadow-xl ${menuClassName}`}
                        >
                            {actions.map((action) => {

                                const Icon = action.icon;

                                return (
                                    <button
                                        key={action.label}
                                        type="button"
                                        disabled={action.disabled}
                                        onClick={(e) => handleActionClick(e, action)}
                                        className={`
                                            flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition
                                            ${action.variant === "danger" ? "text-red-600 hover:bg-red-50" : "text-slate-700 hover:bg-slate-50"}
                                            ${action.disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
                                        `}
                                    >
                                        {Icon && <Icon size={16} />}
                                        <span>{action.label}</span>
                                    </button>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
}