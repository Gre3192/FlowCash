import React, { useMemo, useState } from "react";
import { Search, Plus } from "lucide-react";

import MonthYearPicker from "../components/MonthYearPicker";
import CategoryCard from "../components/CategoryCard";
import TransactionCard from "../components/TransactionCard";

import { useGet } from "../hooks/useGet";
import { API_ENDPOINTS } from "../api/endpoint";

function formatCurrency(value) {
    return new Intl.NumberFormat("it-IT", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 2,
    }).format(Number(value) || 0);
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
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectedYear, setSelectedYear] = useState(currentYear);

    const [searchedCategory, setSearchedCategory] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [openCategoryMenuId, setOpenCategoryMenuId] = useState(null);

    const { data, loading, error } = useGet(
        API_ENDPOINTS.monthlyOverview({
            month: selectedMonth,
            year: selectedYear,
        }),
        {
            delayMs: 0,
        }
    );

    console.log(selectedMonth)

    const categories = useMemo(() => {
        return (data?.categories ?? []).map((category) => ({
            id: category.id,
            name: category.name,

            budgetTotal: Number(category.category_budget_total || 0),
            entriesTotal: Number(category.category_entries_total || 0),

            transactions: (category.transactions ?? []).map((transaction) => {
                const current = Number(transaction.entries_total || 0);
                const target = Number(transaction.budget?.month_value || 0);

                return {
                    id: transaction.id,
                    name: transaction.name,
                    description: transaction.name,
                    type: transaction.type,

                    current,
                    target,

                    budget: transaction.budget,
                    entries: transaction.entries ?? [],
                    entriesTotal: Number(transaction.entries_total || 0),

                    date:
                        transaction.entries?.[0]?.entry_date ??
                        `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-01`,

                    raw: transaction,
                };
            }),
        }));
    }, [data, selectedMonth, selectedYear]);

    const filteredCategories = useMemo(() => {
        const query = searchedCategory.trim().toLowerCase();

        if (!query) return categories;

        return categories.filter((category) =>
            category.name.toLowerCase().includes(query)
        );
    }, [categories, searchedCategory]);

    const selectedCategory = useMemo(() => {
        if (!filteredCategories.length) return null;
        return (
            filteredCategories.find(
                (category) => category.id === selectedCategoryId
            ) ?? filteredCategories[0]
        );
    }, [filteredCategories, selectedCategoryId]);

    const transactions = selectedCategory?.transactions ?? [];

    const maxCategoryTotal = useMemo(() => {
        if (!filteredCategories.length) return 0;

        return Math.max(
            ...filteredCategories.map((category) => category.entriesTotal)
        );
    }, [filteredCategories]);

    const availableYears = useMemo(() => {
        const years = [];

        for (let year = currentYear - 2; year <= currentYear + 5; year++) {
            years.push(year);
        }

        return years;
    }, [currentYear]);

    const handleAddCategory = () => {
        console.log("Apri modale creazione categoria");
    };

    const handleAddTransaction = () => {
        console.log("Apri modale creazione transazione", {
            categoryId: selectedCategory?.id,
            month: selectedMonth + 1,
            year: selectedYear,
        });
    };

    function getCategoryById(data, categoryId) {
        if (!data?.categories || !categoryId) return null;

        return data.categories.find((category) => category.id === categoryId) || null;
    }

    ;


    return (
        <div className="h-[calc(100vh-80px)] min-h-0 box-border overflow-hidden bg-slate-50 p-2 sm:p-3">
            <div className="flex h-full min-h-0 flex-col">
                <div className="mb-3 flex shrink-0 items-center justify-between">
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

                {error && (
                    <div className="mb-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
                        Errore durante il caricamento dei dati
                    </div>
                )}

                {/* <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 overflow-hidden lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)]"> */}
                <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 overflow-hidden lg:grid-cols-4">

                    <div className="col-span-1">
                        <CategorySide
                            loading={loading}
                            categories={filteredCategories}
                            search={searchedCategory}
                            setSearch={setSearchedCategory}
                            selectedCategory={selectedCategory}
                            maxCategoryTotal={maxCategoryTotal}
                            openCategoryMenuId={openCategoryMenuId}
                            setOpenCategoryMenuId={setOpenCategoryMenuId}
                            setSelectedCategoryId={setSelectedCategoryId}
                            handleAddCategory={handleAddCategory}
                        />
                    </div>
                    <div className="col-span-3">
                        <TransactionsSide
                            loading={loading}
                            categories={categories}
                            transactions={transactions}
                            selectedCategory={selectedCategory}
                            selectedCategoryId={selectedCategory?.id}
                            handleAddTransaction={handleAddTransaction}
                            setOpenCategoryMenuId={setOpenCategoryMenuId}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function CategorySide({
    loading,
    categories,
    handleAddCategory,
    search,
    selectedCategory,
    maxCategoryTotal,
    openCategoryMenuId,
    setOpenCategoryMenuId,
    setSelectedCategoryId,
    setSearch,
}) {
    return (
        <div className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm max-lg:max-h-[38vh] lg:h-full">




            <div className="border-b border-slate-200 p-2.5 sm:p-3">
                <div className="mb-2 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <h2 className="text-sm font-semibold text-slate-900">
                            Categorie
                        </h2>
                        <p className="text-[11px] text-slate-500">
                            {`${categories.length} categorie`}
                        </p>
                    </div>

                    <IconButton
                        icon={Plus}
                        title="Aggiungi categoria"
                        onClick={handleAddCategory}
                    />
                </div>

                <div className="relative">
                    <SearchBar search={search} setSearch={setSearch} />
                </div>
            </div>





            <div className="min-h-0 flex-1 overflow-y-auto p-2">
                {loading ? (
                    <LoadingState />
                ) : (
                    <div className="space-y-2">
                        {categories.length > 0 ? (
                            categories.map((category) => {

                                const isSelected = category.id === selectedCategory?.id;
                                const total = category.entriesTotal;
                                const progress = maxCategoryTotal > 0 ? (total / maxCategoryTotal) * 100 : 0;

                                return (
                                    <CategoryCard
                                        key={category.id}
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
                            <EmptyState text="Nessuna categoria trovata" />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function TransactionsSide({
    loading,
    selectedCategory,
    transactions,
    handleAddTransaction,
    selectedCategoryId,
    setOpenCategoryMenuId,
    categories,
}) {
    const total = selectedCategory?.entriesTotal ?? 0;

    return (
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
                                {formatCurrency(total)}
                            </div>

                            <IconButton
                                icon={Plus}
                                title="Aggiungi transazione"
                                onClick={handleAddTransaction}
                            />
                        </div>
                    </div>
                ) : (
                    <h2 className="text-sm font-semibold text-slate-900">
                        Transazioni
                    </h2>
                )}

                {selectedCategory && (
                    <div className="mt-2 text-[11px] text-slate-500 sm:hidden">
                        Totale: {formatCurrency(total)}
                    </div>
                )}
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-2">
                {loading ? (
                    <LoadingState />
                ) : selectedCategory ? (
                    transactions.length > 0 ? (
                        <div className="space-y-2">
                            {transactions.map((transaction) => {

                                const current = transaction.entriesTotal;
                                const target = transaction.target;

                                const progress = target > 0 ? (current / target) * 100 : 0;

                                const remaining = Math.max(target - current, 0);

                                return (
                                    <TransactionCard
                                        key={transaction.id}
                                        progress={progress}
                                        remaining={remaining}
                                        target={target}
                                        current={current}
                                        transaction={transaction}
                                        categories={categories}
                                        selectedCategoryId={selectedCategoryId}
                                        setOpenCategoryMenuId={setOpenCategoryMenuId}
                                    />
                                );
                            })}
                        </div>
                    ) : (
                        <EmptyState text="Nessuna transazione disponibile per il periodo selezionato" />
                    )
                ) : (
                    <EmptyState text="Seleziona una categoria" />
                )}
            </div>
        </div>
    );
}

function LoadingState() {
    return (
        <div className="flex h-full min-h-[180px] items-center justify-center">
            <div className="flex flex-col items-center gap-2">
                <div className="h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-slate-700" />
                <span className="text-xs text-slate-500">Caricamento...</span>
            </div>
        </div>
    );
}

function EmptyState({ text = "Nessun dato disponibile" }) {
    return (
        <div className="rounded-lg border border-dashed border-slate-300 p-4 text-center text-xs text-slate-500">
            {text}
        </div>
    );
}

function SearchBar({ search, setSearch }) {

    return (
        <>
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
        </>
    )
}