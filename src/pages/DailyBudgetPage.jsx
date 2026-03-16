import React from "react";
import {
  CalendarDays,
  Save,
  Plus,
  Tag,
  Trash2,
  Wallet,
  BanknoteArrowUp,
} from "lucide-react";

const dailyData = {
  dateLabel: "gio 12 mar",
  dateValue: "12/03/2026",
  incomeTotal: 690690,
  expenseTotal: 56345,
  balance: 634345,
  expenses: [
    {
      id: 1,
      category: "Alimentari",
      total: 56345,
      items: [
        { id: 11, name: "Frutta e Verdura", amount: 56345 },
      ],
    },
  ],
  incomes: [
    {
      id: 2,
      category: "Freelance",
      total: 690690,
      items: [
        { id: 21, name: "Consulenza", amount: 345345 },
        { id: 22, name: "Consulenza", amount: 345345 },
      ],
    },
  ],
};

const formatCurrency = (value) => `€${value.toFixed(2)}`;

const SummaryCard = ({ title, value, color = "text-slate-900" }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-6 shadow-sm min-h-[100px] flex flex-col justify-center">
      <span className="text-[15px] text-slate-600">{title}</span>
      <span className={`mt-2 text-[18px] font-semibold ${color}`}>{value}</span>
    </div>
  );
};

const SectionCard = ({
  title,
  total,
  totalColor,
  icon,
  iconBg,
  items,
  itemAmountColor,
  sectionTone = "bg-white",
}) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex h-8 w-8 items-center justify-center rounded-full ${iconBg}`}>
            {icon}
          </div>
          <h3 className="text-[30px] leading-none font-semibold text-slate-900 tracking-tight">
            {title}
          </h3>
        </div>

        <span className={`text-[18px] font-semibold ${totalColor}`}>
          {formatCurrency(total)}
        </span>
      </div>

      <div className={`mt-6 rounded-2xl border border-slate-200 p-4 ${sectionTone}`}>
        {items.map((group) => (
          <div key={group.id} className="rounded-2xl bg-white/60">
            <div className="flex items-center justify-between px-2 py-2">
              <div className="flex items-center gap-2 text-slate-900">
                <Tag size={16} className="text-slate-500" />
                <span className="text-[16px] font-medium">{group.category}</span>
              </div>

              <span className={`text-[16px] font-semibold ${itemAmountColor}`}>
                {formatCurrency(group.total)}
              </span>
            </div>

            <div className="mt-2 space-y-2">
              {group.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl bg-white px-4 py-4"
                >
                  <span className="text-[15px] text-slate-900">{item.name}</span>

                  <div className="flex items-center gap-4">
                    <span className={`text-[15px] font-semibold ${itemAmountColor}`}>
                      {formatCurrency(item.amount)}
                    </span>
                    <button
                      className="text-red-500 transition hover:scale-110 hover:text-red-600"
                      type="button"
                    >
                      <Trash2 size={16} />
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

export default function DailyBudgetPage() {
  return (
    <div className="min-h-screen bg-[#f6f7f9] p-8">
      <div className="mx-auto max-w-[1280px]">
        {/* HEADER */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-[42px] font-semibold tracking-tight text-slate-950">
              Spese Giornaliere
            </h1>
            <p className="mt-1 text-[18px] text-slate-500">
              Registra le tue entrate e uscite giorno per giorno
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex h-12 min-w-[260px] items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 shadow-sm">
              <CalendarDays size={18} className="text-slate-400" />
              <input
                type="text"
                defaultValue={dailyData.dateValue}
                className="w-full bg-transparent text-[15px] text-slate-700 outline-none"
              />
            </div>

            <button
              type="button"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#020826] px-5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
            >
              <Save size={16} />
              Salva Tutto
            </button>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            title="Data selezionata"
            value={dailyData.dateLabel}
            color="text-slate-900"
          />
          <SummaryCard
            title="Entrate del giorno"
            value={formatCurrency(dailyData.incomeTotal)}
            color="text-emerald-500"
          />
          <SummaryCard
            title="Uscite del giorno"
            value={formatCurrency(dailyData.expenseTotal)}
            color="text-red-500"
          />
          <SummaryCard
            title="Bilancio giornaliero"
            value={`+${formatCurrency(dailyData.balance).replace("€", "€")}`}
            color="text-blue-500"
          />
        </div>

        {/* ACTION */}
        <div className="mt-6">
          <button
            type="button"
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#020826] px-5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
          >
            <Plus size={18} />
            Aggiungi Nuova Voce
          </button>
        </div>

        {/* CONTENT */}
        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <SectionCard
            title="Uscite del 12 marzo"
            total={dailyData.expenseTotal}
            totalColor="text-red-500"
            itemAmountColor="text-red-500"
            icon={<Wallet size={16} className="text-emerald-600" />}
            iconBg="bg-emerald-100"
            items={dailyData.expenses}
            sectionTone="bg-[#fbfbfc]"
          />

          <SectionCard
            title="Entrate del 12 marzo"
            total={dailyData.incomeTotal}
            totalColor="text-emerald-500"
            itemAmountColor="text-emerald-500"
            icon={<BanknoteArrowUp size={16} className="text-amber-600" />}
            iconBg="bg-amber-100"
            items={dailyData.incomes}
            sectionTone="bg-[#f7faf8]"
          />
        </div>
      </div>
    </div>
  );
}