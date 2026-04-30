import React, { useEffect, useMemo, useRef, useState } from "react";
import { FolderOpen, Search, Plus, Pencil, Trash2, MoreVertical, } from "lucide-react";
import MonthYearPicker from "../components/MonthYearPicker";
import CategoryCard from "../components/CategoryCard";
import TransactionCard from "../components/TransactionCard";
import { useGet } from "../hooks/useGet"
import { API_ENDPOINTS } from "../api/endpoint";

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
            { id: 203, date: "2027-05-05", description: "Amazon Prime", current: 5, target: 10 },
        ],
    },
    {
        id: 3,
        name: "Trasporti",
        transactions: [
            { id: 301, date: "2028-04-04", description: "Benzina", current: 50, target: 120 },
            { id: 302, date: "2026-04-10", description: "Parcheggio", current: 8, target: 30 },
        ],
    },
    {
        id: 4,
        name: "Spesa",
        transactions: [
            { id: 401, date: "2029-04-06", description: "Supermercato", current: 96.3, target: 160 },
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




export default function CategoriesTransactionsPage() {

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    const [search, setSearch] = useState("");
    const [categories, setCategories] = useState(initialCategories);
    const [selectedCategoryId, setSelectedCategoryId] = useState(initialCategories[0]?.id ?? null);
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectedYear, setSelectedYear] = useState(currentYear);

    const [openCategoryMenuId, setOpenCategoryMenuId] = useState(null);

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

    const { data, loading, error } = useGet(API_ENDPOINTS.monthlyOverview({
        month: 2,
        year:2026
    }))
    console.log(data); 


    return (
        <div className="h-[calc(100vh-80px)] min-h-0 box-border overflow-hidden bg-slate-50 p-2 sm:p-3">
            <div className="flex h-full min-h-0 flex-col">
                <div className="mb-3 flex items-center justify-between shrink-0">
                    <div>
                        <h1 className="text-base font-semibold text-slate-900 sm:text-lg">
                            Categorie e transazioni
                        </h1>
                        <p className="text-[11px] text-slate-500 sm:text-xs">
                            Gestione categorie con relative transazioni
                        </p>
                    </div>
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
                                            <CategoryCard
                                                isSelected={isSelected}
                                                progress={progress}
                                                category={category}
                                                openCategoryMenuId={openCategoryMenuId}
                                                setOpenCategoryMenuId={setOpenCategoryMenuId}
                                                setSelectedCategoryId={setSelectedCategoryId}
                                                total={total}
                                            />
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
                                                <TransactionCard
                                                    progress={progress}
                                                    remaining={remaining}
                                                    target={target}
                                                    current={current}
                                                    setOpenCategoryMenuId={setOpenCategoryMenuId}
                                                    transaction={transaction}
                                                    categories={categories}
                                                    selectedCategoryId={selectedCategoryId}
                                                    setCategories={setCategories}
                                                />
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