import { CircleQuestionMark } from "lucide-react";
import ProgressBar from "./ProgressBar";

export default function BudgetCard({

  title,
  spent,
  limit,
  period = "Mensile",
  icon: Icon,

}) {

  const percentage = (spent / limit) * 100;
  const remaining = limit - spent;

  const isWarning = percentage >= 80 && percentage < 100;
  const isLimit = percentage === 100;
  const isOver = percentage > 100;

  const percentColor =
    isOver || isLimit
      ? "text-red-500"
      : isWarning
        ? "text-orange-500"
        : "text-slate-700";

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200">

      {/* HEADER */}
      <div className="flex justify-between items-start">

        <div className="flex gap-3 items-center">

          <div className="bg-slate-100 p-3 rounded-lg">
            {!Icon ? <CircleQuestionMark className="text-blue-500" size={40} /> : <Icon className="text-blue-500" size={40} />}
          </div>

          <div className="flex flex-col h-full justify-between">
            <div className="mb-2 font-semibold text-slate-800 text-2xl">
              {title}
            </div>

            <div className="text-base text-slate-500">
              €{spent.toFixed(2)} / €{limit.toFixed(2)}
              <span className="text-slate-400"> ({period})</span>
            </div>
          </div>

        </div>

        <div className="text-right">

          <p className={`font-semibold text-xl ${percentColor}`}>
            {percentage.toFixed(1)}%
          </p>

          {!isOver && (
            <p className="text-base text-slate-500">
              €{remaining.toFixed(2)} rimanenti
            </p>
          )}

          {isOver && (
            <p className="text-base text-red-500">
              €{Math.abs(remaining).toFixed(2)} oltre il limite
            </p>
          )}

        </div>

      </div>

      {/* PROGRESS BAR */}
      <ProgressBar percentage={percentage} />

      {/* MESSAGGI */}
      {isWarning && (
        <div className="text-base text-orange-500 mt-3">
          Attenzione: stai per raggiungere il limite
        </div>
      )}

      {isLimit && (
        <div className="text-base text-red-500 mt-3">
          Limite raggiunto
        </div>
      )}

      {isOver && (
        <div className="text-base text-red-600 mt-3">
          Hai superato il limite di spesa
        </div>
      )}

    </div>
  );
};