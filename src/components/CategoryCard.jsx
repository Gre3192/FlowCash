import { useState } from "react";
import { FolderOpen, Pencil, Trash2 } from "lucide-react";
import EdgeProgressBar from "./EdgeProgressBar";
import CardMenu from "./CardMenu";
import formatCurrency from "../utils/formatCurrency";

export default function CategoryCard({
    category,
    isSelected,
    progress = 0,
    total = 0,
    openCategoryMenuId,
    setOpenCategoryMenuId,
    setSelectedCategoryId,
}) {
    const [categoryMenuAnchor, setCategoryMenuAnchor] = useState("button");
    const [ctxMenuPosition, setCtxMenuPosition] = useState({ x: 0, y: 0 });

    const transactionsCount = category?.transactions?.length ?? 0;

    function handleSelect() {
        setSelectedCategoryId(category.id);
    }

    function handleContextMenu(e) {
        e.preventDefault();

        setSelectedCategoryId(category.id);
        setCategoryMenuAnchor("context");
        setCtxMenuPosition({ x: e.clientX, y: e.clientY });
        setOpenCategoryMenuId(category.id);
    }

    return (
        <div
            onClick={handleSelect}
            onContextMenu={handleContextMenu}
            className={`
                group relative cursor-pointer overflow-visible rounded-xl transition-all duration-150
                ${isSelected
                    ? "bg-sky-50 shadow-[0_4px_14px_rgba(14,165,233,0.12)]"
                    : "bg-white hover:bg-slate-50 hover:shadow-[0_4px_14px_rgba(15,23,42,0.08)]"
                }
            `}
        >
            <div
                className={`
                    relative flex items-center justify-between overflow-hidden rounded-xl border px-3 py-3
                    ${isSelected
                        ? "border-sky-200 bg-sky-50"
                        : "border-slate-200 bg-white group-hover:border-slate-300"
                    }
                `}
            >
                <EdgeProgressBar value={progress} />

                <div className="flex min-w-0 items-center gap-3">
                    <div
                        className={`
                            flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border shadow-sm
                            ${isSelected
                                ? "border-sky-200 bg-white text-sky-700"
                                : "border-slate-200 bg-slate-50 text-slate-600"
                            }
                        `}
                    >
                        <FolderOpen size={18} />
                    </div>

                    <div className="min-w-0">
                        <div className="truncate text-sm font-semibold leading-5 text-slate-900">
                            {category.name}
                        </div>

                        <div className="truncate text-xs leading-4 text-slate-500">
                            {transactionsCount === 1
                                ? "1 transazione"
                                : `${transactionsCount} transazioni`}
                        </div>
                    </div>
                </div>

                <div className="ml-3 flex shrink-0 items-center gap-2">
                    <div className="text-right">
                        <div className="mb-1 flex justify-end">
                            <span
                                className={`
                                    rounded-md px-1.5 py-0.5 text-[10px] font-medium leading-none
                                    ${isSelected
                                        ? "bg-sky-100 text-sky-700"
                                        : "bg-slate-100 text-slate-600"
                                    }
                                `}
                            >
                                {progress.toFixed(0)}%
                            </span>
                        </div>

                        <div
                            className={`
                                whitespace-nowrap text-sm font-semibold leading-4
                                ${isSelected ? "text-sky-700" : "text-emerald-600"}
                            `}
                        >
                            {formatCurrency(total)}
                        </div>
                    </div>

                    <CardMenu
                        isOpen={openCategoryMenuId === category.id}
                        anchor={categoryMenuAnchor}
                        contextPosition={ctxMenuPosition}
                        onToggle={(next, options = {}) => {
                            if (!next) {
                                setOpenCategoryMenuId(null);
                                return;
                            }

                            setSelectedCategoryId(category.id);
                            setCategoryMenuAnchor(options.anchor || "button");
                            setOpenCategoryMenuId(category.id);
                        }}
                        items={[
                            {
                                label: "Modifica",
                                icon: Pencil,
                                onClick: () => {},
                            },
                            {
                                label: "Elimina",
                                icon: Trash2,
                                danger: true,
                                onClick: () => {},
                            },
                        ]}
                    />
                </div>
            </div>
        </div>
    );
}