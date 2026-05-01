
import EdgeProgressBar from "./EdgeProgressBar";
import formatCurrency from "../utils/formatCurrency";
import { useState } from "react";
import CardMenu from "./CardMenu";
import { FolderOpen, Search, Plus, Pencil, Trash2, MoreVertical, } from "lucide-react";

export default function TransactionCard({

    setOpenCategoryMenuId,
    transaction,
    remaining,
    progress,
    current,
    budget,
    categories,
    selectedCategoryId,
    setCategories

}) {

    const [openTransactionMenuId, setOpenTransactionMenuId] = useState(null);

    const [transactionMenuAnchor, setTransactionMenuAnchor] = useState("button");

    const [transactionContextPosition, setTransactionContextPosition] = useState({ x: 0, y: 0 });


    const handleEditTransaction = (transactionId) => {
        const baseCategory =
            categories.find((category) => category.id === selectedCategoryId) || null;

        if (!baseCategory) return;

        const transaction = baseCategory.transactions.find(
            (item) => item.id === transactionId
        );
        if (!transaction) return;

        const newDescription = prompt("Modifica descrizione:", transaction.description);
        if (!newDescription?.trim()) return;

        const newCurrentRaw = prompt(
            "Modifica valore corrente:",
            String(transaction.current ?? 0)
        );
        if (newCurrentRaw === null) return;

        const newTargetRaw = prompt(
            "Modifica valore target:",
            String(transaction.target ?? 0)
        );
        if (newTargetRaw === null) return;

        const newCurrent = Number(String(newCurrentRaw).replace(",", "."));
        const newTarget = Number(String(newTargetRaw).replace(",", "."));

        if (Number.isNaN(newCurrent) || Number.isNaN(newTarget)) return;

        const newDate = prompt("Modifica data (YYYY-MM-DD):", transaction.date);
        if (!newDate?.trim()) return;

        setCategories((prev) =>
            prev.map((category) =>
                category.id === baseCategory.id
                    ? {
                        ...category,
                        transactions: category.transactions.map((item) =>
                            item.id === transactionId
                                ? {
                                    ...item,
                                    description: newDescription.trim(),
                                    current: newCurrent,
                                    target: newTarget,
                                    date: newDate.trim(),
                                }
                                : item
                        ),
                    }
                    : category
            )
        );

        setOpenTransactionMenuId(null);
    };

    const handleDeleteTransaction = (transactionId) => {
        const baseCategory =
            categories.find((category) => category.id === selectedCategoryId) || null;

        if (!baseCategory) return;

        const transaction = baseCategory.transactions.find(
            (item) => item.id === transactionId
        );
        if (!transaction) return;

        const confirmed = window.confirm(
            `Vuoi eliminare la transazione "${transaction.description}"?`
        );
        if (!confirmed) return;

        setCategories((prev) =>
            prev.map((category) =>
                category.id === baseCategory.id
                    ? {
                        ...category,
                        transactions: category.transactions.filter(
                            (item) => item.id !== transactionId
                        ),
                    }
                    : category
            )
        );

        setOpenTransactionMenuId(null);
    };

    return (
        <div
            key={transaction.id}
            onContextMenu={(e) => {
                e.preventDefault();
                setOpenCategoryMenuId(null);
                setTransactionMenuAnchor("context");
                setTransactionContextPosition({ x: e.clientX, y: e.clientY });
                setOpenTransactionMenuId(transaction.id);
            }}
            className="relative overflow-visible rounded-lg border border-slate-200 bg-white px-2.5 py-2 pb-3 transition hover:bg-slate-50 sm:px-3"
        >
            <EdgeProgressBar value={progress} />

            <div className="min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">

                        
                        <div className="flex items-start justify-between gap-2">
                            <div className="truncate text-sm font-medium text-slate-900">
                                {transaction.description}
                            </div>

                            <div className="truncate text-[11px] text-slate-500">
                                Rimanenti: {formatCurrency(remaining)}
                            </div>
                        </div>

                        <div className="mt-1 flex items-center justify-between gap-2">

                            <div className="shrink-0 text-[11px] font-semibold text-emerald-700">
                                {formatCurrency(current)} / {formatCurrency(budget)}
                            </div>
                            <div className="shrink-0 text-[11px] text-slate-500">
                                {progress.toFixed(0)}%
                            </div>
                        </div>
                    </div>

                    <CardMenu
                        isOpen={openTransactionMenuId === transaction.id}
                        anchor={transactionMenuAnchor}
                        contextPosition={transactionContextPosition}
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
                                onClick: () => handleEditTransaction(transaction.id),
                            },
                            {
                                label: "Elimina",
                                icon: Trash2,
                                danger: true,
                                onClick: () => handleDeleteTransaction(transaction.id),
                            },
                        ]}
                    />
                </div>
            </div>
        </div>
    )
}