import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FolderOpen,
  Search,
  Plus,
  Pencil,
  Trash2,
  MoreVertical,
} from "lucide-react";

const MONTHS = [
  { value: 0, label: "Gen" },
  { value: 1, label: "Feb" },
  { value: 2, label: "Mar" },
  { value: 3, label: "Apr" },
  { value: 4, label: "Mag" },
  { value: 5, label: "Giu" },
  { value: 6, label: "Lug" },
  { value: 7, label: "Ago" },
  { value: 8, label: "Set" },
  { value: 9, label: "Ott" },
  { value: 10, label: "Nov" },
  { value: 11, label: "Dic" },
];

const initialCategories = [
  {
    id: 1,
    name: "Casa",
    transactions: [
      { id: 101, date: "2026-04-02", description: "Affitto", current: 400, target: 800 },
      { id: 102, date: "2026-04-08", description: "Bollette luce", current: 180, target: 300 },
      { id: 103, date: "2026-03-12", description: "Condominio", current: 250, target: 500 },
    ],
  },
  {
    id: 2,
    name: "Abbonamenti",
    transactions: [
      { id: 201, date: "2026-04-01", description: "Netflix", current: 13, target: 20 },
      { id: 202, date: "2026-04-03", description: "Spotify", current: 11, target: 15 },
      { id: 203, date: "2026-05-05", description: "Amazon Prime", current: 5, target: 10 },
    ],
  },
  {
    id: 3,
    name: "Trasporti",
    transactions: [
      { id: 301, date: "2026-04-04", description: "Benzina", current: 50, target: 120 },
      { id: 302, date: "2026-04-10", description: "Parcheggio", current: 8, target: 30 },
    ],
  },
  {
    id: 4,
    name: "Spesa",
    transactions: [
      { id: 401, date: "2026-04-06", description: "Supermercato", current: 96.3, target: 160 },
      { id: 402, date: "2026-04-13", description: "Frutta e verdura", current: 21.4, target: 50 },
    ],
  },
];

function formatCurrency(value) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}

function getMonthFromDate(dateString) {
  return new Date(dateString).getMonth();
}

function getYearFromDate(dateString) {
  return new Date(dateString).getFullYear();
}

function getCategoryTotal(transactions) {
  return transactions.reduce((sum, transaction) => {
    return sum + Number(transaction.current || 0);
  }, 0);
}

function EdgeProgressBar({ value = 0, selected = false }) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div className="pointer-events-none absolute bottom-0 left-0 h-1 w-full overflow-hidden rounded-b-lg">
      <div className={`h-full w-full ${selected ? "bg-white/10" : "bg-slate-100"}`}>
        <div
          className={`h-full ${selected ? "bg-white" : "bg-slate-900"}`}
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
}

function IconButton({ icon: Icon, onClick, title }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
    >
      <Icon size={14} />
    </button>
  );
}

function CardMenu({
  items = [],
  dark = false,
  isOpen = false,
  onToggle,
  anchor = "button",
  contextPosition = { x: 0, y: 0 },
}) {
  const rootRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (!rootRef.current?.contains(event.target)) {
        onToggle?.(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onToggle?.(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onToggle]);

  const menuClassName =
    anchor === "context"
      ? "fixed z-[100] min-w-[140px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg"
      : "absolute right-0 top-8 z-30 min-w-[140px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg";

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggle?.(!isOpen, { anchor: "button" });
        }}
        className={`inline-flex h-7 w-7 items-center justify-center rounded-md transition ${
          dark
            ? "bg-white/10 text-white hover:bg-white/15"
            : "bg-transparent text-slate-600 hover:bg-slate-100"
        }`}
      >
        <MoreVertical size={14} />
      </button>

      {isOpen && (
        <div
          className={menuClassName}
          style={
            anchor === "context"
              ? {
                  left: contextPosition.x,
                  top: contextPosition.y,
                }
              : undefined
          }
        >
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                onToggle?.(false);
                item.onClick?.();
              }}
              className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs transition ${
                item.danger
                  ? "text-red-600 hover:bg-red-50"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <item.icon size={13} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function MonthYearPicker({
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
  years,
}) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-3">
      <div className="min-w-0">
        <div className="text-sm font-semibold text-slate-900">Periodo</div>
        <div className="text-[11px] text-slate-500">Seleziona mese e anno</div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <select
          value={selectedMonth}
          onChange={(e) => onMonthChange(Number(e.target.value))}
          className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none focus:border-slate-400"
        >
          {MONTHS.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>

        <select
          value={selectedYear}
          onChange={(e) => onYearChange(Number(e.target.value))}
          className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none focus:border-slate-400"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default function CategoriesTransactionsPage() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState(initialCategories);
  const [selectedCategoryId, setSelectedCategoryId] = useState(initialCategories[0]?.id ?? null);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const [openCategoryMenuId, setOpenCategoryMenuId] = useState(null);
  const [openTransactionMenuId, setOpenTransactionMenuId] = useState(null);
  const [categoryMenuAnchor, setCategoryMenuAnchor] = useState("button");
  const [transactionMenuAnchor, setTransactionMenuAnchor] = useState("button");
  const [categoryContextPosition, setCategoryContextPosition] = useState({ x: 0, y: 0 });
  const [transactionContextPosition, setTransactionContextPosition] = useState({ x: 0, y: 0 });

  const availableYears = useMemo(() => {
    const yearSet = new Set([currentYear]);

    categories.forEach((category) => {
      category.transactions.forEach((transaction) => {
        yearSet.add(getYearFromDate(transaction.date));
      });
    });

    return Array.from(yearSet).sort((a, b) => a - b);
  }, [categories, currentYear]);

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return categories;

    return categories.filter((category) =>
      category.name.toLowerCase().includes(query)
    );
  }, [categories, search]);

  const categoriesWithFilteredTransactions = useMemo(() => {
    return filteredCategories.map((category) => ({
      ...category,
      transactions: category.transactions.filter((transaction) => {
        const month = getMonthFromDate(transaction.date);
        const year = getYearFromDate(transaction.date);
        return month === selectedMonth && year === selectedYear;
      }),
    }));
  }, [filteredCategories, selectedMonth, selectedYear]);

  const selectedCategory = useMemo(() => {
    return (
      categoriesWithFilteredTransactions.find(
        (category) => category.id === selectedCategoryId
      ) ||
      categoriesWithFilteredTransactions[0] ||
      null
    );
  }, [categoriesWithFilteredTransactions, selectedCategoryId]);

  const transactions = selectedCategory?.transactions ?? [];

  const maxCategoryTotal = useMemo(() => {
    if (!categoriesWithFilteredTransactions.length) return 0;

    return Math.max(
      ...categoriesWithFilteredTransactions.map((category) =>
        getCategoryTotal(category.transactions)
      )
    );
  }, [categoriesWithFilteredTransactions]);

  const handleAddCategory = () => {
    const name = prompt("Nome nuova categoria:");
    if (!name?.trim()) return;

    const newCategory = {
      id: Date.now(),
      name: name.trim(),
      transactions: [],
    };

    setCategories((prev) => [...prev, newCategory]);
    setSelectedCategoryId(newCategory.id);
  };

  const handleEditCategory = (categoryId) => {
    const category = categories.find((item) => item.id === categoryId);
    if (!category) return;

    const newName = prompt("Modifica nome categoria:", category.name);
    if (!newName?.trim()) return;

    setCategories((prev) =>
      prev.map((item) =>
        item.id === categoryId ? { ...item, name: newName.trim() } : item
      )
    );

    setOpenCategoryMenuId(null);
  };

  const handleDeleteCategory = (categoryId) => {
    const category = categories.find((item) => item.id === categoryId);
    if (!category) return;

    const confirmed = window.confirm(
      `Vuoi eliminare la categoria "${category.name}"?`
    );
    if (!confirmed) return;

    const nextCategories = categories.filter((item) => item.id !== categoryId);
    setCategories(nextCategories);

    if (selectedCategoryId === categoryId) {
      setSelectedCategoryId(nextCategories[0]?.id ?? null);
    }

    setOpenCategoryMenuId(null);
  };

  const handleAddTransaction = () => {
    const baseCategory =
      categories.find((category) => category.id === selectedCategoryId) || null;

    if (!baseCategory) return;

    const description = prompt("Descrizione transazione:");
    if (!description?.trim()) return;

    const currentRaw = prompt("Valore corrente:");
    if (currentRaw === null) return;

    const targetRaw = prompt("Valore target:");
    if (targetRaw === null) return;

    const current = Number(String(currentRaw).replace(",", "."));
    const target = Number(String(targetRaw).replace(",", "."));

    if (Number.isNaN(current) || Number.isNaN(target)) return;

    const defaultDate = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-01`;
    const date = prompt("Data (YYYY-MM-DD):", defaultDate);
    if (!date?.trim()) return;

    const newTransaction = {
      id: Date.now(),
      description: description.trim(),
      current,
      target,
      date: date.trim(),
    };

    setCategories((prev) =>
      prev.map((category) =>
        category.id === baseCategory.id
          ? {
              ...category,
              transactions: [newTransaction, ...category.transactions],
            }
          : category
      )
    );
  };

  const handleEditTransaction = (transactionId) => {
    const baseCategory =
      categories.find((category) => category.id === selectedCategoryId) || null;

    if (!baseCategory) return;

    const transaction = baseCategory.transactions.find(
      (item) => item.id === transactionId
    );
    if (!transaction) return;

    const newDescription = prompt("Modifica descrizione:", transaction.description);
    if (!newDescription?.trim()) return;

    const newCurrentRaw = prompt(
      "Modifica valore corrente:",
      String(transaction.current ?? 0)
    );
    if (newCurrentRaw === null) return;

    const newTargetRaw = prompt(
      "Modifica valore target:",
      String(transaction.target ?? 0)
    );
    if (newTargetRaw === null) return;

    const newCurrent = Number(String(newCurrentRaw).replace(",", "."));
    const newTarget = Number(String(newTargetRaw).replace(",", "."));

    if (Number.isNaN(newCurrent) || Number.isNaN(newTarget)) return;

    const newDate = prompt("Modifica data (YYYY-MM-DD):", transaction.date);
    if (!newDate?.trim()) return;

    setCategories((prev) =>
      prev.map((category) =>
        category.id === baseCategory.id
          ? {
              ...category,
              transactions: category.transactions.map((item) =>
                item.id === transactionId
                  ? {
                      ...item,
                      description: newDescription.trim(),
                      current: newCurrent,
                      target: newTarget,
                      date: newDate.trim(),
                    }
                  : item
              ),
            }
          : category
      )
    );

    setOpenTransactionMenuId(null);
  };

  const handleDeleteTransaction = (transactionId) => {
    const baseCategory =
      categories.find((category) => category.id === selectedCategoryId) || null;

    if (!baseCategory) return;

    const transaction = baseCategory.transactions.find(
      (item) => item.id === transactionId
    );
    if (!transaction) return;

    const confirmed = window.confirm(
      `Vuoi eliminare la transazione "${transaction.description}"?`
    );
    if (!confirmed) return;

    setCategories((prev) =>
      prev.map((category) =>
        category.id === baseCategory.id
          ? {
              ...category,
              transactions: category.transactions.filter(
                (item) => item.id !== transactionId
              ),
            }
          : category
      )
    );

    setOpenTransactionMenuId(null);
  };

  return (
    <div className="h-[calc(100vh-80px)] min-h-0 box-border overflow-hidden bg-slate-50 p-2 sm:p-3">
      <div className="flex h-full min-h-0 flex-col">
        <div className="mb-3 shrink-0">
          <h1 className="text-base font-semibold text-slate-900 sm:text-lg">
            Categorie e transazioni
          </h1>
          <p className="text-[11px] text-slate-500 sm:text-xs">
            Gestione categorie con relative transazioni
          </p>
        </div>

        <div className="mb-3 shrink-0">
          <MonthYearPicker
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onMonthChange={setSelectedMonth}
            onYearChange={setSelectedYear}
            years={availableYears}
          />
        </div>

        <div className="grid min-h-0 flex-1 overflow-hidden grid-cols-1 gap-3 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)]">
          <div className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm max-lg:max-h-[38vh] lg:h-full">
            <div className="border-b border-slate-200 p-2.5 sm:p-3">
              <div className="mb-2 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h2 className="text-sm font-semibold text-slate-900">Categorie</h2>
                  <p className="text-[11px] text-slate-500">
                    {categoriesWithFilteredTransactions.length} categorie
                  </p>
                </div>

                <IconButton
                  icon={Plus}
                  title="Aggiungi categoria"
                  onClick={handleAddCategory}
                />
              </div>

              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Cerca..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-8 w-full rounded-lg border border-slate-200 bg-white py-1 pl-8 pr-2 text-xs outline-none transition focus:border-slate-400"
                />
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-2">
              <div className="space-y-2">
                {categoriesWithFilteredTransactions.length > 0 ? (
                  categoriesWithFilteredTransactions.map((category) => {
                    const isSelected = category.id === selectedCategory?.id;
                    const total = getCategoryTotal(category.transactions);
                    const progress =
                      maxCategoryTotal > 0 ? (total / maxCategoryTotal) * 100 : 0;

                    return (
                      <div
                        key={category.id}
                        onClick={() => setSelectedCategoryId(category.id)}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          setSelectedCategoryId(category.id);
                          setOpenTransactionMenuId(null);
                          setCategoryMenuAnchor("context");
                          setCategoryContextPosition({ x: e.clientX, y: e.clientY });
                          setOpenCategoryMenuId(category.id);
                        }}
                        className={`relative overflow-visible rounded-lg border px-2.5 py-2 pb-3 transition sm:px-3 ${
                          isSelected
                            ? "border-slate-900 bg-slate-900 text-white"
                            : "border-slate-200 bg-white"
                        }`}
                      >
                        <EdgeProgressBar value={progress} selected={isSelected} />

                        <div className="flex items-start justify-between gap-2">
                          <div className="flex min-w-0 flex-1 items-start gap-2 text-left">
                            <div
                              className={`shrink-0 rounded-md p-1.5 ${
                                isSelected ? "bg-white/10" : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              <FolderOpen size={14} />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="truncate text-sm font-medium">
                                {category.name}
                              </div>
                              <div
                                className={`text-[11px] ${
                                  isSelected ? "text-slate-300" : "text-slate-500"
                                }`}
                              >
                                {category.transactions.length} transazioni
                              </div>
                            </div>
                          </div>

                          <div className="flex shrink-0 items-start gap-1">
                            <div
                              className={`hidden rounded-md px-2 py-1 text-[11px] font-medium sm:block ${
                                isSelected
                                  ? "bg-white/10 text-white"
                                  : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {formatCurrency(total)}
                            </div>

                            <CardMenu
                              dark={isSelected}
                              isOpen={openCategoryMenuId === category.id}
                              anchor={categoryMenuAnchor}
                              contextPosition={categoryContextPosition}
                              onToggle={(next, options = {}) => {
                                if (!next) {
                                  setOpenCategoryMenuId(null);
                                  return;
                                }

                                setOpenTransactionMenuId(null);
                                setCategoryMenuAnchor(options.anchor || "button");
                                setOpenCategoryMenuId(category.id);
                              }}
                              items={[
                                {
                                  label: "Modifica",
                                  icon: Pencil,
                                  onClick: () => handleEditCategory(category.id),
                                },
                                {
                                  label: "Elimina",
                                  icon: Trash2,
                                  danger: true,
                                  onClick: () => handleDeleteCategory(category.id),
                                },
                              ]}
                            />
                          </div>
                        </div>

                        <div
                          className={`mt-1 text-[11px] sm:hidden ${
                            isSelected ? "text-slate-300" : "text-slate-500"
                          }`}
                        >
                          {formatCurrency(total)}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="rounded-lg border border-dashed border-slate-300 p-4 text-center text-xs text-slate-500">
                    Nessuna categoria trovata
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:h-full">
            <div className="border-b border-slate-200 p-2.5 sm:p-3">
              {selectedCategory ? (
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate text-sm font-semibold text-slate-900">
                      {selectedCategory.name}
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      Transazioni della categoria
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <div className="hidden rounded-md bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700 sm:block">
                      {formatCurrency(getCategoryTotal(transactions))}
                    </div>

                    <IconButton
                      icon={Plus}
                      title="Aggiungi transazione"
                      onClick={handleAddTransaction}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">Transazioni</h2>
                </div>
              )}

              {selectedCategory && (
                <div className="mt-2 text-[11px] text-slate-500 sm:hidden">
                  Totale: {formatCurrency(getCategoryTotal(transactions))}
                </div>
              )}
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-2">
              {selectedCategory ? (
                transactions.length > 0 ? (
                  <div className="space-y-2">
                    {transactions.map((transaction) => {
                      const current = Number(transaction.current || 0);
                      const target = Number(transaction.target || 0);
                      const progress = target > 0 ? (current / target) * 100 : 0;
                      const remaining = Math.max(target - current, 0);

                      return (
                        <div
                          key={transaction.id}
                          onContextMenu={(e) => {
                            e.preventDefault();
                            setOpenCategoryMenuId(null);
                            setTransactionMenuAnchor("context");
                            setTransactionContextPosition({ x: e.clientX, y: e.clientY });
                            setOpenTransactionMenuId(transaction.id);
                          }}
                          className="relative overflow-visible rounded-lg border border-slate-200 bg-white px-2.5 py-2 pb-3 transition hover:bg-slate-50 sm:px-3"
                        >
                          <EdgeProgressBar value={progress} />

                          <div className="min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="truncate text-sm font-medium text-slate-900">
                                    {transaction.description}
                                  </div>

                                  <div className="shrink-0 text-[11px] font-semibold text-emerald-700">
                                    {formatCurrency(current)} / {formatCurrency(target)}
                                  </div>
                                </div>

                                <div className="mt-1 flex items-center justify-between gap-2">
                                  <div className="truncate text-[11px] text-slate-500">
                                    Rimanenti: {formatCurrency(remaining)}
                                  </div>

                                  <div className="shrink-0 text-[11px] text-slate-500">
                                    {progress.toFixed(0)}%
                                  </div>
                                </div>
                              </div>

                              <CardMenu
                                isOpen={openTransactionMenuId === transaction.id}
                                anchor={transactionMenuAnchor}
                                contextPosition={transactionContextPosition}
                                onToggle={(next, options = {}) => {
                                  if (!next) {
                                    setOpenTransactionMenuId(null);
                                    return;
                                  }

                                  setOpenCategoryMenuId(null);
                                  setTransactionMenuAnchor(options.anchor || "button");
                                  setOpenTransactionMenuId(transaction.id);
                                }}
                                items={[
                                  {
                                    label: "Modifica",
                                    icon: Pencil,
                                    onClick: () => handleEditTransaction(transaction.id),
                                  },
                                  {
                                    label: "Elimina",
                                    icon: Trash2,
                                    danger: true,
                                    onClick: () => handleDeleteTransaction(transaction.id),
                                  },
                                ]}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-slate-300 p-4 text-center text-xs text-slate-500">
                    Nessuna transazione disponibile per il periodo selezionato
                  </div>
                )
              ) : (
                <div className="rounded-lg border border-dashed border-slate-300 p-4 text-center text-xs text-slate-500">
                  Seleziona una categoria
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}