import React, { useState } from "react";
import {
  Calendar,
  Tag,
  Trash2,
  Plus,
  Save,
  X,
  ChevronDown,
} from "lucide-react";

const expensesData = [
  {
    id: 1,
    title: "Trasporti",
    total: 342.0,
    items: [
      {
        id: 11,
        name: "Parcheggio",
        amount: 342.0,
      },
    ],
  },
  {
    id: 2,
    title: "Intrattenimento",
    total: 3223.0,
    items: [
      {
        id: 21,
        name: "Libri",
        amount: 3223.0,
        note: "323242",
      },
    ],
  },
];

const incomesData = [
  {
    id: 1,
    title: "Investimenti",
    total: 57466.0,
    items: [
      {
        id: 11,
        name: "Interessi",
        amount: 34234.0,
      },
      {
        id: 12,
        name: "Interessi",
        amount: 23232.0,
      },
    ],
  },
  {
    id: 2,
    title: "Freelance",
    total: 34234.0,
    items: [
      {
        id: 21,
        name: "Commissione",
        amount: 34234.0,
      },
    ],
  },
];

const formatCurrency = (value) => `€${Number(value).toFixed(2)}`;

const SummaryCard = ({ label, value, valueClassName = "" }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <div className="text-sm text-slate-500">{label}</div>
      <div className={`mt-2 text-[1.75rem] font-semibold leading-none ${valueClassName}`}>
        {value}
      </div>
    </div>
  );
};

const TransactionCategoryCard = ({
  title,
  total,
  items,
  amountClassName,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-slate-800">
          <Tag size={16} className="text-slate-500" />
          <h4 className="text-[15px] font-semibold">{title}</h4>
        </div>

        <span className={`text-[15px] font-semibold ${amountClassName}`}>
          {formatCurrency(total)}
        </span>
      </div>

      <div className="mt-4 space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[15px] text-slate-800">{item.name}</p>
              {item.note && (
                <p className="mt-1 text-xs text-slate-400">{item.note}</p>
              )}
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className={`text-[15px] font-semibold ${amountClassName}`}>
                {formatCurrency(item.amount)}
              </span>
              <button
                type="button"
                className="text-red-500 transition hover:text-red-600"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TransactionsColumn = ({
  title,
  total,
  data,
  totalClassName,
  amountClassName,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <h3 className="text-[16px] font-semibold text-slate-800">{title}</h3>
        <span className={`text-[18px] font-semibold ${totalClassName}`}>
          {formatCurrency(total)}
        </span>
      </div>

      <div className="mt-4 space-y-4">
        {data.map((category) => (
          <TransactionCategoryCard
            key={category.id}
            title={category.title}
            total={category.total}
            items={category.items}
            amountClassName={amountClassName}
          />
        ))}
      </div>
    </div>
  );
};

const FieldLabel = ({ children }) => {
  return (
    <label className="text-[18px] font-semibold text-slate-900">
      {children}
    </label>
  );
};

const InputWrapper = ({ children }) => {
  return (
    <div className="relative">
      {children}
    </div>
  );
};

const SelectLike = ({ value, placeholder = "Seleziona..." }) => {
  return (
    <div className="flex h-14 w-full items-center justify-between rounded-2xl bg-slate-100 px-5 text-[16px] text-slate-700">
      <span className={value ? "font-medium text-slate-800" : "text-slate-400"}>
        {value || placeholder}
      </span>
      <ChevronDown size={18} className="text-slate-400" />
    </div>
  );
};

const AddEntryModal = ({ open, onClose }) => {
  const [form, setForm] = useState({
    type: "Uscita",
    category: "Intrattenimento",
    item: "",
    amount: "0.00",
    notes: "",
    date: "13/03/2026",
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 py-6">
      <div className="relative w-full max-w-4xl rounded-[24px] bg-white shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 text-slate-500 transition hover:text-slate-800"
        >
          <X size={28} />
        </button>

        <div className="px-8 pb-8 pt-8 md:px-10 md:pb-10 md:pt-9">
          <div>
            <h2 className="text-[28px] font-semibold text-slate-900">
              Aggiungi Nuova Voce
            </h2>
            <p className="mt-1 text-[18px] text-slate-500">
              Inserisci i dettagli della transazione
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-[170px_minmax(0,1fr)] md:items-center">
            <FieldLabel>Tipo</FieldLabel>
            <InputWrapper>
              <SelectLike value={form.type} />
            </InputWrapper>

            <FieldLabel>Categoria</FieldLabel>
            <InputWrapper>
              <SelectLike value={form.category} />
            </InputWrapper>

            <FieldLabel>Voce</FieldLabel>
            <InputWrapper>
              <SelectLike value={form.item} placeholder="Seleziona..." />
            </InputWrapper>

            <FieldLabel>Importo (€)</FieldLabel>
            <InputWrapper>
              <input
                type="text"
                value={form.amount}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, amount: e.target.value }))
                }
                className="h-14 w-full rounded-2xl bg-slate-100 px-5 text-[16px] text-slate-700 outline-none placeholder:text-slate-400"
                placeholder="0.00"
              />
            </InputWrapper>

            <FieldLabel>Note</FieldLabel>
            <InputWrapper>
              <input
                type="text"
                value={form.notes}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, notes: e.target.value }))
                }
                className="h-14 w-full rounded-2xl bg-slate-100 px-5 text-[16px] text-slate-700 outline-none placeholder:text-slate-400"
                placeholder="Aggiungi dettagli (opzionale)..."
              />
            </InputWrapper>

            <FieldLabel>Data</FieldLabel>
            <InputWrapper>
              <div className="flex h-14 w-full items-center justify-between rounded-2xl bg-slate-100 px-5">
                <input
                  type="text"
                  value={form.date}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, date: e.target.value }))
                  }
                  className="w-full bg-transparent text-[16px] text-slate-700 outline-none"
                />
                <Calendar size={18} className="shrink-0 text-slate-300" />
              </div>
            </InputWrapper>
          </div>

          <div className="mt-10 flex flex-col-reverse justify-end gap-4 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              className="h-12 rounded-2xl border border-slate-200 bg-white px-6 text-[16px] font-medium text-slate-800 transition hover:bg-slate-50"
            >
              Annulla
            </button>

            <button
              type="button"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 text-[16px] font-semibold text-white transition hover:bg-slate-800"
            >
              <Plus size={18} />
              Aggiungi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function DailyExpensesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Spese Giornaliere
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Registra le tue entrate e uscite giorno per giorno
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex h-11 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 shadow-sm">
              <Calendar size={18} className="text-slate-400" />
              <input
                type="date"
                className="bg-transparent text-sm text-slate-600 outline-none"
              />
            </div>

            <button
              type="button"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
            >
              <Save size={16} />
              Salva tutto
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard label="Data selezionata" value="ven 13 mar" />
          <SummaryCard
            label="Entrate del giorno"
            value="€91700.00"
            valueClassName="text-emerald-500"
          />
          <SummaryCard
            label="Uscite del giorno"
            value="€3565.00"
            valueClassName="text-red-500"
          />
          <SummaryCard
            label="Bilancio giornaliero"
            value="+€88135.00"
            valueClassName="text-blue-500"
          />
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
          >
            <Plus size={16} />
            Aggiungi Nuova Voce
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <TransactionsColumn
            title="💸 Uscite del 13 marzo"
            total={3565}
            data={expensesData}
            totalClassName="text-red-500"
            amountClassName="text-red-500"
          />

          <TransactionsColumn
            title="💰 Entrate del 13 marzo"
            total={91700}
            data={incomesData}
            totalClassName="text-emerald-500"
            amountClassName="text-emerald-500"
          />
        </div>
      </div>

      <AddEntryModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}