import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import MonthDaysCarousel from "./MonthDayCarousel";
import formatCurrency from "../utils/formatCurrency";
import getMonthByNum from "../utils/getMonthByNum";
import MonthNavigator from "./MonthNavigator";
import { Button, Textarea, Input, IconButton } from "../ui";
import { API_ENDPOINTS } from "../api/endpoint";
import { useGet } from "../hooks/useGet";
import { usePost } from "../hooks/usePost";
import { useDelete } from "../hooks/useDelete";

export default function TransactionMovementsModal({
    selectedMonth,
    selectedYear,
    selectedDay,
    transaction,
    onClose,
    onDayChange,
    onCreateMovement,
    onDeleteMovement,
}) {
    const [localSelectedMonth, setLocalSelectedMonth] = useState(selectedMonth);
    const [localSelectedYear, setLocalSelectedYear] = useState(selectedYear);
    const [localSelectedDay, setLocalSelectedDay] = useState(
        selectedDay || new Date().getDate()
    );

    const {
        data,
        loading,
        error,
        reload,
    } = useGet(
        transaction?.id
            ? API_ENDPOINTS.transactionMovements({
                transaction_id: transaction.id,
                year: localSelectedYear,
                month: localSelectedMonth,
            })
            : null
    );

    const {
        postData,
        loading: creatingMovement,
        error: createError,
    } = usePost();

    const {
        deleteData,
        loading: deletingMovement,
        error: deleteError,
    } = useDelete();

    const [formData, setFormData] = useState({
        name: "",
        amount: "",
        note: "",
    });

    const movements = Array.isArray(data) ? data : [];

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

    async function handleSubmit(e) {
        e.preventDefault();

        const amount = Number(formData.amount);

        if (!formData.name.trim()) return;
        if (Number.isNaN(amount) || amount <= 0) return;
        if (!transaction?.id) return;

        const movementDate = `${localSelectedYear}-${String(
            localSelectedMonth
        ).padStart(2, "0")}-${String(localSelectedDay).padStart(2, "0")}`;

        const payload = {
            transaction_id: transaction.id,
            name: formData.name.trim(),
            amount,
            movement_date: movementDate,
            note: formData.note.trim(),
        };

        const createdMovement = await postData(API_ENDPOINTS.transactionMovements(), payload);

        onCreateMovement?.(createdMovement);

        reload?.();

        setFormData({
            name: "",
            amount: "",
            note: "",
        });
    }

    async function handleDeleteMovement(movement) {
        if (!movement?.id) return;

        await deleteData(
            API_ENDPOINTS.transactionMovements( {id:movement.id}  ),
        );

        onDeleteMovement?.(movement);

        reload?.();
    }

    const filteredMovements = useMemo(() => {
        return movements.filter((movement) => {
            const [, , day] = movement.movement_date?.split("-") ?? [];

            return Number(day) === Number(localSelectedDay);
        });
    }, [movements, localSelectedDay]);

    const total = useMemo(() => {
        return filteredMovements.reduce((sum, movement) => {
            return sum + Number(movement.amount || 0);
        }, 0);
    }, [filteredMovements]);

    const isSubmitting = creatingMovement;
    const isDeleting = deletingMovement;

    return (
        <div className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden">
            <div className="grid shrink-0 grid-cols-1 gap-4 border-b border-slate-200 px-0 pb-3 md:grid-cols-[300px_minmax(0,1fr)]">
                <MonthNavigator
                    month={getMonthByNum(localSelectedMonth)}
                    year={localSelectedYear}
                    handleNextMonth={handleNextMonth}
                    handlePreviousMonth={handlePreviousMonth}
                />

                <div className="min-w-0">
                    <MonthDaysCarousel
                        selectedMonth={localSelectedMonth}
                        selectedYear={localSelectedYear}
                        selectedDay={localSelectedDay}
                        onDayChange={handleDayChange}
                    />
                </div>
            </div>

            <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-hidden px-0 py-4 md:grid-cols-[300px_minmax(0,1fr)]">
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
                        <Input
                            label="Nome"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Es. Spesa supermercato"
                        />

                        <Input
                            label="Quantità"
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleInputChange}
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                        />

                        <Textarea
                            label="Note"
                            name="note"
                            value={formData.note}
                            onChange={handleInputChange}
                            placeholder="Note opzionali"
                            rows={5}
                        />
                    </div>

                    {createError && (
                        <p className="mt-3 text-xs font-medium text-red-600">
                            Errore durante la creazione del movimento.
                        </p>
                    )}

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-auto w-full"
                    >
                        {isSubmitting ? (
                            <>
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                Inserimento...
                            </>
                        ) : (
                            <>
                                <Plus size={16} />
                                Inserisci movimento
                            </>
                        )}
                    </Button>
                </form>

                <div className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-3 py-2">
                        <div className="min-w-0">
                            <h3 className="truncate text-sm font-semibold text-slate-900">
                                Movimenti
                            </h3>

                            <p className="truncate text-xs text-slate-500">
                                {loading
                                    ? "Caricamento..."
                                    : `${filteredMovements.length} movimenti trovati`}
                            </p>

                            {(error || deleteError) && (
                                <p className="truncate text-xs text-red-500">
                                    Errore nel caricamento o eliminazione dei movimenti
                                </p>
                            )}
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                            <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={handleTodayClick}
                                className="h-7 rounded-md px-2 text-[11px]"
                            >
                                Oggi
                            </Button>

                            <p className="text-sm font-semibold text-slate-900">
                                {formatCurrency(total)}
                            </p>
                        </div>
                    </div>

                    <div className="min-h-0 flex-1 overflow-y-auto p-3">
                        {filteredMovements.length > 0 ? (
                            <div className="space-y-2">
                                {filteredMovements.map((movement) => {
                                    const amount = Number(movement.amount || 0);
                                    const isExpense = amount < 0;

                                    return (
                                        <div
                                            key={movement.id}
                                            className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
                                        >
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium text-slate-900">
                                                    {movement.name ||
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

                                                <IconButton
                                                    icon={Trash2}
                                                    variant="danger"
                                                    size="sm"
                                                    title="Elimina movimento"
                                                    disabled={isDeleting}
                                                    onClick={() =>
                                                        handleDeleteMovement(
                                                            movement
                                                        )
                                                    }
                                                    className="border-transparent bg-transparent hover:bg-white"
                                                />
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

            <div className="flex shrink-0 items-center justify-end gap-2 border-t border-slate-200 px-0 pt-3">
                <Button type="button" variant="secondary" onClick={onClose}>
                    Chiudi
                </Button>
            </div>
        </div>
    );
}