import { CircleQuestionMark, CircleCheck, Pencil, TriangleAlert, CircleX, ReceiptText, Wallet, ScrollText, Trash2 } from "lucide-react";
import ProgressBar from "./ProgressBar";

export default function BudgetCard({
  title,
  spent,
  limit,
  icon: Icon,
  onBudgetClick,
  budgetType,
}) {

  const percentage = limit > 0 ? (spent / limit) * 100 : 0;
  const safePercentage = Math.min(percentage, 100);
  const remaining = limit - spent;

  const formatEuro = (value) =>
    `${value.toLocaleString("it-IT", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} €`;

  const isWarning = percentage >= 80 && percentage < 100;
  const isLimit = percentage === 100;
  const isOver = percentage > 100;

  const progressColorBg = isOver || isLimit ? "bg-red-500" : isWarning ? "bg-amber-500" : "bg-amber-400";
  const progressColorText = isOver || isLimit ? "text-red-500" : isWarning ? "text-amber-500" : "text-slate-600";

  return (
    <div className="w-full bg-white border border-slate-200 rounded-[28px] p-6 shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer">

      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0">
            {!Icon ? (
              <CircleQuestionMark className="text-blue-500" size={30} />
            ) : (
              <Icon className="text-blue-500" size={30} />
            )}
          </div>

          <div className="min-w-0">
            <div className="text-[20px] font-semibold text-slate-900 leading-none mb-1">
              {title}
            </div>

            <div className="text-sm text-slate-500">
              {formatEuro(spent)} / {formatEuro(limit)}
            </div>
          </div>
        </div>

        <div className="shrink-0 flex flex-col items-end">


          <div className="flex items-center gap-2">
            <div className="mb-1 inline-flex items-center gap-2 rounded-full bg-slate-100 px-2 py-1">
              {
                isOver || isLimit ?
                  <CircleX size={18} className="text-red-500" /> :
                  isWarning ?
                    <TriangleAlert size={18} className="text-amber-500" /> :
                    <CircleCheck size={18} className="text-emerald-500" />
              }
              <span className={`text-[16px] font-medium`}  >
                {percentage.toFixed(1)}%
              </span>
            </div>
            <Trash2 size={16} className="text-red-500 mb-1" />
          </div>


          {isWarning && (
            <div className="text-xs text-orange-500">
              Attenzione: stai per raggiungere il limite
            </div>
          )}

          {isLimit && (
            <div className="text-xs text-red-500">
              Limite raggiunto
            </div>
          )}

          {isOver && (
            <div className="text-xs text-red-600">
              Hai superato il limite di spesa
            </div>
          )}
        </div>
      </div>

      <ProgressBar percentage={percentage} />

      {
        budgetType !== 'category' ?
          <div>
            {/* DIVIDER */}
            <div className="mt-3 border-t border-slate-200" />

            {/* FOOTER */}
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm text-slate-500 mt-2">
                  {isOver ? 'Fuori budget di:' : 'Rimanenti:'}
                </div>
                <div className={`text-lg font-semibold ${progressColorText}`} >
                  {/* {remaining < 0 ? `-${formatEuro(Math.abs(remaining))}` : formatEuro(remaining)} */}
                  {formatEuro(Math.abs(remaining))}
                </div>
              </div>
              {
                !budgetType ?
                  <div className="flex items-center gap-2">
                    <div
                      onClick={onBudgetClick}
                      className="mt-2 rounded-full w-fit inline-flex items-center justify-center gap-2 bg-slate-100 px-3 h-11 text-[16px] font-medium text-slate-800 hover:bg-slate-200 transition-colors whitespace-nowrap shrink-0"
                    >
                      <ReceiptText size={15} />
                      Spese
                    </div>
                    <div
                      onClick={onBudgetClick}
                      className="mt-2 rounded-full w-fit inline-flex items-center justify-center gap-2 bg-slate-100 px-3 h-11 text-[16px] font-medium text-slate-800 hover:bg-slate-200 transition-colors whitespace-nowrap shrink-0"
                    >
                      <Wallet size={15} />
                      Budget
                    </div>
                  </div>
                  :
                  <div
                    onClick={onBudgetClick}
                    className="mt-2 rounded-full w-fit inline-flex items-center justify-center gap-2 bg-slate-100 px-3 h-11 text-[16px] font-medium text-slate-800 hover:bg-slate-200 transition-colors whitespace-nowrap shrink-0"
                  >
                    <ScrollText size={15} />
                    Transazioni
                  </div>
              }
            </div>
          </div>
          :
          null
      }

    </div>
  );
}