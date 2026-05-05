import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const MODAL_SIZES = {
    sm: {
        width: "w-[420px]",
        height: "h-[420px]",
    },
    md: {
        width: "w-[640px]",
        height: "h-[560px]",
    },
    lg: {
        width: "w-[860px]",
        height: "h-[720px]",
    },
};

const MODAL_ANIMATIONS = {
    fade: {
        initial: {
            opacity: 0,
        },
        animate: {
            opacity: 1,
        },
        exit: {
            opacity: 0,
        },
        transition: {
            duration: 0.18,
            ease: "easeOut",
        },
    },

    scale: {
        initial: {
            opacity: 0,
            scale: 0.96,
        },
        animate: {
            opacity: 1,
            scale: 1,
        },
        exit: {
            opacity: 0,
            scale: 0.96,
        },
        transition: {
            duration: 0.2,
            ease: [0.22, 1, 0.36, 1],
        },
    },

    "slide-up": {
        initial: {
            opacity: 0,
            y: 24,
        },
        animate: {
            opacity: 1,
            y: 0,
        },
        exit: {
            opacity: 0,
            y: 24,
        },
        transition: {
            duration: 0.22,
            ease: [0.22, 1, 0.36, 1],
        },
    },

    "slide-down": {
        initial: {
            opacity: 0,
            y: -24,
        },
        animate: {
            opacity: 1,
            y: 0,
        },
        exit: {
            opacity: 0,
            y: -24,
        },
        transition: {
            duration: 0.22,
            ease: [0.22, 1, 0.36, 1],
        },
    },

    "slide-left": {
        initial: {
            opacity: 0,
            x: 32,
        },
        animate: {
            opacity: 1,
            x: 0,
        },
        exit: {
            opacity: 0,
            x: 32,
        },
        transition: {
            duration: 0.22,
            ease: [0.22, 1, 0.36, 1],
        },
    },

    "slide-right": {
        initial: {
            opacity: 0,
            x: -32,
        },
        animate: {
            opacity: 1,
            x: 0,
        },
        exit: {
            opacity: 0,
            x: -32,
        },
        transition: {
            duration: 0.22,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

export default function ModalWrapper({
    isOpen,
    onClose,
    title,
    children,
    size = "md",
    width,
    height,
    animation = "scale",
}) {
    useEffect(() => {
        if (!isOpen) return;

        function handleKeyDown(e) {
            if (e.key === "Escape") {
                onClose();
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

    const modalSize = MODAL_SIZES[size] || MODAL_SIZES.md;

    const modalWidth = width || modalSize.width;
    const modalHeight = height || modalSize.height;

    const modalAnimation =
        MODAL_ANIMATIONS[animation] || MODAL_ANIMATIONS.scale;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4"
                    onMouseDown={onClose}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                        duration: 0.18,
                        ease: "easeOut",
                    }}
                >
                    <motion.div
                        className={`
                            relative
                            flex
                            ${modalWidth}
                            ${modalHeight}
                            max-w-[calc(100vw-2rem)]
                            max-h-[calc(100vh-2rem)]
                            flex-col
                            overflow-hidden
                            rounded-2xl
                            bg-white
                            shadow-xl
                        `}
                        onMouseDown={(e) => e.stopPropagation()}
                        initial={modalAnimation.initial}
                        animate={modalAnimation.animate}
                        exit={modalAnimation.exit}
                        transition={modalAnimation.transition}
                    >
                        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-4">
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

                        <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden px-5 py-4">
                            {children}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        modalRoot
    );
}