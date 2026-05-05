import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import cn from "../utils/cn";
import { UI_VARIANTS } from "./theme/variants";

export default function ModalWrapper({
    isOpen,
    onClose,
    title,
    children,
    size = "md",
    width,
    height,
    animation = "scale",
    bodyClassName,
    className,
}) {
    useEffect(() => {
        if (!isOpen) return;

        function handleKeyDown(e) {
            if (e.key === "Escape") {
                onClose?.();
            }
        }

        document.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [isOpen, onClose]);

    const modalRoot = document.getElementById("modal-root");

    if (!modalRoot) return null;

    const modalSize = UI_VARIANTS.modalSize[size] || UI_VARIANTS.modalSize.md;

    const modalWidth = width || modalSize.width;
    const modalHeight = height || modalSize.height;

    const modalAnimation =
        UI_VARIANTS.modalAnimation[animation] ||
        UI_VARIANTS.modalAnimation.scale;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className={cn(
                        "fixed inset-0 z-[9999] flex items-center justify-center px-4",
                        UI_VARIANTS.modal.overlay
                    )}
                    onMouseDown={onClose}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                >
                    <motion.div
                        className={cn(
                            "relative flex flex-col overflow-hidden rounded-2xl",
                            "max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]",
                            modalWidth,
                            modalHeight,
                            UI_VARIANTS.modal.box,
                            className
                        )}
                        onMouseDown={(e) => e.stopPropagation()}
                        initial={modalAnimation.initial}
                        animate={modalAnimation.animate}
                        exit={modalAnimation.exit}
                        transition={modalAnimation.transition}
                    >
                        <div
                            className={cn(
                                "flex shrink-0 items-center justify-between border-b px-5 py-4",
                                UI_VARIANTS.modal.border
                            )}
                        >
                            <h2 className="truncate text-lg font-semibold text-slate-900">
                                {title}
                            </h2>

                            <button
                                type="button"
                                onClick={onClose}
                                className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div
                            className={cn(
                                "min-h-0 min-w-0 flex-1 overflow-hidden",
                                bodyClassName
                            )}
                        >
                            {children}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        modalRoot
    );
}