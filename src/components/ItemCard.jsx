
import EdgeProgressBar from "./EdgeProgressBar";
import formatCurrency from "../utils/formatCurrency";
import { useState } from "react";
import CardMenu from "./CardMenu";
import { FolderOpen, Search, Plus, Pencil, Trash2, MoreVertical, } from "lucide-react";
import amazon from "../assets/logos/PrimeVideo.png"
import netflix from "../assets/logos/Netflix.png"

export default function ItemCard({

    setOpenCategoryMenuId,
    transaction,
    current,
    budget,

}) {

    const [openTransactionMenuId, setOpenTransactionMenuId] = useState(null);
    const [transactionMenuAnchor, setTransactionMenuAnchor] = useState("button");
    const [ctxMenuPosition, setCtxMenuPosition] = useState({ x: 0, y: 0 });

    const progress = budget > 0 ? (current / budget) * 100 : 0;
    const remaining = budget - current


    function onCtxMenuClick(e) {
        e.preventDefault();
        setOpenCategoryMenuId(null);
        setTransactionMenuAnchor("context");
        setCtxMenuPosition({ x: e.clientX, y: e.clientY });
        setOpenTransactionMenuId(transaction.id);
    }


    return (
        <div
            key={transaction.id}
            onContextMenu={onCtxMenuClick}
            className="relative overflow-visible rounded-lg border border-slate-200 bg-white px-2.5 py-2 pb-3 transition hover:bg-slate-50 sm:pl-3 sm:pr-2"
        >
            <EdgeProgressBar value={progress} />

            <div className=" flex items-center gap-3">
                <div className="shrink-0 w-fit items-center overflow-hidden rounded-md">
                    <img
                        src={netflix}
                        className="w-8 h-8 object-cover"
                    />
                </div>

                <div className="flex w-full items-center justify-between">
                    
                    <div className="flex flex-col items-start">
                        <div className="truncate text-sm font-medium text-slate-900">
                            {transaction.name}
                        </div>

                        <div className="truncate text-[11px] text-slate-500">
                            Rimanenti: {formatCurrency(remaining)}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex flex-col items-end">
                            <div className="shrink-0 text-[11px] text-slate-500">
                                {progress.toFixed(0)}%
                            </div>
                            <div className="shrink-0 text-[11px] font-semibold text-emerald-700">
                                {formatCurrency(current)} / {formatCurrency(budget)}
                            </div>
                        </div>
                        <div className="self-start">
                            <CardMenu
                                isOpen={openTransactionMenuId === transaction.id}
                                anchor={transactionMenuAnchor}
                                contextPosition={ctxMenuPosition}
                                onToggle={(next, options = {}) => {
                                    if (!next) {
                                        setOpenTransactionMenuId(null);
                                        return;
                                    }
                                    setOpenCategoryMenuId(null);
                                    setTransactionMenuAnchor(options.anchor || "button");
                                    setOpenTransactionMenuId(transaction.id);
                                }}
                                items={[
                                    {
                                        label: "Modifica",
                                        icon: Pencil,
                                        onClick: () => { },
                                    },
                                    {
                                        label: "Elimina",
                                        icon: Trash2,
                                        danger: true,
                                        onClick: () => { },
                                    },
                                ]}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

