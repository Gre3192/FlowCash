import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { MONTHS } from "../constants/month.js";
import IconButton from "./../ui/IconButton.jsx";

export default function MonthNavigator({

    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    availableYears,
    currentYear,

}) {

    const rootRef = useRef(null);
    const pickerRef = useRef(null);

    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [pickerPosition, setPickerPosition] = useState({
        top: 0,
        left: 0,
        width: 300,
    });


    const monthLabel = MONTHS.find((item) => item.value === Number(selectedMonth))?.label ?? selectedMonth;

    function updatePickerPosition() {
        const element = rootRef.current;
        if (!element) return;

        const rect = element.getBoundingClientRect();

        const pickerWidth = 300;
        const viewportPadding = 16;

        let left = rect.left + rect.width / 2 - pickerWidth / 2;

        left = Math.max(
            viewportPadding,
            Math.min(left, window.innerWidth - pickerWidth - viewportPadding)
        );

        setPickerPosition({
            top: rect.bottom + 8,
            left,
            width: pickerWidth,
        });
    }

    function togglePicker() {
        setIsPickerOpen((prev) => {
            const next = !prev;

            if (next) {
                requestAnimationFrame(updatePickerPosition);
            }

            return next;
        });
    }

    useEffect(() => {
        if (!isPickerOpen) return;

        function handleClickOutside(e) {
            const clickedRoot = rootRef.current?.contains(e.target);
            const clickedPicker = pickerRef.current?.contains(e.target);

            if (!clickedRoot && !clickedPicker) {
                setIsPickerOpen(false);
            }
        }

        function handleKeyDown(e) {
            if (e.key === "Escape") {
                setIsPickerOpen(false);
            }
        }

        function handleReposition() {
            updatePickerPosition();
        }

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);
        window.addEventListener("resize", handleReposition);
        window.addEventListener("scroll", handleReposition, true);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("resize", handleReposition);
            window.removeEventListener("scroll", handleReposition, true);
        };
    }, [isPickerOpen]);

    const minYear = Math.min(...availableYears);
    const maxYear = Math.max(...availableYears);

    const isPrevDisabled = selectedYear === minYear && selectedMonth === 1;
    const isNextDisabled = selectedYear === maxYear && selectedMonth === 12;

    const handlePreviousMonth = () => {
        if (isPrevDisabled) return;

        console.log(typeof selectedMonth, selectedMonth);


        if (selectedMonth === 1) {
            setSelectedMonth(12);
            setSelectedYear(selectedYear - 1);
        } else {
            setSelectedMonth(selectedMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (isNextDisabled) return;

        console.log(typeof selectedMonth, selectedMonth);

        if (selectedMonth === 12) {
            setSelectedMonth(1);
            setSelectedYear(selectedYear + 1);
        } else {
            setSelectedMonth(selectedMonth + 1);
        }
    };

    console.log(selectedYear, selectedMonth);


    const onMonthYearChange = () => {
        setSelectedYear(selectedYear)
        setSelectedMonth(selectedMonth)
    }

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
                    className="h-8 w-8 text-slate-500 hover:bg-white hover:text-slate-900"
                />

                <div className="flex min-w-0 items-center gap-2 text-center">
                    <p className="truncate text-sm font-semibold text-slate-900">
                        {monthLabel} {selectedYear}
                    </p>

                    <button
                        type="button"
                        onClick={togglePicker}
                        title="Seleziona mese e anno"
                        className={`
                            inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg transition
                            ${isPickerOpen
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
                    className="h-8 w-8 text-slate-500 hover:bg-white hover:text-slate-900"
                />

            </div>

            {isPickerOpen && (
                <MonthsYearsPicker
                    pickerRef={pickerRef}
                    pickerPosition={pickerPosition}
                    selectedYear={selectedYear}
                    setSelectedYear={setSelectedYear}
                    selectedMonth={selectedMonth}
                    setSelectedMonth={setSelectedMonth}
                    availableYears={availableYears}
                    setIsPickerOpen={setIsPickerOpen}
                    currentYear={currentYear}
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
    pickerRef,
    pickerPosition,
    availableYears,
    setIsPickerOpen,
    currentYear

}) {

    const [selectedLocalYear, setSelectedLocalYear] = useState(currentYear)

    function handleMonthClick(selectedMonth) {
        setSelectedMonth(selectedMonth)
        setSelectedYear(selectedLocalYear)
        setIsPickerOpen(false);
    }

    function handleYearChange(e) {
        setSelectedLocalYear(Number(e.target.value))
    }

    function handleTodayClick() {
        const today = new Date();
        setSelectedMonth(today.getMonth() + 1)
        setSelectedYear(today.getFullYear())
        setIsPickerOpen(false);
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
            className="z-10000 rounded-xl border border-slate-200 bg-white p-3 shadow-xl"
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
                        className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                    >
                        Oggi
                    </button>

                    <select
                        value={selectedLocalYear}
                        onChange={handleYearChange}
                        className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs font-medium text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
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

                    const isSelected = Number(item.value) === Number(selectedMonth);

                    return (
                        <button
                            key={item.value}
                            type="button"
                            onClick={() => handleMonthClick(item.value)}
                            className={`
                                        cursor-pointer rounded-lg border px-2 py-2 text-xs font-medium transition
                                        ${isSelected
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
    )
}