import { useState } from "react";
import EdgeProgressBar from "./EdgeProgressBar";
import formatCurrency from "../utils/formatCurrency";
import CardMenu from "./CardMenu";
import { Pencil, Trash2 } from "lucide-react";

import amazon from "../assets/logos/PrimeVideo.png";

export default function TransactionCard({
    setOpenCategoryMenuId,
    transaction,
    current,
    budget,
    onClick = () => {},
}) {
    const [openTransactionMenuId, setOpenTransactionMenuId] = useState(null);
    const [transactionMenuAnchor, setTransactionMenuAnchor] = useState("button");
    const [ctxMenuPosition, setCtxMenuPosition] = useState({ x: 0, y: 0 });

    const progress = budget > 0 ? (current / budget) * 100 : 0;
    const remaining = budget - current;

    function onCtxMenuClick(e) {
        e.preventDefault();
        e.stopPropagation();

        setOpenCategoryMenuId?.(null);
        setTransactionMenuAnchor("context");
        setCtxMenuPosition({ x: e.clientX, y: e.clientY });
        setOpenTransactionMenuId(transaction.id);
    }

    function handleMenuToggle(next, options = {}) {
        if (!next) {
            setOpenTransactionMenuId(null);
            return;
        }

        setOpenCategoryMenuId?.(null);
        setTransactionMenuAnchor(options.anchor || "button");
        setOpenTransactionMenuId(transaction.id);
    }

    return (
        <div
            key={transaction.id}
            onClick={onClick}
            onContextMenu={onCtxMenuClick}
            className="
                group relative flex cursor-pointer items-center justify-between overflow-hidden rounded-xl
                border border-slate-200 bg-white px-4 py-4
                shadow-[0_1px_2px_rgba(15,23,42,0.04)]
                transition-all duration-200 ease-out
                hover:-translate-y-0.5
                hover:border-slate-300
                hover:bg-slate-50
                hover:shadow-[0_8px_24px_rgba(15,23,42,0.10)]
                active:translate-y-0
                active:shadow-[0_2px_8px_rgba(15,23,42,0.08)]
            "
        >
            <EdgeProgressBar value={progress} />

            <div className="flex min-w-0 items-center gap-3">
                <div
                    className="
                        flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg
                        border border-slate-200 bg-slate-50 shadow-sm
                        transition-all duration-200
                        group-hover:border-slate-300
                        group-hover:bg-white
                        group-hover:shadow-md
                    "
                >
                    <img
                        src={transaction.logo || amazon}
                        alt={transaction.name}
                        draggable={false}
                        className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                </div>

                <div className="min-w-0">
                    <div className="truncate text-sm font-semibold leading-5 text-slate-900 transition-colors group-hover:text-slate-950">
                        {transaction.name}
                    </div>

                    <div className="truncate text-xs leading-4 text-slate-500">
                        Rimanenti:{" "}
                        <span className="font-medium text-slate-600">
                            {formatCurrency(remaining)}
                        </span>
                    </div>
                </div>
            </div>

            <div className="ml-4 flex shrink-0 items-center gap-2">
                <div className="text-right">
                    <div className="mb-1 flex justify-end">
                        <span
                            className="
                                rounded-md bg-slate-100 px-1.5 py-0.5
                                text-[10px] font-medium leading-none text-slate-600
                                transition-colors duration-200
                                group-hover:bg-white
                            "
                        >
                            {progress.toFixed(0)}%
                        </span>
                    </div>

                    <div className="whitespace-nowrap text-sm font-semibold leading-4 text-emerald-600">
                        {formatCurrency(current)}
                        <span className="font-normal text-slate-400">
                            {" "}
                            / {formatCurrency(budget)}
                        </span>
                    </div>
                </div>

                <div onClick={(e) => e.stopPropagation()}>
                    <CardMenu
                        isOpen={openTransactionMenuId === transaction.id}
                        anchor={transactionMenuAnchor}
                        contextPosition={ctxMenuPosition}
                        onToggle={handleMenuToggle}
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