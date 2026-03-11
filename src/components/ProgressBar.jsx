import React from 'react';

export default function ProgressBar({ percentage }) {

    const isWarning = percentage >= 80 && percentage < 100;
    const isLimit = percentage === 100;
    const isOver = percentage > 100;

    const progressColor =
        isOver || isLimit
            ? "bg-red-500"
            : isWarning
                ? "bg-orange-500"
                : "bg-slate-900";

    return (
        <div className="mt-4">
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                    className={`h-2 rounded-full transition-all duration-300 ${progressColor}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                />

            </div>
        </div>
    );
};