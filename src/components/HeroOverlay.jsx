import React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { HERO_WIDTHS } from "../hooks/useHeroAnimation";

function WidthSelector({ width, onChange }) {
    return (
        <div className="hidden shrink-0 items-center gap-0.5 rounded-lg border border-slate-200 bg-slate-50 p-0.5 sm:flex">
            {Object.entries(HERO_WIDTHS).map(([key, { label }]) => (
                <button
                    key={key}
                    type="button"
                    onClick={() => onChange(key)}
                    className={`rounded-md px-2 py-1 text-[11px] font-medium transition ${
                        width === key
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-400 hover:text-slate-600"
                    }`}
                >
                    {label}
                </button>
            ))}
        </div>
    );
}

function HeroOverlay({
    hero,
    children,
    className = "",
    transition = { type: "spring", stiffness: 300, damping: 30 },
}) {
    const portalTarget = document.getElementById("modal-root");
    if (!portalTarget) return null;

    return createPortal(
        <AnimatePresence>
            {hero.isOpen && (
                <>
                    <motion.div
                        key="hero-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm"
                        onClick={hero.close}
                    />
                    <motion.div
                        key="hero-expanded"
                        layoutId={hero.getLayoutId(hero.selectedId)}
                        className={`fixed inset-0 z-[9999] m-auto flex h-[calc(100vh-2rem)] max-h-[800px] w-[calc(100%-2rem)] ${hero.maxWClass} flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:h-[calc(100vh-4rem)] sm:w-[calc(100%-4rem)] ${className}`}
                        transition={transition}
                    >
                        {children}
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        portalTarget
    );
}

HeroOverlay.WidthSelector = WidthSelector;

export default HeroOverlay;
