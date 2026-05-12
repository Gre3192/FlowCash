import EdgeProgressBar from "./EdgeProgressBar";
import formatCurrency from "../utils/formatCurrency";
import CardMenu from "./CardMenu";
import {
    Pencil,
    Trash2,
    ArrowDownLeft,
    ArrowUpRight,
    Wallet,
    AlertCircle,
} from "lucide-react";

import amazon from "../assets/logos/PrimeVideo.png";
import AmountRatio from "./AmountRatio";
import { useDelete } from "../hooks/useDelete";
import { API_ENDPOINTS } from "../api/endpoint";

export default function TransactionCard({
    setOpenCategoryMenuId,
    transaction,
    current = 0,
    budget = 0,
    onClick = () => {},
    openTransactionMenuId,
    setOpenTransactionMenuId,
    transactionMenuAnchor,
    setTransactionMenuAnchor,
    transactionContextPosition,
    setTransactionContextPosition,
    reloadMonthlyOverview,
    setSelectedDay,
    selectedMonth,
    selectedYear,
}) {
    const { deleteData } = useDelete();

    const isMenuOpen = openTransactionMenuId === transaction.id;
    const isIncome = transaction.type === "Income";
    const typeLabel = isIncome ? "Entrata" : "Uscita";
    const TypeIcon = isIncome ? ArrowDownLeft : ArrowUpRight;

    const hasBudget = true;

    const numericCurrent = Number(current || 0);
    const numericBudget = Number(budget || 0);

    const progress =
        hasBudget && numericBudget > 0
            ? (numericCurrent / numericBudget) * 100
            : 0;

    const remaining = hasBudget ? numericBudget - numericCurrent : 0;

    async function handleDeleteTransaction() {
        if (!transaction?.id) return;

        try {
            setOpenTransactionMenuId(null);

            await deleteData(
                API_ENDPOINTS.transactions(
                    {
                        month: selectedMonth,
                        year: selectedYear,
                    },
                    transaction.id
                )
            );

            reloadMonthlyOverview?.();
        } catch (err) {
            if (err.name !== "AbortError") {
                console.error(err);
            }
        }
    }

    function onCtxMenuClick(e) {
        e.preventDefault();
        e.stopPropagation();

        setOpenCategoryMenuId?.(null);

        setTransactionMenuAnchor("context");
        setTransactionContextPosition({
            x: e.clientX,
            y: e.clientY,
        });

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

    function handleCardClick(e) {
        if (isMenuOpen) return;
        onClick?.(e);
    }

    return (
        <div
            key={transaction.id}
            onClick={handleCardClick}
            onContextMenu={onCtxMenuClick}
            className={`
                group relative z-0 flex cursor-pointer items-center justify-between overflow-visible rounded-xl
                border bg-white px-4 py-4
                shadow-[0_1px_2px_rgba(15,23,42,0.04)]
                transition-all duration-200 ease-out
                hover:-translate-y-0.5
                hover:bg-slate-50
                hover:shadow-[0_8px_24px_rgba(15,23,42,0.10)]
                active:translate-y-0
                active:shadow-[0_2px_8px_rgba(15,23,42,0.08)]
                ${
                    hasBudget
                        ? "border-slate-200 hover:border-slate-300"
                        : "border-dashed border-amber-300 bg-amber-50/40 hover:border-amber-400 hover:bg-amber-50/70"
                }
            `}
        >
            {hasBudget && <EdgeProgressBar value={progress} />}

            {!hasBudget && (
                <div className="pointer-events-none absolute inset-x-4 bottom-0 h-[3px] rounded-full bg-amber-300" />
            )}

            <div className="flex min-w-0 items-center gap-3">
                <div
                    className={`
                        flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg
                        border shadow-sm transition-all duration-200
                        group-hover:shadow-md
                        ${
                            hasBudget
                                ? "border-slate-200 bg-slate-50 group-hover:border-slate-300 group-hover:bg-white"
                                : "border-amber-200 bg-amber-100 text-amber-700 group-hover:border-amber-300"
                        }
                    `}
                >
                    {hasBudget ? (
                        <img
                            src={transaction.logo || amazon}
                            alt={transaction.name}
                            draggable={false}
                            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                        />
                    ) : (
                        <Wallet size={20} />
                    )}
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
                                ${
                                    isIncome
                                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                        : "border-red-200 bg-red-50 text-red-700"
                                }
                            `}
                        >
                            <TypeIcon size={11} />
                            {typeLabel}
                        </span>

                        {hasBudget ? (
                            <span
                                className="
                                    inline-flex shrink-0 items-center rounded-full border border-slate-200 bg-slate-50
                                    px-1.5 py-0.5 text-[10px] font-medium leading-none text-slate-600
                                    transition-colors duration-200 group-hover:bg-white
                                "
                            >
                                {progress.toFixed(0)}%
                            </span>
                        ) : (
                            <span
                                className="
                                    inline-flex shrink-0 items-center gap-1 rounded-full border border-amber-200 bg-amber-100
                                    px-1.5 py-0.5 text-[10px] font-medium leading-none text-amber-700
                                "
                            >
                                <AlertCircle size={11} />
                                Budget mancante
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="ml-4 flex shrink-0 items-center gap-2">
                {hasBudget ? (
                    <div className="text-right">
                        <AmountRatio
                            firstNum={formatCurrency(numericCurrent)}
                            secondNum={formatCurrency(numericBudget)}
                            isIncome={isIncome}
                        />

                        <div className="truncate text-sm font-semibold leading-5 text-slate-500">
                            Rimanenti:{" "}
                            <span className="text-slate-900">
                                {formatCurrency(remaining)}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="text-right">
                        <div className="text-sm font-semibold leading-5 text-amber-700">
                            Inserisci budget
                        </div>

                        <div className="text-xs font-medium leading-5 text-amber-600">
                            Nessun budget per{" "}
                            {String(selectedMonth).padStart(2, "0")}/{selectedYear}
                        </div>
                    </div>
                )}

                <div
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    <CardMenu
                        isOpen={isMenuOpen}
                        anchor={transactionMenuAnchor}
                        contextPosition={transactionContextPosition}
                        onToggle={handleMenuToggle}
                        items={[
                            {
                                label: hasBudget ? "Modifica" : "Aggiungi budget",
                                icon: Pencil,
                                onClick: () => {},
                            },
                            {
                                label: "Elimina",
                                icon: Trash2,
                                danger: true,
                                onClick: handleDeleteTransaction,
                            },
                        ]}
                    />
                </div>
            </div>
        </div>
    );
}