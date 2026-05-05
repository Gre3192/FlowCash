import {  ChevronLeft, ChevronRight} from "lucide-react";


export default function MonthNavigator({

    handlePreviousMonth,
    handleNextMonth,
    month,
    year

}) {

    return (
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
                    {month}{" "}
                    {year}
                </p>
            </div>

            <button
                type="button"
                onClick={handleNextMonth}
                className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition hover:bg-white hover:text-slate-900"
            >
                <ChevronRight size={17} />
            </button>
        </div>
    )

}