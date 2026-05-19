import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MoreVertical } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function MoreActionsMenu({
    item,
    actions = [],
    buttonClassName = "",
    menuClassName = "",
}) {
    const buttonRef = useRef(null);
    const menuRef = useRef(null);

    const [isOpen, setIsOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState({
        top: 0,
        left: 0,
    });

    function updateMenuPosition() {
        const button = buttonRef.current;
        if (!button) return;

        const rect = button.getBoundingClientRect();

        const menuWidth = 180;
        const viewportPadding = 12;

        let left = rect.right - menuWidth;
        let top = rect.bottom + 8;

        if (left < viewportPadding) {
            left = viewportPadding;
        }

        if (left + menuWidth > window.innerWidth - viewportPadding) {
            left = window.innerWidth - menuWidth - viewportPadding;
        }

        setMenuPosition({
            top,
            left,
        });
    }

    function handleButtonClick(e) {
        e.stopPropagation();

        if (!isOpen) {
            updateMenuPosition();
        }

        setIsOpen((prev) => !prev);
    }

    function handleActionClick(e, action) {
        e.stopPropagation();

        if (action.disabled) return;

        action.onClick?.(item);
        setIsOpen(false);
    }

    useEffect(() => {
        function handleClickOutside(e) {
            const button = buttonRef.current;
            const menu = menuRef.current;

            if (
                button?.contains(e.target) ||
                menu?.contains(e.target)
            ) {
                return;
            }

            setIsOpen(false);
        }

        function handleScrollOrResize() {
            if (!isOpen) return;
            updateMenuPosition();
        }

        document.addEventListener("mousedown", handleClickOutside);
        window.addEventListener("scroll", handleScrollOrResize, true);
        window.addEventListener("resize", handleScrollOrResize);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("scroll", handleScrollOrResize, true);
            window.removeEventListener("resize", handleScrollOrResize);
        };
    }, [isOpen]);

    const menu = (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    ref={menuRef}
                    initial={{
                        opacity: 0,
                        scale: 0.95,
                        y: -6,
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        y: 0,
                    }}
                    exit={{
                        opacity: 0,
                        scale: 0.95,
                        y: -6,
                    }}
                    transition={{
                        duration: 0.15,
                        ease: "easeOut",
                    }}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        position: "fixed",
                        top: menuPosition.top,
                        left: menuPosition.left,
                        width: 180,
                    }}
                    className={`
                        z-[9999] origin-top-right overflow-hidden 
                        rounded-xl border border-slate-200 bg-white py-1 
                        shadow-xl
                        ${menuClassName}
                    `}
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
                                    flex w-full items-center gap-2 px-3 py-2 text-left text-sm
                                    transition
                                    ${
                                        action.variant === "danger"
                                            ? "text-red-600 hover:bg-red-50"
                                            : "text-slate-700 hover:bg-slate-50"
                                    }
                                    ${
                                        action.disabled
                                            ? "cursor-not-allowed opacity-50"
                                            : "cursor-pointer"
                                    }
                                `}
                            >
                                {Icon && <Icon size={16} />}
                                <span>{action.label}</span>
                            </button>
                        );
                    })}
                </motion.div>
            )}
        </AnimatePresence>
    );

    return (
        <>
            <button
                ref={buttonRef}
                type="button"
                onClick={handleButtonClick}
                className={`
                    flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center 
                    rounded-lg text-slate-400 transition 
                    hover:bg-slate-100 hover:text-slate-600
                    ${buttonClassName}
                `}
            >
                <MoreVertical size={17} />
            </button>

            {createPortal(menu, document.body)}
        </>
    );
}