import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export default function ModalWrapper({
    isOpen,
    onClose,
    title,
    children,
    width = "max-w-2xl",
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

    if (!isOpen) return null;

    const modalRoot = document.getElementById("modal-root");

    if (!modalRoot) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4"
            onMouseDown={onClose}
        >
            <div
                className={`relative w-full ${width} rounded-2xl bg-white shadow-xl`}
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                    <h2 className="text-lg font-semibold text-slate-900">
                        {title}
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex cursor-pointer h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="px-5 py-4">
                    {children}
                </div>
            </div>
        </div>,
        modalRoot
    );
}