import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import MonthDaysCarousel from "./MonthDayCarousel";
import formatCurrency from "../utils/formatCurrency";
import getMonthByNum from "../utils/getMonthByNum";

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
    const [localSelectedMonth, setLocalSelectedMonth] = useState(selectedMonth);
    const [localSelectedYear, setLocalSelectedYear] = useState(selectedYear);

    const [localSelectedDay, setLocalSelectedDay] = useState(
        selectedDay || new Date().getDate()
    );

    const [formData, setFormData] = useState({
        name: "",
        amount: "",
        note: "",
    });

    function getMaxDayOfMonth(month, year) {
        return new Date(year, month, 0).getDate();
    }

    function normalizeSelectedDay(month, year, day) {
        const maxDay = getMaxDayOfMonth(month, year);
        return Math.min(day, maxDay);
    }

    function handlePreviousMonth() {
        setLocalSelectedMonth((prevMonth) => {
            let newMonth = prevMonth - 1;
            let newYear = localSelectedYear;

            if (newMonth < 1) {
                newMonth = 12;
                newYear = localSelectedYear - 1;
                setLocalSelectedYear(newYear);
            }

            setLocalSelectedDay((prevDay) => {
                const nextDay = normalizeSelectedDay(
                    newMonth,
                    newYear,
                    prevDay
                );

                onDayChange?.(nextDay);

                return nextDay;
            });

            return newMonth;
        });
    }

    function handleNextMonth() {
        setLocalSelectedMonth((prevMonth) => {
            let newMonth = prevMonth + 1;
            let newYear = localSelectedYear;

            if (newMonth > 12) {
                newMonth = 1;
                newYear = localSelectedYear + 1;
                setLocalSelectedYear(newYear);
            }

            setLocalSelectedDay((prevDay) => {
                const nextDay = normalizeSelectedDay(
                    newMonth,
                    newYear,
                    prevDay
                );

                onDayChange?.(nextDay);

                return nextDay;
            });

            return newMonth;
        });
    }

    function handleTodayClick() {
        const today = new Date();

        const todayDay = today.getDate();
        const todayMonth = today.getMonth() + 1;
        const todayYear = today.getFullYear();

        setLocalSelectedDay(todayDay);
        setLocalSelectedMonth(todayMonth);
        setLocalSelectedYear(todayYear);

        onDayChange?.(todayDay);
    }

    function handleDayChange(day) {
        setLocalSelectedDay(day);
        onDayChange?.(day);
    }

    function handleInputChange(e) {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function handleSubmit(e) {
        e.preventDefault();

        const amount = Number(formData.amount);

        if (!formData.name.trim()) return;
        if (Number.isNaN(amount) || amount <= 0) return;

        onCreateMovement?.({
            name: formData.name.trim(),
            amount,
            note: formData.note.trim(),
            day: localSelectedDay,
            month: localSelectedMonth,
            year: localSelectedYear,
            transactionId: transaction?.id,
        });

        setFormData({
            name: "",
            amount: "",
            note: "",
        });
    }

    const filteredMovements = useMemo(() => {
        return movements.filter((movement) => {
            const movementDay = Number(
                movement.day ??
                movement.dayNumber ??
                movement.date?.split("-")?.[2]
            );

            const movementMonth = Number(
                movement.month ?? movement.date?.split("-")?.[1]
            );

            const movementYear = Number(
                movement.year ?? movement.date?.split("-")?.[0]
            );

            return (
                movementDay === Number(localSelectedDay) &&
                movementMonth === Number(localSelectedMonth) &&
                movementYear === Number(localSelectedYear)
            );
        });
    }, [
        movements,
        localSelectedDay,
        localSelectedMonth,
        localSelectedYear,
    ]);

    const total = useMemo(() => {
        return filteredMovements.reduce((sum, movement) => {
            return sum + Number(movement.amount || movement.value || 0);
        }, 0);
    }, [filteredMovements]);

    return (
        <div className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden">
            <div className="grid shrink-0 grid-cols-1 gap-4 border-b border-slate-200 px-4 py-3 md:grid-cols-[300px_minmax(0,1fr)]">
                <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                    <button
                        type="button"
                        onClick={handlePreviousMonth}
                        className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition hover:bg-white hover:text-slate-900"
                    >
                        <ChevronLeft size={17} />
                    </button>

                    <div className="min-w-0 text-center">
                        <p className="truncate text-sm font-semibold text-slate-900">
                            {getMonthByNum(localSelectedMonth)}{" "}
                            {localSelectedYear}
                        </p>
                        {/*               <p className="truncate text-[11px] text-slate-500">
                            Giorno {localSelectedDay}
                        </p> */}
                    </div>

                    <button
                        type="button"
                        onClick={handleNextMonth}
                        className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition hover:bg-white hover:text-slate-900"
                    >
                        <ChevronRight size={17} />
                    </button>
                </div>

                <div className="min-w-0">
                    <MonthDaysCarousel
                        selectedMonth={localSelectedMonth}
                        selectedYear={localSelectedYear}
                        selectedDay={localSelectedDay}
                        onDayChange={handleDayChange}
                    />
                </div>
            </div>

            <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-hidden px-4 py-4 md:grid-cols-[300px_minmax(0,1fr)]">
                <form
                    onSubmit={handleSubmit}
                    className="flex min-h-0 flex-col rounded-xl border border-slate-200 bg-slate-50 p-3"
                >
                    <div className="mb-3">
                        <h3 className="text-sm font-semibold text-slate-900">
                            Nuovo movimento
                        </h3>
                        <p className="text-xs text-slate-500">
                            Inserisci un movimento per il giorno selezionato.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="mb-1 block text-xs font-medium text-slate-600">
                                Nome
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Es. Spesa supermercato"
                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-medium text-slate-600">
                                Quantità
                            </label>

                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleInputChange}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-medium text-slate-600">
                                Note
                            </label>

                            <textarea
                                name="note"
                                value={formData.note}
                                onChange={handleInputChange}
                                placeholder="Note opzionali"
                                rows={5}
                                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                    >
                        <Plus size={16} />
                        Inserisci movimento
                    </button>
                </form>

                <div className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-3 py-2">
                        <div className="min-w-0">
                            <h3 className="truncate text-sm font-semibold text-slate-900">
                                Movimenti
                            </h3>

                            <p className="truncate text-xs text-slate-500">
                                {filteredMovements.length} movimenti trovati
                            </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                            <button
                                type="button"
                                onClick={handleTodayClick}
                                className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                            >
                                Oggi
                            </button>

                            <p className="text-sm font-semibold text-slate-900">
                                {formatCurrency(total)}
                            </p>
                        </div>
                    </div>

                    <div className="min-h-0 flex-1 overflow-y-auto p-3">
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
                                                    className={`text-sm font-semibold ${isExpense
                                                        ? "text-red-600"
                                                        : "text-emerald-600"
                                                        }`}
                                                >
                                                    {formatCurrency(amount)}
                                                </span>

                                                {/* <button
                                                    type="button"
                                                    onClick={() =>
                                                        onEditMovement?.(
                                                            movement
                                                        )
                                                    }
                                                    className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white hover:text-slate-700"
                                                >
                                                    <Pencil size={15} />
                                                </button> */}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        onDeleteMovement?.(
                                                            movement
                                                        )
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
                                    Compila il form a sinistra per aggiungerne
                                    uno.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex shrink-0 items-center justify-end gap-2 border-t border-slate-200 px-4 py-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                    Chiudi
                </button>
            </div>
        </div>
    );
}