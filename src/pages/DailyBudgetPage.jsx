import React from "react";
import {
  CalendarDays,
  Save,
  Plus,
  BadgeEuro,
  Tag,
  Trash2,
} from "lucide-react";

const dailyData = {
  selectedDateLabel: "gio 12 mar",
  selectedDateValue: "12/03/2026",
  incomeTotal: 3806,
  expenseTotal: 453,
  balance: 3353,

  expenses: [
    {
      id: "exp-cat-1",
      title: "Alimentari",
      total: 453,
      items: [
        {
          id: "exp-item-1",
          name: "Frutta e Verdura",
          amount: 453,
        },
      ],
    },
  ],

  incomes: [
    {
      id: "inc-cat-1",
      title: "Freelance",
      total: 3806,
      items: [
        {
          id: "inc-item-1",
          name: "Consulenza",
          amount: 353,
        },
        {
          id: "inc-item-2",
          name: "Commissione",
          amount: 3453,
        },
      ],
    },
  ],
};

const formatCurrency = (value, withSign = false) => {
  const formatted = `€${Number(value).toFixed(2)}`;
  if (!withSign) return formatted;
  return value > 0 ? `+${formatted}` : formatted;
};

const SummaryCard = ({ title, value, colorClass, bigText = false }) => {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white px-8 py-9 shadow-sm">
      <p className="text-[18px] text-slate-600">{title}</p>
      <p
        className={`mt-3 ${
          bigText ? "text-[22px]" : "text-[20px]"
        } font-semibold ${colorClass}`}
      >
        {value}
      </p>
    </div>
  );
};

const SectionCard = ({
  title,
  total,
  type = "expense",
  data = [],
  icon,
  onDeleteItem,
}) => {
  const isIncome = type === "income";

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[22px]">{icon}</span>
          <h3 className="text-[18px] font-semibold text-slate-900">{title}</h3>
        </div>

        <span
          className={`text-[20px] font-semibold ${
            isIncome ? "text-emerald-500" : "text-red-500"
          }`}
        >
          {formatCurrency(total)}
        </span>
      </div>

      <div className="space-y-5">
        {data.map((category) => (
          <div
            key={category.id}
            className={`rounded-[22px] border p-5 ${
              isIncome
                ? "border-emerald-100 bg-emerald-50/40"
                : "border-slate-200 bg-slate-50/70"
            }`}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Tag size={20} className="text-slate-900" />
                <span className="text-[17px] font-semibold text-slate-900">
                  {category.title}
                </span>
              </div>

              <span
                className={`text-[18px] font-semibold ${
                  isIncome ? "text-emerald-500" : "text-red-500"
                }`}
              >
                {formatCurrency(category.total)}
              </span>
            </div>

            <div className="space-y-3">
              {category.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-[16px] bg-white px-5 py-5"
                >
                  <span className="text-[17px] text-slate-900">{item.name}</span>

                  <div className="flex items-center gap-5">
                    <span
                      className={`text-[17px] font-semibold ${
                        isIncome ? "text-emerald-500" : "text-red-500"
                      }`}
                    >
                      {formatCurrency(item.amount)}
                    </span>

                    <button
                      type="button"
                      onClick={() => onDeleteItem?.(item.id)}
                      className="text-red-500 transition hover:scale-105 hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function DailyExpensesPage() {
  const handleSaveAll = () => {
    console.log("Salva tutto");
  };

  const handleAddNewEntry = () => {
    console.log("Aggiungi nuova voce");
  };

  const handleDeleteItem = (id) => {
    console.log("Elimina item:", id);
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8] p-5 md:p-8">
      <div className="mx-auto max-w-[1400px]">
        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h1 className="text-[28px] font-bold tracking-[-0.02em] text-slate-950 md:text-[38px]">
              Spese Giornaliere
            </h1>
            <p className="mt-2 text-[18px] text-slate-600">
              Registra le tue entrate e uscite giorno per giorno
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3 rounded-[16px] bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">
              <CalendarDays size={22} className="text-slate-400" />
              <input
                type="text"
                value={dailyData.selectedDateValue}
                readOnly
                className="w-[170px] bg-transparent text-[16px] font-medium text-slate-900 outline-none"
              />
            </div>

            <button
              type="button"
              onClick={handleSaveAll}
              className="inline-flex items-center justify-center gap-2 rounded-[16px] bg-[#020522] px-6 py-4 text-[16px] font-semibold text-white transition hover:opacity-95"
            >
              <Save size={18} />
              Salva Tutto
            </button>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            title="Data selezionata"
            value={dailyData.selectedDateLabel}
            colorClass="text-slate-950"
            bigText
          />
          <SummaryCard
            title="Entrate del giorno"
            value={formatCurrency(dailyData.incomeTotal)}
            colorClass="text-emerald-500"
          />
          <SummaryCard
            title="Uscite del giorno"
            value={formatCurrency(dailyData.expenseTotal)}
            colorClass="text-red-500"
          />
          <SummaryCard
            title="Bilancio giornaliero"
            value={formatCurrency(dailyData.balance, true)}
            colorClass="text-blue-500"
          />
        </div>

        {/* ACTION */}
        <div className="mb-8">
          <button
            type="button"
            onClick={handleAddNewEntry}
            className="inline-flex items-center gap-3 rounded-[16px] bg-[#020522] px-6 py-4 text-[16px] font-semibold text-white transition hover:opacity-95"
          >
            <Plus size={22} />
            Aggiungi Nuova Voce
          </button>
        </div>

        {/* CONTENT */}
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
          <SectionCard
            title="Uscite del 12 marzo"
            total={dailyData.expenseTotal}
            type="expense"
            data={dailyData.expenses}
            icon="💸"
            onDeleteItem={handleDeleteItem}
          />

          <SectionCard
            title="Entrate del 12 marzo"
            total={dailyData.incomeTotal}
            type="income"
            data={dailyData.incomes}
            icon="💰"
            onDeleteItem={handleDeleteItem}
          />
        </div>
      </div>
    </div>
  );
}