


const BudgetCard = ({
  title,
  spent,
  limit,
  period = "Mensile",
  icon: Icon,
}) => {

  const percentage = (spent / limit) * 100;
  const remaining = limit - spent;

  const isWarning = percentage >= 80 && percentage < 100;
  const isLimit = percentage === 100;
  const isOver = percentage > 100;

  const progressColor =
    isOver || isLimit
      ? "bg-red-500"
      : isWarning
      ? "bg-orange-500"
      : "bg-slate-900";

  const percentColor =
    isOver || isLimit
      ? "text-red-500"
      : isWarning
      ? "text-orange-500"
      : "text-slate-700";

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">

      {/* HEADER */}
      <div className="flex justify-between items-start">

        <div className="flex gap-3 items-center">

          <div className="bg-slate-100 p-3 rounded-lg">
            {Icon && <Icon className="text-blue-500" size={22} />}
          </div>

          <div>
            <h3 className="font-semibold text-slate-800 text-lg">
              {title}
            </h3>

            <p className="text-sm text-slate-500">
              €{spent.toFixed(2)} / €{limit.toFixed(2)}
              <span className="text-slate-400"> ({period})</span>
            </p>
          </div>

        </div>

        <div className="text-right">

          <p className={`font-semibold ${percentColor}`}>
            {percentage.toFixed(1)}%
          </p>

          {!isOver && (
            <p className="text-sm text-slate-500">
              €{remaining.toFixed(2)} rimanenti
            </p>
          )}

          {isOver && (
            <p className="text-sm text-red-500">
              €{Math.abs(remaining).toFixed(2)} oltre il limite
            </p>
          )}

        </div>

      </div>

      {/* PROGRESS BAR */}
      <div className="mt-4">
        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">

          <div
            className={`h-2 rounded-full transition-all duration-300 ${progressColor}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />

        </div>
      </div>

      {/* MESSAGGI */}
      {isWarning && (
        <p className="text-sm text-orange-500 mt-3">
          Attenzione: stai per raggiungere il limite
        </p>
      )}

      {isLimit && (
        <p className="text-sm text-red-500 mt-3">
          Limite raggiunto
        </p>
      )}

      {isOver && (
        <p className="text-sm text-red-600 mt-3">
          Hai superato il limite di spesa
        </p>
      )}

    </div>
  );
};

export default BudgetCard;