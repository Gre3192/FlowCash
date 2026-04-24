import EdgeProgressBar from "../components/EdgeProgressBar";
import { FolderOpen, Pencil, Trash2 } from "lucide-react";
import CardMenu from "./CardMenu";
import formatCurrency from "../utils/formatCurrenct";
import { useState } from "react";

export default function CategoryCard({

    isSelected,
    progress,
    category,
    openCategoryMenuId,
    setOpenCategoryMenuId,
    setSelectedCategoryId,
    total

}) {


    const [categoryMenuAnchor, setCategoryMenuAnchor] = useState("button");
    const [categoryContextPosition, setCategoryContextPosition] = useState({ x: 0, y: 0 });

    return (
        <div
            key={category.id}
            onClick={() => setSelectedCategoryId(category.id)}
            onContextMenu={(e) => {
                e.preventDefault();
                setSelectedCategoryId(category.id);
                setOpenTransactionMenuId(null);
                setCategoryMenuAnchor("context");
                setCategoryContextPosition({ x: e.clientX, y: e.clientY });
                setOpenCategoryMenuId(category.id);
            }}
            className={`relative overflow-visible rounded-lg border px-2.5 py-2 pb-3 transition sm:px-3 ${isSelected
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-white"
                }`}
        >
            <EdgeProgressBar value={progress} selected={isSelected} />

            <div className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 flex-1 items-start gap-2 text-left">
                    <div className={`shrink-0 rounded-md p-1.5 ${isSelected ? "bg-white/10" : "bg-slate-100 text-slate-700"}`}>
                        <FolderOpen size={14} />
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium">
                            {category.name}
                        </div>
                        <div
                            className={`text-[11px] ${isSelected ? "text-slate-300" : "text-slate-500"
                                }`}
                        >
                            {category.transactions.length} transazioni
                        </div>
                    </div>
                </div>

                <div className="flex shrink-0 items-start gap-1">
                    <div className={`hidden rounded-md px-2 py-1 text-[11px] font-medium sm:block ${isSelected ? "bg-white/10 text-white" : "bg-slate-100 text-slate-700"}`}>
                        {formatCurrency(total)}
                    </div>

                    <CardMenu
                        dark={isSelected}
                        isOpen={openCategoryMenuId === category.id}
                        anchor={categoryMenuAnchor}
                        contextPosition={categoryContextPosition}
                        onToggle={(next, options = {}) => {
                            if (!next) { setOpenCategoryMenuId(null); return; }
                            setOpenTransactionMenuId(null);
                            setCategoryMenuAnchor(options.anchor || "button");
                            setOpenCategoryMenuId(category.id);
                        }}
                        items={[
                            {
                                label: "Modifica",
                                icon: Pencil,
                                onClick: () => handleEditCategory(category.id),
                            },
                            {
                                label: "Elimina",
                                icon: Trash2,
                                danger: true,
                                onClick: () => handleDeleteCategory(category.id),
                            },
                        ]}
                    />
                </div>
            </div>

            <div className={`mt-1 text-[11px] sm:hidden ${isSelected ? "text-slate-300" : "text-slate-500"}`} >
                {formatCurrency(total)}
            </div>
        </div>
    )
}