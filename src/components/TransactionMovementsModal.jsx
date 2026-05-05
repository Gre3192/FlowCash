import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, X, CalendarDays } from "lucide-react";
import MonthDaysCarousel from "./MonthDayCarousel";
import formatCurrency from "../utils/formatCurrency";

export default function TransactionMovementsModal({
    selectedMonth,
    selectedYear,
    selectedDay,
    transaction,
    movements = [],
    onClose,
    onDayChange,
    onCreateMovement,
    onEditMovement,
    onDeleteMovement,
}) {
    const [localSelectedDay, setLocalSelectedDay] = useState(
        selectedDay || new Date().getDate()
    );

    function handleDayChange(day) {
        setLocalSelectedDay(day);
        onDayChange?.(day);
    }

    const filteredMovements = useMemo(() => {
        return movements.filter((movement) => {
            const movementDay = Number(
                movement.day ??
                    movement.dayNumber ??
                    movement.date?.split("-")?.[2]
            );

            return movementDay === Number(localSelectedDay);
        });
    }, [movements, localSelectedDay]);

    const total = useMemo(() => {
        return filteredMovements.reduce((sum, movement) => {
            return sum + Number(movement.amount || movement.value || 0);
        }, 0);
    }, [filteredMovements]);

    return (
        <div >
            {/* <div className="flex shrink-0 items-start justify-between border-b border-slate-200 px-4 py-3">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                            <CalendarDays size={17} />
                        </div>

                        <div>
                            <h2 className="text-sm font-semibold text-slate-900">
                                Movimenti
                            </h2>

                            <p className="text-xs text-slate-500">
                                {transaction?.name || "Transazione selezionata"}
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                    <X size={18} />
                </button>
            </div> */}

            <div className="shrink-0 border-b border-slate-200 px-4 py-3">
                <MonthDaysCarousel
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                    selectedDay={localSelectedDay}
                    onDayChange={handleDayChange}
                />
            </div>

            <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-3">
                <div>
                    <p className="text-xs text-slate-500">
                        Giorno selezionato
                    </p>

                    <p className="text-sm font-semibold text-slate-900">
                        {localSelectedDay}/{selectedMonth}/{selectedYear}
                    </p>
                </div>

                <div className="text-right">
                    <p className="text-xs text-slate-500">
                        Totale movimenti
                    </p>

                    <p className="text-sm font-semibold text-slate-900">
                        {formatCurrency(total)}
                    </p>
                </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
                {filteredMovements.length > 0 ? (
                    <div className="space-y-2">
                        {filteredMovements.map((movement) => {
                            const amount = Number(
                                movement.amount || movement.value || 0
                            );

                            const isExpense =
                                movement.type === "Expense" ||
                                amount < 0;

                            return (
                                <div
                                    key={movement.id}
                                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium text-slate-900">
                                            {movement.name ||
                                                movement.description ||
                                                "Movimento senza nome"}
                                        </p>

                                        {movement.note && (
                                            <p className="truncate text-xs text-slate-500">
                                                {movement.note}
                                            </p>
                                        )}
                                    </div>

                                    <div className="ml-3 flex shrink-0 items-center gap-2">
                                        <span
                                            className={`text-sm font-semibold ${
                                                isExpense
                                                    ? "text-red-600"
                                                    : "text-emerald-600"
                                            }`}
                                        >
                                            {formatCurrency(amount)}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                onEditMovement?.(movement)
                                            }
                                            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white hover:text-slate-700"
                                        >
                                            <Pencil size={15} />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                onDeleteMovement?.(movement)
                                            }
                                            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white hover:text-red-600"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex h-full min-h-40 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center">
                        <p className="text-sm font-medium text-slate-700">
                            Nessun movimento per questo giorno
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                            Aggiungi un movimento per il giorno selezionato.
                        </p>
                    </div>
                )}
            </div>

            <div className="flex shrink-0 items-center justify-end gap-2 border-t border-slate-200 px-4 py-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                    Chiudi
                </button>

                <button
                    type="button"
                    onClick={() =>
                        onCreateMovement?.({
                            day: localSelectedDay,
                            month: selectedMonth,
                            year: selectedYear,
                            transactionId: transaction?.id,
                        })
                    }
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                    <Plus size={16} />
                    Aggiungi movimento
                </button>
            </div>
        </div>
    );
}