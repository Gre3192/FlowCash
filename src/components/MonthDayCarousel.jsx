import { useMemo, useRef, useState } from "react";
import getDaysOfMonth from "../utils/getDaysOfMonth";


export default function MonthDaysCarousel({
    selectedMonth,
    selectedYear,
    selectedDay,
    onDayChange,
}) {
    const scrollRef = useRef(null);

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

    function handlePointerDown(e) {
        const element = scrollRef.current;
        if (!element) return;

        stopInertia();

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

    function handlePointerUp(e) {
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

    return (
        <div className="w-full overflow-hidden rounded-lg border border-slate-200 bg-white px-2 py-1">
            <div
                ref={scrollRef}
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

                    return (
                        <button
                            key={day.id}
                            type="button"
                            data-day={day.dayNumber}
                            draggable={false}
                            className={`
                                flex min-w-[42px] flex-col items-center justify-center rounded-md border px-2 py-1 transition
                                ${
                                    isSelected
                                        ? "border-slate-900 bg-slate-900 text-white"
                                        : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                                }
                            `}
                        >
                            <span
                                className={`text-[9px] font-medium ${
                                    isSelected
                                        ? "text-slate-200"
                                        : "text-slate-500"
                                }`}
                            >
                                {day.dayName}
                            </span>

                            <span className="text-xs font-semibold leading-tight">
                                {day.dayNumber}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}