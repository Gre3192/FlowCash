import { useMemo, useRef, useState } from "react";
import getDaysOfMonth from "../utils/getDaysOfMonth";
import getEasterHolidays from "../utils/getEasterHolidays";

export default function MonthDaysCarousel({

    selectedMonth,
    selectedYear,
    selectedDay,
    onDayChange,

}) {
    const scrollRef = useRef(null);
    const wheelFrameRef = useRef(null);
    const wheelTargetScrollLeftRef = useRef(0);

    const isPointerDownRef = useRef(false);
    const hasDraggedRef = useRef(false);

    const startXRef = useRef(0);
    const lastClientXRef = useRef(0);
    const startScrollLeftRef = useRef(0);

    const lastMoveTimeRef = useRef(0);
    const velocityRef = useRef(0);

    const animationFrameRef = useRef(null);
    const inertiaFrameRef = useRef(null);

    const pointerDownTargetRef = useRef(null);

    const [isDragging, setIsDragging] = useState(false);

    const calendarColorConfig = {
        weekend: {
            saturday: true,
            sunday: true,
        },
        holidays: [
            { month: 1, day: 1, label: "Capodanno" },
            { month: 1, day: 6, label: "Epifania" },
            { ...getEasterHolidays(selectedYear).easter, label: "Pasqua" },
            { ...getEasterHolidays(selectedYear).easterMonday, label: "Pasquetta" },
            { month: 4, day: 25, label: "Liberazione" },
            { month: 5, day: 1, label: "Festa dei lavoratori" },
            { month: 6, day: 2, label: "Festa della Repubblica" },
            { month: 8, day: 15, label: "Ferragosto" },
            { month: 11, day: 1, label: "Ognissanti" },
            { month: 12, day: 8, label: "Immacolata" },
            { month: 12, day: 25, label: "Natale" },
            { month: 12, day: 26, label: "Santo Stefano" },
        ],
    };


    const days = useMemo(() => {
        return getDaysOfMonth(selectedMonth, selectedYear);
    }, [selectedMonth, selectedYear]);

    function stopInertia() {
        if (inertiaFrameRef.current) {
            cancelAnimationFrame(inertiaFrameRef.current);
            inertiaFrameRef.current = null;
        }
    }

    function updateScroll() {
        const element = scrollRef.current;
        if (!element) return;

        const distance = lastClientXRef.current - startXRef.current;

        element.scrollLeft = startScrollLeftRef.current - distance;

        animationFrameRef.current = null;
    }

    function startInertia() {
        const element = scrollRef.current;
        if (!element) return;

        let velocity = velocityRef.current;

        const friction = 0.94;
        const minVelocity = 0.08;
        const startVelocityThreshold = 0.8;

        if (Math.abs(velocity) < startVelocityThreshold) {
            return;
        }

        function animate() {
            const currentElement = scrollRef.current;
            if (!currentElement) return;

            currentElement.scrollLeft -= velocity;
            velocity *= friction;

            if (Math.abs(velocity) > minVelocity) {
                inertiaFrameRef.current = requestAnimationFrame(animate);
            } else {
                inertiaFrameRef.current = null;
            }
        }

        inertiaFrameRef.current = requestAnimationFrame(animate);
    }

    function getDateInfo(dayNumber) {
        const date = new Date(selectedYear, selectedMonth - 1, dayNumber);

        const dayOfWeek = date.getDay();

        const isSunday = dayOfWeek === 0;
        const isSaturday = dayOfWeek === 6;

        const isWeekend =
            (calendarColorConfig.weekend.saturday && isSaturday) ||
            (calendarColorConfig.weekend.sunday && isSunday);

        const holiday = calendarColorConfig.holidays.find(
            (item) =>
                Number(item.month) === Number(selectedMonth) &&
                Number(item.day) === Number(dayNumber)
        );

        const isHoliday = Boolean(holiday);

        return {
            isWeekend,
            isHoliday,
            isRedDay: isWeekend || isHoliday,
            holidayLabel: holiday?.label,
        };
    }

    function handlePointerDown(e) {
        const element = scrollRef.current;
        if (!element) return;

        stopInertia();
        stopWheelAnimation();

        isPointerDownRef.current = true;
        hasDraggedRef.current = false;

        pointerDownTargetRef.current = e.target;

        startXRef.current = e.clientX;
        lastClientXRef.current = e.clientX;
        startScrollLeftRef.current = element.scrollLeft;

        lastMoveTimeRef.current = performance.now();
        velocityRef.current = 0;

        setIsDragging(true);
    }

    function handlePointerMove(e) {
        if (!isPointerDownRef.current) return;

        const distanceFromStart = e.clientX - startXRef.current;
        const absDistance = Math.abs(distanceFromStart);

        if (absDistance < 6) {
            return;
        }

        e.preventDefault();

        hasDraggedRef.current = true;

        const now = performance.now();
        const deltaX = e.clientX - lastClientXRef.current;
        const deltaTime = now - lastMoveTimeRef.current || 16;

        velocityRef.current = (deltaX / deltaTime) * 16;

        lastClientXRef.current = e.clientX;
        lastMoveTimeRef.current = now;

        if (!animationFrameRef.current) {
            animationFrameRef.current = requestAnimationFrame(updateScroll);
        }
    }

    function handlePointerUp() {
        if (!isPointerDownRef.current) return;

        isPointerDownRef.current = false;
        setIsDragging(false);

        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }

        if (hasDraggedRef.current) {
            startInertia();
            return;
        }

        const dayButton = pointerDownTargetRef.current?.closest("[data-day]");

        if (!dayButton) return;

        const dayNumber = Number(dayButton.dataset.day);

        if (!Number.isNaN(dayNumber)) {
            onDayChange?.(dayNumber);
        }
    }

    function handlePointerCancel() {
        isPointerDownRef.current = false;
        hasDraggedRef.current = false;
        setIsDragging(false);

        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }
    }

    function stopWheelAnimation() {
        if (wheelFrameRef.current) {
            cancelAnimationFrame(wheelFrameRef.current);
            wheelFrameRef.current = null;
        }
    }

    function handleWheel(e) {
        const element = scrollRef.current;
        if (!element) return;

        const canScrollHorizontally = element.scrollWidth > element.clientWidth;
        if (!canScrollHorizontally) return;

        const scrollAmount = e.deltaY || e.deltaX;
        if (!scrollAmount) return;

        e.preventDefault();

        stopInertia();

        if (!wheelFrameRef.current) {
            wheelTargetScrollLeftRef.current = element.scrollLeft;
        }

        wheelTargetScrollLeftRef.current += scrollAmount;

        const maxScrollLeft = element.scrollWidth - element.clientWidth;

        wheelTargetScrollLeftRef.current = Math.max(
            0,
            Math.min(wheelTargetScrollLeftRef.current, maxScrollLeft)
        );

        if (wheelFrameRef.current) return;

        function animateWheelScroll() {
            const currentElement = scrollRef.current;
            if (!currentElement) return;

            const distance =
                wheelTargetScrollLeftRef.current - currentElement.scrollLeft;

            currentElement.scrollLeft += distance * 0.18;

            if (Math.abs(distance) > 0.5) {
                wheelFrameRef.current = requestAnimationFrame(animateWheelScroll);
            } else {
                currentElement.scrollLeft = wheelTargetScrollLeftRef.current;
                wheelFrameRef.current = null;
            }
        }

        wheelFrameRef.current = requestAnimationFrame(animateWheelScroll);
    }

    return (
        <div className="w-full overflow-hidden rounded-lg border border-slate-200 bg-white px-2 py-1">
            <div
                ref={scrollRef}
                onWheel={handleWheel}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerCancel}
                onPointerLeave={handlePointerCancel}
                className={`
                    flex touch-pan-x select-none gap-1 overflow-x-auto
                    [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
                    ${isDragging ? "cursor-grabbing" : "cursor-grab"}
                `}
            >
                {days.map((day) => {
                    const isSelected = Number(selectedDay) === day.dayNumber;

                    const { isRedDay, isHoliday, holidayLabel } = getDateInfo(
                        day.dayNumber
                    );

                    return (
                        <button
                            key={day.id}
                            type="button"
                            data-day={day.dayNumber}
                            title={holidayLabel || undefined}
                            draggable={false}
                            className={`
                                    relative cursor-pointer flex min-w-10.5 flex-col items-center justify-center rounded-md border px-2 py-1 transition
                                    ${isSelected
                                    ? "border-slate-900 bg-slate-900 text-white"
                                    : isRedDay
                                        ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                                        : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                                }
                            `}
                        >
                            <span
                                className={`
                                    text-[9px] font-medium
                                    ${isSelected
                                        ? "text-slate-200"
                                        : isRedDay
                                            ? "text-red-500"
                                            : "text-slate-500"
                                    }
                                `}
                            >
                                {day.dayName}
                            </span>

                            <span className="text-xs font-semibold leading-tight">
                                {day.dayNumber}
                            </span>

                            {isHoliday && !isSelected && (
                                <span className="pointer-events-none absolute bottom-0.5 h-0.5 w-0.5 rounded-full bg-red-500" />
                            )}
                            {isHoliday && !isSelected && (
                                <span className="pointer-events-none absolute top-0.5 h-0.5 w-5 rounded-full bg-red-500" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}