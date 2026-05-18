import { useGet } from "../hooks/useGet";
import {
    Search,
    Plus,
    X,
    TrendingUp,
    TrendingDown,
    Scale,
    FolderOpen,
    ChevronRight,
    ArrowLeft,
} from "lucide-react";
import TransactionCard from "../components/TransactionCard";
import { API_ENDPOINTS } from "../api/endpoint";
import React, { useMemo, useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import formatCurrency from "../utils/formatCurrency";
import ModalWrapper from "../components/ModalWrapper";
import CreateCategoryModal from "../components/Modals/CreateCategoryModal";
import CreateTransactionModal from "../components/Modals/CreateTransactionModal";
import TransactionMovementsModal from "../components/Modals/TransactionMovementsModal";
import MonthNavigator from "../components/MonthNavigator";
import { useSearchParams } from "react-router-dom";
import saveToStorage from "../utils/saveToStorage";
import getFromStorage from "../utils/getFromStorage";
import { AnimatePresence, motion } from "framer-motion";
import { getCategoryColor } from "../constants/categoryColors";

function getValidYear(value, fallbackYear) {
    const year = Number(value);

    if (!Number.isInteger(year)) return fallbackYear;
    if (year < 1900 || year > 3000) return fallbackYear;

    return year;
}

function getValidMonth(value, fallbackMonth) {
    const month = Number(value);

    if (!Number.isInteger(month)) return fallbackMonth;
    if (month < 1 || month > 12) return fallbackMonth;

    return month;
}

function getAccordionStorageKey(year, month) {
    return `categories-transactions-open-accordions-${year}-${month}`;
}

function getScrollStorageKey(year, month) {
    return `categories-transactions-scroll-position-${year}-${month}`;
}

export default function CategoriesTransactionsPage() {
    const [searchParams, setSearchParams] = useSearchParams();

    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const initialYear = getValidYear(searchParams.get("year"), currentYear);
    const initialMonth = getValidMonth(searchParams.get("month"), currentMonth);

    const [selectedDay, setSelectedDay] = useState(currentDay);
    const [selectedMonth, setSelectedMonth] = useState(initialMonth);
    const [selectedYear, setSelectedYear] = useState(initialYear);

    const [search, setSearch] = useState("");

    const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] =
        useState(false);

    const [isCreateTransactionModalOpen, setIsCreateTransactionModalOpen] =
        useState(false);

    const [categoryIdForNewTransaction, setCategoryIdForNewTransaction] =
        useState(null);

    const [showMovementsModal, setShowMovementsModal] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    useEffect(() => {
        const nextParams = new URLSearchParams();

        nextParams.set("year", String(selectedYear));
        nextParams.set("month", String(selectedMonth));

        setSearchParams(nextParams, { replace: true });
    }, [selectedYear, selectedMonth, setSearchParams]);

    const {
        data,
        loading,
        error,
        reload: reloadMonthlyOverview,
    } = useGet(
        API_ENDPOINTS.monthlyOverview({
            month: selectedMonth,
            year: selectedYear,
        }),
        {
            delayMs: 0,
        }
    );

    const categories = data?.categories ?? [];

    function handleTransactionCard(transaction) {
        setSelectedTransaction(transaction);
        setShowMovementsModal(true);
    }

    function handleCreateTransaction(categoryId) {
        setCategoryIdForNewTransaction(categoryId);
        setIsCreateTransactionModalOpen(true);
    }

    const totals = useMemo(() => {
        let income = 0;
        let expense = 0;

        categories.forEach((category) => {
            (category.transactions ?? []).forEach((t) => {
                const current = Number(t.current || 0);
                if (t.type === "Income") {
                    income += current;
                } else {
                    expense += current;
                }
            });
        });

        return { income, expense, balance: income - expense };
    }, [categories]);

    return (
        <div className="box-border overflow-y-auto bg-slate-50 p-2 sm:p-4 lg:h-full lg:min-h-0 lg:overflow-hidden">
            <div className="flex min-h-0 flex-col gap-3 lg:h-full">
                <div className="shrink-0">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                            <h1 className="truncate text-lg font-bold text-slate-900 sm:text-xl">
                                Categorie e transazioni
                            </h1>
                            <p className="truncate text-xs text-slate-500">
                                Gestisci le transazioni per categoria
                            </p>
                        </div>

                        <div className="w-full sm:w-auto sm:min-w-[340px]">
                            <MonthNavigator
                                selectedMonth={selectedMonth}
                                setSelectedMonth={setSelectedMonth}
                                selectedYear={selectedYear}
                                setSelectedYear={setSelectedYear}
                                availableYears={data?.available_budget_years}
                                currentYear={currentYear}
                            />
                        </div>
                    </div>
                </div>

                {!loading && categories.length > 0 && (
                    <div className="shrink-0">
                        <SummaryStats
                            income={totals.income}
                            expense={totals.expense}
                            balance={totals.balance}
                            categoriesCount={categories.length}
                        />
                    </div>
                )}

                {error && (
                    <div className="shrink-0 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        <div className="h-2 w-2 shrink-0 rounded-full bg-red-400" />
                        Errore durante il caricamento dei dati
                    </div>
                )}

                <div className="min-h-0 flex-1 lg:overflow-hidden">
                    <TransactionsSide
                        loading={loading}
                        categories={categories}
                        search={search}
                        setSearch={setSearch}
                        selectedDay={selectedDay}
                        setSelectedDay={setSelectedDay}
                        selectedMonth={selectedMonth}
                        selectedYear={selectedYear}
                        onTransactionCardClick={handleTransactionCard}
                        reloadMonthlyOverview={reloadMonthlyOverview}
                        setIsCreateCategoryModalOpen={setIsCreateCategoryModalOpen}
                        onCreateTransaction={handleCreateTransaction}
                    />
                </div>
            </div>

            <ModalWrapper
                height="h-fit"
                isOpen={isCreateCategoryModalOpen}
                onClose={() => setIsCreateCategoryModalOpen(false)}
                title="Nuova categoria"
            >
                <CreateCategoryModal
                    reload={reloadMonthlyOverview}
                    onClose={() => setIsCreateCategoryModalOpen(false)}
                />
            </ModalWrapper>

            <ModalWrapper
                height="h-fit"
                isOpen={isCreateTransactionModalOpen}
                onClose={() => setIsCreateTransactionModalOpen(false)}
                title="Nuova transazione"
            >
                <CreateTransactionModal
                    selectedCategoryId={categoryIdForNewTransaction}
                    reload={reloadMonthlyOverview}
                    onClose={() => setIsCreateTransactionModalOpen(false)}
                />
            </ModalWrapper>

            <ModalWrapper
                title={selectedTransaction?.name}
                height="h-[800px]"
                width="w-[80%]"
                isOpen={showMovementsModal}
                onClose={() => setShowMovementsModal(false)}
            >
                <TransactionMovementsModal
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                    selectedDay={selectedDay}
                    transaction={selectedTransaction}
                    onClose={() => setShowMovementsModal(false)}
                    onDayChange={setSelectedDay}
                    availableYears={data?.available_budget_years}
                    currentYear={currentYear}
                    reloadMonthlyOverview={reloadMonthlyOverview}
                />
            </ModalWrapper>
        </div>
    );
}

function SummaryStats({ income, expense, balance, categoriesCount }) {
    const stats = [
        {
            label: "Entrate",
            value: formatCurrency(income),
            icon: TrendingUp,
            iconBg: "bg-emerald-100",
            iconColor: "text-emerald-600",
            valueBorder: "border-emerald-100",
        },
        {
            label: "Uscite",
            value: formatCurrency(expense),
            icon: TrendingDown,
            iconBg: "bg-red-100",
            iconColor: "text-red-600",
            valueBorder: "border-red-100",
        },
        {
            label: "Bilancio",
            value: formatCurrency(balance),
            icon: Scale,
            iconBg: balance >= 0 ? "bg-blue-100" : "bg-amber-100",
            iconColor: balance >= 0 ? "text-blue-600" : "text-amber-600",
            valueBorder: balance >= 0 ? "border-blue-100" : "border-amber-100",
        },
        {
            label: "Categorie",
            value: String(categoriesCount),
            icon: FolderOpen,
            iconBg: "bg-violet-100",
            iconColor: "text-violet-600",
            valueBorder: "border-violet-100",
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3 shadow-sm transition-shadow hover:shadow-md"
                >
                    <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${stat.iconBg}`}
                    >
                        <stat.icon size={18} className={stat.iconColor} />
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-[11px] font-medium text-slate-500">
                            {stat.label}
                        </p>
                        <p className="truncate text-sm font-bold text-slate-900">
                            {stat.value}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}

function TransactionsSide({
    loading,
    categories,
    search,
    setSearch,
    selectedDay,
    setSelectedDay,
    selectedMonth,
    selectedYear,
    onTransactionCardClick,
    reloadMonthlyOverview,
    setIsCreateCategoryModalOpen,
    onCreateTransaction,
}) {
    const scrollContainerRef = useRef(null);

    const accordionStorageKey = useMemo(() => {
        return getAccordionStorageKey(selectedYear, selectedMonth);
    }, [selectedYear, selectedMonth]);

    const scrollStorageKey = useMemo(() => {
        return getScrollStorageKey(selectedYear, selectedMonth);
    }, [selectedYear, selectedMonth]);

    const [openCategoryMap, setOpenCategoryMap] = useState(() => {
        return getFromStorage(accordionStorageKey, {});
    });

    const [openTransactionMenuId, setOpenTransactionMenuId] = useState(null);
    const [transactionMenuAnchor, setTransactionMenuAnchor] = useState("button");

    const [transactionContextPosition, setTransactionContextPosition] = useState({
        x: 0,
        y: 0,
    });

    const [typeFilter, setTypeFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    const [expandedCategoryId, setExpandedCategoryId] = useState(null);
    const [heroWidth, setHeroWidth] = useState(() => getFromStorage("hero-width-preference", "md"));

    const normalizedSearch = search.trim().toLowerCase();
    const isSearching = normalizedSearch.length > 0;

    const filteredCategories = useMemo(() => {
        let result = categories;

        if (statusFilter !== "all") {
            result = result.filter((category) => {
                const isActive = category.has_transactions !== false;
                return statusFilter === "active" ? isActive : !isActive;
            });
        }

        result = result
            .map((category) => {
                let transactions = category.transactions ?? [];

                if (typeFilter !== "all") {
                    const filterType = typeFilter === "income" ? "Income" : "Expense";
                    transactions = transactions.filter(
                        (t) => t.type === filterType
                    );
                }

                if (normalizedSearch) {
                    const categoryName = String(category.name || "").toLowerCase();
                    const categoryMatches = categoryName.includes(normalizedSearch);

                    if (!categoryMatches) {
                        transactions = transactions.filter((transaction) => {
                            const transactionName = String(
                                transaction.name || ""
                            ).toLowerCase();
                            const transactionNote = String(
                                transaction.note || ""
                            ).toLowerCase();
                            const transactionType = String(
                                transaction.type || ""
                            ).toLowerCase();

                            return (
                                transactionName.includes(normalizedSearch) ||
                                transactionNote.includes(normalizedSearch) ||
                                transactionType.includes(normalizedSearch)
                            );
                        });
                    }
                }

                return {
                    ...category,
                    transactions,
                    isSearchMatch: normalizedSearch
                        ? String(category.name || "").toLowerCase().includes(normalizedSearch) ||
                          transactions.length > 0
                        : true,
                };
            })
            .filter((category) => category.isSearchMatch);

        return result;
    }, [categories, normalizedSearch, typeFilter, statusFilter]);

    useEffect(() => {
        const savedOpenCategoryMap = getFromStorage(accordionStorageKey, {});
        setOpenCategoryMap(savedOpenCategoryMap);
    }, [accordionStorageKey]);

    useEffect(() => {
        if (!categories.length) return;

        setOpenCategoryMap((prev) => {
            const next = { ...prev };

            categories.forEach((category) => {
                if (next[category.id] === undefined) {
                    next[category.id] = false;
                }
            });

            return next;
        });
    }, [categories]);

    useEffect(() => {
        if (isSearching) return;

        saveToStorage(accordionStorageKey, openCategoryMap);
    }, [accordionStorageKey, openCategoryMap, isSearching]);

    useEffect(() => {
        if (loading) return;

        const scrollElement = scrollContainerRef.current;
        if (!scrollElement) return;

        const savedScrollTop = Number(getFromStorage(scrollStorageKey, 0)) || 0;

        requestAnimationFrame(() => {
            scrollElement.scrollTop = savedScrollTop;
        });
    }, [loading, scrollStorageKey, filteredCategories.length]);

    const categoriesTotal = categories.length;

    const transactionsTotal = useMemo(() => {
        return categories.reduce((total, category) => {
            return total + (category.transactions?.length ?? 0);
        }, 0);
    }, [categories]);


    function handleScroll(e) {
        if (isSearching) return;

        saveToStorage(scrollStorageKey, e.currentTarget.scrollTop);
    }

    const expandedCategoryData = useMemo(() => {
        if (!expandedCategoryId) return null;
        const catIndex = categories.findIndex((c) => c.id === expandedCategoryId);
        if (catIndex === -1) return null;
        const cat = categories[catIndex];
        const transactions = cat.transactions ?? [];
        const categoryCurrentTotal = Number(cat.current_total || 0);
        const categoryBudgetTotal = Number(cat.budget_total || 0);
        const progress = categoryBudgetTotal > 0 ? Math.min((categoryCurrentTotal / categoryBudgetTotal) * 100, 100) : 0;
        const dotColor = !cat.has_transactions ? "gray" : categoryBudgetTotal > 0 ? "green" : "red";
        const colorTheme = getCategoryColor(cat.color, catIndex);
        return { category: cat, transactions, categoryCurrentTotal, categoryBudgetTotal, progress, dotColor, colorTheme };
    }, [expandedCategoryId, categories]);

    return (
        <div className="flex min-h-0 flex-col rounded-xl border border-slate-200 bg-white shadow-sm lg:h-full lg:overflow-hidden">
            <div className="flex shrink-0 flex-col gap-3 border-b border-slate-200 p-3 sm:p-4">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <h2 className="truncate text-sm font-bold text-slate-900">
                            Transazioni
                        </h2>
                        <span className="text-xs text-slate-400">
                            {`${categoriesTotal} · ${transactionsTotal}`}
                        </span>
                        <button
                            type="button"
                            title="Aggiungi categoria"
                            onClick={() => setIsCreateCategoryModalOpen(true)}
                            className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                        >
                            <Plus size={14} />
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <div className="min-w-0 flex-1">
                        <SearchBar search={search} setSearch={setSearch} />
                    </div>

                    <div className="flex items-center gap-2">
                        <TypeToggle value={typeFilter} onChange={setTypeFilter} />
                        <StatusSelect value={statusFilter} onChange={setStatusFilter} />
                    </div>
                </div>
            </div>

            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="min-h-0 flex-1 overflow-y-auto p-2 sm:p-3"
            >
                {loading ? (
                    <LoadingState />
                ) : filteredCategories.length > 0 ? (
                    <div className="space-y-4">
                        {filteredCategories.map((category, categoryIndex) => {
                            const transactions = category.transactions ?? [];

                            const categoryCurrentTotal = Number(
                                category.current_total || 0
                            );

                            const categoryBudgetTotal = Number(
                                category.budget_total || 0
                            );

                            const progress =
                                categoryBudgetTotal > 0
                                    ? Math.min(
                                          (categoryCurrentTotal / categoryBudgetTotal) * 100,
                                          100
                                      )
                                    : 0;

                            const dotColor =
                                !category.has_transactions
                                    ? "gray"
                                    : categoryBudgetTotal > 0
                                        ? "green"
                                        : "red";

                            const colorTheme = getCategoryColor(category.color, categoryIndex);

                            if (expandedCategoryId === category.id) {
                                return <div key={category.id} className="h-16 rounded-xl bg-slate-100/50" />;
                            }

                            return (
                                <motion.div
                                    key={category.id}
                                    layoutId={`category-hero-${category.id}`}
                                >
                                    <CategorySection
                                        category={category}
                                        colorTheme={colorTheme}
                                        dotColor={dotColor}
                                        progress={progress}
                                        categoryCurrentTotal={categoryCurrentTotal}
                                        categoryBudgetTotal={categoryBudgetTotal}
                                        transactions={transactions}
                                        onExpand={() => setExpandedCategoryId(category.id)}
                                    />
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <EmptyState
                        text={
                            normalizedSearch
                                ? "Nessun risultato trovato"
                                : "Nessuna categoria disponibile"
                        }
                    />
                )}
            </div>

            {createPortal(
                <AnimatePresence>
                    {expandedCategoryId && expandedCategoryData && (
                        <>
                            <motion.div
                                key="hero-backdrop"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm"
                                onClick={() => setExpandedCategoryId(null)}
                            />
                            <motion.div
                                key="hero-expanded"
                                layoutId={`category-hero-${expandedCategoryId}`}
                                className={`fixed inset-0 z-[9999] m-auto flex h-[calc(100vh-2rem)] max-h-[800px] w-[calc(100%-2rem)] ${HERO_WIDTHS[heroWidth]?.maxW || "max-w-2xl"} flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:h-[calc(100vh-4rem)] sm:w-[calc(100%-4rem)]`}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            >
                                <ExpandedCategoryView
                                    category={expandedCategoryData.category}
                                    colorTheme={expandedCategoryData.colorTheme}
                                    dotColor={expandedCategoryData.dotColor}
                                    progress={expandedCategoryData.progress}
                                    categoryCurrentTotal={expandedCategoryData.categoryCurrentTotal}
                                    categoryBudgetTotal={expandedCategoryData.categoryBudgetTotal}
                                    transactions={expandedCategoryData.transactions}
                                    selectedMonth={selectedMonth}
                                    selectedYear={selectedYear}
                                    onClose={() => setExpandedCategoryId(null)}
                                    onCreateTransaction={onCreateTransaction}
                                    onTransactionCardClick={onTransactionCardClick}
                                    categories={categories}
                                    openTransactionMenuId={openTransactionMenuId}
                                    setOpenTransactionMenuId={setOpenTransactionMenuId}
                                    transactionMenuAnchor={transactionMenuAnchor}
                                    setTransactionMenuAnchor={setTransactionMenuAnchor}
                                    transactionContextPosition={transactionContextPosition}
                                    setTransactionContextPosition={setTransactionContextPosition}
                                    reloadMonthlyOverview={reloadMonthlyOverview}
                                    setSelectedDay={setSelectedDay}
                                    selectedDay={selectedDay}
                                    heroWidth={heroWidth}
                                    setHeroWidth={setHeroWidth}
                                />
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>,
                document.getElementById("modal-root")
            )}
        </div>
    );
}

const DOT_COLORS = {
    green: "bg-emerald-400",
    red: "bg-red-400",
    gray: "bg-slate-300",
};

const HERO_WIDTHS = {
    sm: { label: "S", maxW: "max-w-md" },
    md: { label: "M", maxW: "max-w-2xl" },
    lg: { label: "L", maxW: "max-w-4xl" },
    xl: { label: "XL", maxW: "max-w-6xl" },
    full: { label: "Full", maxW: "max-w-[calc(100%-2rem)]" },
};

function CategorySection({
    category,
    colorTheme,
    dotColor,
    progress,
    categoryCurrentTotal,
    categoryBudgetTotal,
    transactions,
    onExpand,
}) {
    const dotClassName = DOT_COLORS[dotColor] || "bg-slate-300";

    return (
        <button
            type="button"
            onClick={onExpand}
            className={`group flex w-full cursor-pointer items-center gap-3 rounded-xl border border-l-4 border-slate-200 ${colorTheme.border} bg-white px-3 py-3 text-left shadow-sm transition-all hover:shadow-md ${colorTheme.borderHover} sm:px-4`}
        >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${colorTheme.iconBg} ${colorTheme.iconColor} transition-transform group-hover:scale-105`}>
                <FolderOpen size={18} />
            </div>

            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 shrink-0 rounded-full ${dotClassName}`} />
                    <span className="truncate text-sm font-semibold text-slate-900">
                        {category.name}
                    </span>
                    <span className={`shrink-0 rounded-full ${colorTheme.bg} px-1.5 py-0.5 text-[10px] font-medium ${colorTheme.iconColor}`}>
                        {transactions.length}
                    </span>
                </div>

                <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
                    <span>{formatCurrency(categoryCurrentTotal)}</span>
                    <span className="text-slate-300">/</span>
                    <span>{formatCurrency(categoryBudgetTotal)}</span>
                </div>

                <div className="mt-1.5 flex items-center gap-2">
                    <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-slate-100">
                        <div
                            className={`h-full rounded-full ${colorTheme.progressBar} transition-all duration-500`}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <span className="shrink-0 text-[10px] font-medium text-slate-500">
                        {progress.toFixed(0)}%
                    </span>
                </div>
            </div>

            <ChevronRight
                size={18}
                className="shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-500"
            />
        </button>
    );
}

function ExpandedCategoryView({
    category,
    colorTheme,
    dotColor,
    progress,
    categoryCurrentTotal,
    categoryBudgetTotal,
    transactions,
    selectedMonth,
    selectedYear,
    onClose,
    onCreateTransaction,
    onTransactionCardClick,
    categories,
    openTransactionMenuId,
    setOpenTransactionMenuId,
    transactionMenuAnchor,
    setTransactionMenuAnchor,
    transactionContextPosition,
    setTransactionContextPosition,
    reloadMonthlyOverview,
    setSelectedDay,
    selectedDay,
    heroWidth,
    setHeroWidth,
}) {
    const dotClassName = DOT_COLORS[dotColor] || "bg-slate-300";
    const [transactionSearch, setTransactionSearch] = useState("");

    function handleWidthChange(key) {
        setHeroWidth(key);
        saveToStorage("hero-width-preference", key);
    }

    const filteredTransactions = useMemo(() => {
        const query = transactionSearch.trim().toLowerCase();
        if (!query) return transactions;
        return transactions.filter((t) => t.name?.toLowerCase().includes(query));
    }, [transactions, transactionSearch]);

    return (
        <>
            <div className={`shrink-0 border-b border-l-4 ${colorTheme.border} border-slate-200 ${colorTheme.bgLight}`}>
                <div className="flex items-center gap-3 px-4 py-4 sm:px-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50"
                    >
                        <ArrowLeft size={18} />
                    </button>

                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${colorTheme.iconBg} ${colorTheme.iconColor}`}>
                        <FolderOpen size={20} />
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                            <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${dotClassName}`} />
                            <h2 className="truncate text-base font-bold text-slate-900 sm:text-lg">
                                {category.name}
                            </h2>
                            <span className={`shrink-0 rounded-full ${colorTheme.bg} px-2 py-0.5 text-xs font-medium ${colorTheme.iconColor}`}>
                                {transactions.length}
                            </span>
                        </div>
                        <div className="mt-1 flex items-center gap-3 text-sm text-slate-500">
                            <span>{formatCurrency(categoryCurrentTotal)} / {formatCurrency(categoryBudgetTotal)}</span>
                            <span>{progress.toFixed(0)}%</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => onCreateTransaction(category.id)}
                        className={`inline-flex items-center gap-1.5 rounded-lg border ${colorTheme.border} px-3 py-2 text-xs font-medium ${colorTheme.addBtnText} transition ${colorTheme.addBtnHover}`}
                    >
                        <Plus size={15} />
                        <span className="hidden sm:inline">Aggiungi</span>
                    </button>
                </div>

                <div className="px-4 pb-3 sm:px-6">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200/60">
                        <div
                            className={`h-full rounded-full ${colorTheme.progressBar} transition-all duration-500`}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2 px-4 pb-3 sm:px-6">
                    <div className="min-w-0 flex-1">
                        <SearchBar search={transactionSearch} setSearch={setTransactionSearch} />
                    </div>
                    <div className="hidden shrink-0 items-center gap-0.5 rounded-lg border border-slate-200 bg-slate-50 p-0.5 sm:flex">
                        {Object.entries(HERO_WIDTHS).map(([key, { label }]) => (
                            <button
                                key={key}
                                type="button"
                                onClick={() => handleWidthChange(key)}
                                className={`rounded-md px-2 py-1 text-[11px] font-medium transition ${
                                    heroWidth === key
                                        ? "bg-white text-slate-900 shadow-sm"
                                        : "text-slate-400 hover:text-slate-600"
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4">
                <div className="space-y-2">
                    {filteredTransactions.length > 0 ? (
                        filteredTransactions.map((transaction) => {
                            const current = Number(transaction.current || 0);
                            const target = Number(transaction.target || 0);

                            return (
                                <TransactionCard
                                    key={transaction.id}
                                    budget={target}
                                    current={current}
                                    transaction={transaction}
                                    categories={categories}
                                    selectedCategoryId={category.id}
                                    categoryColorTheme={colorTheme}
                                    onClick={() => onTransactionCardClick(transaction)}
                                    openTransactionMenuId={openTransactionMenuId}
                                    setOpenTransactionMenuId={setOpenTransactionMenuId}
                                    transactionMenuAnchor={transactionMenuAnchor}
                                    setTransactionMenuAnchor={setTransactionMenuAnchor}
                                    transactionContextPosition={transactionContextPosition}
                                    setTransactionContextPosition={setTransactionContextPosition}
                                    reloadMonthlyOverview={reloadMonthlyOverview}
                                    setSelectedDay={setSelectedDay}
                                    selectedDay={selectedDay}
                                    selectedMonth={selectedMonth}
                                    selectedYear={selectedYear}
                                />
                            );
                        })
                    ) : (
                        <EmptyState text={transactionSearch ? "Nessun risultato trovato" : "Nessuna transazione disponibile"} />
                    )}
                </div>
            </div>
        </>
    );
}

function LoadingState() {
    return (
        <div className="flex h-full min-h-45 items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-slate-200 border-t-blue-600" />
                <span className="text-xs font-medium text-slate-500">
                    Caricamento...
                </span>
            </div>
        </div>
    );
}

function EmptyState({ text = "Nessun dato disponibile" }) {
    return (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 px-4 py-8 text-center">
            <FolderOpen size={24} className="text-slate-300" />
            <p className="text-xs text-slate-500">{text}</p>
        </div>
    );
}

function SearchBar({ search, setSearch }) {
    return (
        <div className="relative">
            <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
                type="text"
                placeholder="Cerca categoria o transazione..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 py-1 pl-9 pr-9 text-xs outline-none transition-all focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />

            {search && (
                <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-2.5 top-1/2 flex h-5 w-5 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-200 hover:text-slate-600"
                    aria-label="Cancella ricerca"
                >
                    <X size={13} />
                </button>
            )}
        </div>
    );
}

function TypeToggle({ value, onChange }) {
    const options = [
        { key: "all", label: "Tutte" },
        { key: "income", label: "Entrate" },
        { key: "expense", label: "Uscite" },
    ];

    return (
        <div className="inline-flex h-9 items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5">
            {options.map((opt) => (
                <button
                    key={opt.key}
                    type="button"
                    onClick={() => onChange(opt.key)}
                    className={`cursor-pointer rounded-md px-2.5 py-1.5 text-[11px] font-medium transition-all ${
                        value === opt.key
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-500 hover:text-slate-700"
                    }`}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
}

function StatusSelect({ value, onChange }) {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-9 cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-2 text-[11px] font-medium text-slate-700 outline-none transition-all focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
        >
            <option value="all">Tutte le categorie</option>
            <option value="active">Attive</option>
            <option value="inactive">Inattive</option>
        </select>
    );
}
