import { useState } from "react";
import EdgeProgressBar from "./EdgeProgressBar";
import formatCurrency from "../utils/formatCurrency";
import CardMenu from "./CardMenu";
import {
    Pencil,
    Trash2,
    ArrowDownLeft,
    ArrowUpRight,
} from "lucide-react";

import amazon from "../assets/logos/PrimeVideo.png";

export default function TransactionCard({
    setOpenCategoryMenuId,
    transaction,
    current,
    budget,
    onClick = () => { },
}) {
    const [openTransactionMenuId, setOpenTransactionMenuId] = useState(null);
    const [transactionMenuAnchor, setTransactionMenuAnchor] = useState("button");
    const [ctxMenuPosition, setCtxMenuPosition] = useState({ x: 0, y: 0 });

    const isIncome = transaction.type === "Income";
    const isExpense = transaction.type === "Expense";

    const typeLabel = isIncome ? "Entrata" : "Uscita";
    const TypeIcon = isIncome ? ArrowDownLeft : ArrowUpRight;

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

                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                        <span
                            className={`
                                inline-flex shrink-0 items-center gap-1 rounded-full border px-1.5 py-0.5
                                text-[10px] font-medium leading-none
                                ${isIncome
                                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                    : "border-red-200 bg-red-50 text-red-700"
                                }
                            `}
                        >
                            <TypeIcon size={11} />
                            {typeLabel}
                        </span>

                        <span
                            className="
                                inline-flex shrink-0 items-center rounded-full border border-slate-200 bg-slate-50
                                px-1.5 py-0.5 text-[10px] font-medium leading-none text-slate-600
                                transition-colors duration-200 group-hover:bg-white
                            "
                        >
                            {progress.toFixed(0)}%
                        </span>
                    </div>
                </div>
            </div>

            <div className="ml-4 flex shrink-0 items-center gap-2">
                <div className="text-right">
                    <AmountRatio firstNum={formatCurrency(current)} secondNum={formatCurrency(budget)} />
                    <div className="truncate text-sm font-semibold leading-5 text-slate-500">
                        Rimanenti:{" "}
                        <span className="text-slate-900">
                            {formatCurrency(remaining)}
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
    );
}




function AmountRatio({
    firstNum,
    secondNum
}) {
    return (
        <div className={`mb-1 whitespace-nowrap text-xs font-medium leading-4 text-red-600`}  >
            {firstNum}
            <span className="font-normal text-slate-500">
                {" "}
                / {secondNum}
            </span>
        </div>
    )
}