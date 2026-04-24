import { useMemo, useState, forwardRef } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { it } from "date-fns/locale";
import { ChevronLeft, Calendar, ChevronRight } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("it", it);

const MonthYearTrigger = forwardRef(function MonthYearTrigger(
  { value, onClick },
  ref
) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2"
    >
      <span className="text-[18px] font-medium text-slate-900">{value}</span>
      <Calendar size={18} className="text-slate-400 hover:text-slate-600 transition" />
    </button>
  );
});

export default function MonthBanner({

  selectedDate,
  setSelectedDate

}) {
  // const [selectedDate, setSelectedDate] = useState(new Date(2026, 2, 1));

  const formattedValue = useMemo(() => {
    return selectedDate.toLocaleDateString("it-IT", {
      month: "long",
      year: "numeric",
    });
  }, [selectedDate]);

  const handlePrevMonth = () => {
    setSelectedDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setSelectedDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white h-[68px] flex items-center justify-center px-6">
      <div className="flex items-center gap-8">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="inline-flex items-center justify-center text-slate-800 hover:text-slate-600 transition"
        >
          <ChevronLeft size={22} />
        </button>

        <DatePicker
          selected={selectedDate}
          onChange={(date) => {
            if (date) setSelectedDate(new Date(date.getFullYear(), date.getMonth(), 1));
          }}
          showMonthYearPicker
          locale="it"
          dateFormat="MMMM yyyy"
          customInput={<MonthYearTrigger value={formattedValue} />}
          popperPlacement="bottom"
          calendarClassName="shadow-lg border border-slate-200 rounded-xl"
        />

        <button
          type="button"
          onClick={handleNextMonth}
          className="inline-flex items-center justify-center text-slate-800 hover:text-slate-600 transition"
        >
          <ChevronRight size={22} />
        </button>
      </div>
    </div>
  );
}