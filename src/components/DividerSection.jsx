import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";


const DOT_COLORS = {
    green: "bg-emerald-400",
    red: "bg-red-400",
    gray: "bg-slate-400",
};

export default function CategoryDividerSection({
    label,
    numItems,
    show,
    onClick,
    children,
    dotColor,
}) {

    const [defaultShow, setDefaultShow] = useState(!Number(numItems));

    return (
        <div className="w-full">
            <div className="w-full">
                <DividerButton
                    onClick={onClick}
                    label={label}
                    numItems={numItems}
                    show={show}
                    dotColor={dotColor}
                />
            </div>

            <AnimatePresence initial={false}>
                {show && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                            height: {
                                duration: 0.22,
                                ease: "easeOut",
                            },
                            opacity: {
                                duration: 0.16,
                            },
                        }}
                        className="overflow-hidden"
                    >
                        <div className="mt-2 space-y-2">{children}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function DividerButton({
    onClick,
    label,
    numItems,
    show,
    dotColor,
}) {
    const dotClassName = DOT_COLORS[dotColor];

    return (
        <button
            type="button"
            onClick={onClick}
            className="flex w-full cursor-pointer items-center gap-2 py-1.5 text-left"
        >
            {/* <div className="h-px flex-1 bg-slate-200" /> */}

            <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700">
                <ChevronDown
                    size={13}
                    className={`transition-transform duration-200 ${show ? "rotate-0" : "-rotate-90"}`}
                />

                {dotClassName ? (
                    <span
                        className={`h-2 w-2 shrink-0 rounded-full ${dotClassName}`}
                    />
                ) : null}

                <span>{label}</span>

                {/* {numItems !== undefined && numItems !== null ? (
                    <span className="rounded-full bg-white px-1.5 py-0.5 text-[10px] text-slate-400">
                        {numItems}
                    </span>
                ) : null} */}
            </div>

            <div className="h-px flex-1 bg-slate-200" />

            {numItems !== undefined && numItems !== null ? (
                <span className="rounded-full bg-slate-50 border border-slate-200 px-1.5 py-0.5 text-[10px] text-slate-400">
                    {numItems}
                </span>
            ) : null}
        </button>
    );
}