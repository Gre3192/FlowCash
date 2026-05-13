import { useEffect, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { MONTHS } from "../constants/month.js";
import IconButton from "./../ui/IconButton.jsx";

export default function MonthNavigator({
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    selectedDay,
    setSelectedDay,
    availableYears = [],
    currentYear,
}) {
    const rootRef = useRef(null);
    const pickerRef = useRef(null);

    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [pickerPosition, setPickerPosition] = useState(null);

    const normalizedSelectedMonth = Number(selectedMonth);
    const normalizedSelectedYear = Number(selectedYear);

    const monthLabel =
        MONTHS.find((item) => Number(item.value) === normalizedSelectedMonth)
            ?.label ?? selectedMonth;

    const minYear = availableYears.length
        ? Math.min(...availableYears)
        : currentYear;

    const maxYear = availableYears.length
        ? Math.max(...availableYears)
        : currentYear;

    const isPrevDisabled =
        normalizedSelectedYear === minYear && normalizedSelectedMonth === 1;

    const isNextDisabled =
        normalizedSelectedYear === maxYear && normalizedSelectedMonth === 12;

    function getPickerPosition() {
        const element = rootRef.current;
        if (!element) return null;

        const rect = element.getBoundingClientRect();

        const pickerWidth = 300;
        const viewportPadding = 16;

        let left = rect.left + rect.width / 2 - pickerWidth / 2;

        left = Math.max(
            viewportPadding,
            Math.min(left, window.innerWidth - pickerWidth - viewportPadding)
        );

        return {
            top: rect.bottom + 8,
            left,
            width: pickerWidth,
        };
    }

    function updatePickerPosition() {
        const nextPosition = getPickerPosition();
        if (!nextPosition) return;
        setPickerPosition(nextPosition);
    }

    function togglePicker() {
        setIsPickerOpen((prev) => {
            const next = !prev;

            if (next) {
                const nextPosition = getPickerPosition();

                if (!nextPosition) return false;

                setPickerPosition(nextPosition);
            }

            return next;
        });
    }

    function handlePreviousMonth() {
        if (isPrevDisabled) return;

        if (normalizedSelectedMonth === 1) {
            setSelectedMonth(12);
            setSelectedYear(normalizedSelectedYear - 1);
        } else {
            setSelectedMonth(normalizedSelectedMonth - 1);
        }
    }

    function handleNextMonth() {
        if (isNextDisabled) return;

        if (normalizedSelectedMonth === 12) {
            setSelectedMonth(1);
            setSelectedYear(normalizedSelectedYear + 1);
        } else {
            setSelectedMonth(normalizedSelectedMonth + 1);
        }
    }

    useEffect(() => {
        if (!isPickerOpen) return;

        function handlePointerDown(e) {
            const clickedRoot = rootRef.current?.contains(e.target);
            const clickedPicker = pickerRef.current?.contains(e.target);

            if (!clickedRoot && !clickedPicker) {
                setIsPickerOpen(false);
                setPickerPosition(null);
            }
        }

        function handleKeyDown(e) {
            if (e.key === "Escape") {
                setIsPickerOpen(false);
                setPickerPosition(null);
            }
        }

        document.addEventListener("pointerdown", handlePointerDown, true);
        document.addEventListener("keydown", handleKeyDown);
        window.addEventListener("resize", updatePickerPosition);
        window.addEventListener("scroll", updatePickerPosition, true);

        return () => {
            document.removeEventListener("pointerdown", handlePointerDown, true);
            document.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("resize", updatePickerPosition);
            window.removeEventListener("scroll", updatePickerPosition, true);
        };
    }, [isPickerOpen]);

    return (
        <>
            <div
                ref={rootRef}
                className="relative flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
            >
                <IconButton
                    type="button"
                    onClick={handlePreviousMonth}
                    icon={ChevronLeft}
                    size="sm"
                    variant="ghost"
                    disabled={isPrevDisabled}
                    className="h-8 w-8 text-slate-500 hover:bg-white hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
                />

                <div className="flex min-w-0 items-center gap-2 text-center">
                    <p className="truncate text-sm font-semibold text-slate-900">
                        {monthLabel} {normalizedSelectedYear}
                    </p>

                    <button
                        type="button"
                        onClick={togglePicker}
                        title="Seleziona mese e anno"
                        className={`
                            inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg transition
                            ${
                                isPickerOpen
                                    ? "bg-white text-slate-900 shadow-sm"
                                    : "text-slate-500 hover:bg-white hover:text-slate-900"
                            }
                        `}
                    >
                        <CalendarDays size={15} />
                    </button>
                </div>

                <IconButton
                    type="button"
                    onClick={handleNextMonth}
                    size="sm"
                    variant="ghost"
                    icon={ChevronRight}
                    disabled={isNextDisabled}
                    className="h-8 w-8 text-slate-500 hover:bg-white hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
                />
            </div>

            {isPickerOpen && pickerPosition && (
                <MonthsYearsPicker
                    pickerRef={pickerRef}
                    pickerPosition={pickerPosition}
                    selectedYear={normalizedSelectedYear}
                    setSelectedYear={setSelectedYear}
                    selectedMonth={normalizedSelectedMonth}
                    setSelectedMonth={setSelectedMonth}
                    selectedDay={selectedDay}
                    setSelectedDay={setSelectedDay}
                    availableYears={availableYears}
                    setIsPickerOpen={setIsPickerOpen}
                    setPickerPosition={setPickerPosition}
                />
            )}
        </>
    );
}

function MonthsYearsPicker({
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    selectedDay,
    setSelectedDay,
    pickerRef,
    pickerPosition,
    availableYears = [],
    setIsPickerOpen,
    setPickerPosition,
}) {
    const [selectedLocalYear, setSelectedLocalYear] = useState(selectedYear);

    function closePicker() {
        setIsPickerOpen(false);
        setPickerPosition(null);
    }

    function handleMonthClick(month) {
        setSelectedMonth(Number(month));
        setSelectedYear(Number(selectedLocalYear));
        closePicker();
    }

    function handleYearChange(e) {
        setSelectedLocalYear(Number(e.target.value));
    }

    function handleTodayClick() {
        const today = new Date();

        setSelectedMonth(today.getMonth() + 1);
        setSelectedYear(today.getFullYear());

        if (typeof setSelectedDay === "function") {
            setSelectedDay(today.getDate());
        }

        closePicker();
    }

    return (
        <div
            ref={pickerRef}
            style={{
                position: "fixed",
                top: pickerPosition.top,
                left: pickerPosition.left,
                width: pickerPosition.width,
            }}
            className="z-[10000] rounded-xl border border-slate-200 bg-white p-3 shadow-xl"
        >
            <div className="mb-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                        Seleziona periodo
                    </p>

                    <p className="truncate text-xs text-slate-500">
                        Mese e anno
                    </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                    <button
                        type="button"
                        onClick={handleTodayClick}
                        className="h-8 cursor-pointer rounded-lg border border-slate-200 bg-white px-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                    >
                        Oggi
                    </button>

                    <select
                        value={selectedLocalYear}
                        onChange={handleYearChange}
                        className="h-8 cursor-pointer rounded-lg border border-slate-200 bg-white px-2 text-xs font-medium text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    >
                        {availableYears.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
                {MONTHS.map((item) => {
                    const isSelected =
                        Number(item.value) === Number(selectedMonth) &&
                        Number(selectedLocalYear) === Number(selectedYear);

                    return (
                        <button
                            key={item.value}
                            type="button"
                            onClick={() => handleMonthClick(item.value)}
                            className={`
                                cursor-pointer rounded-lg border px-2 py-2 text-xs font-medium transition
                                ${
                                    isSelected
                                        ? "border-slate-900 bg-slate-900 text-white"
                                        : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                }
                            `}
                        >
                            {item.label.slice(0, 3)}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}