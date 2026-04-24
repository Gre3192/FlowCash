import React from "react";
import { LayoutGrid, GalleryHorizontal } from "lucide-react";

export default function ToggleButton({
    value,
    onChange,
    options = [
        { value: "value 1", label: "Valore 1", icon: LayoutGrid },
        { value: "value 2", label: "Valore 2", icon: GalleryHorizontal },
    ],
}) {
    const activeIdx = Math.max(0, options.findIndex((o) => o.value === value));

    const handleArrow = (dir) => {
        const next = (activeIdx + dir + options.length) % options.length;
        onChange(options[next].value);
    };

    return (
        <div role="group" aria-label="Selettore vista" className="p-1 w-fit">
            <div className="rounded-lg bg-white p-1 shadow-sm ring-1 ring-slate-200">
                <div
                    className="relative grid"
                    style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
                >
                    {/* PILL ATTIVA */}
                    <span
                        aria-hidden="true"
                        className="absolute inset-0 rounded-md bg-blue-600 shadow-sm transition-transform duration-200 ease-out"
                        style={{
                            // la pillola occupa esattamente 1 colonna (1fr)
                            width: `calc(100% / ${options.length})`,
                            transform: `translateX(${activeIdx * 100}%)`,
                        }}
                    />

                    {options.map((opt, i) => {
                        const active = value === opt.value;
                        const Icon = opt.icon;

                        return (
                            <button
                                key={opt.value ?? i}
                                type="button"
                                aria-pressed={active}
                                onClick={() => onChange(opt.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "ArrowRight") {
                                        e.preventDefault();
                                        handleArrow(1);
                                    }
                                    if (e.key === "ArrowLeft") {
                                        e.preventDefault();
                                        handleArrow(-1);
                                    }
                                }}
                                className={[
                                    "cursor-pointer",
                                    "relative z-10",
                                    "inline-flex items-center justify-center gap-2",
                                    "rounded-xl px-4 py-2 text-sm font-medium",
                                    "transition-colors duration-200",
                                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                                    active ? "text-white" : "text-slate-500 hover:text-slate-700",
                                ].join(" ")}
                            >
                                <Icon size={16} strokeWidth={2.5} />
                                {opt.label}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}