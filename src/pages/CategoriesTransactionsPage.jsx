import { useGet } from "../hooks/useGet";
import { Search, Plus, X } from "lucide-react";
import TransactionCard from "../components/TransactionCard";
import { API_ENDPOINTS } from "../api/endpoint";
import React, { useMemo, useState, useEffect, useRef } from "react";
import formatCurrency from "../utils/formatCurrency";
import ModalWrapper from "../components/ModalWrapper";
import CreateCategoryModal from "../components/Modals/CreateCategoryModal";
import CreateTransactionModal from "../components/Modals/CreateTransactionModal";
import DividerSection from "../components/DividerSection";
import getMonthByNum from "../utils/getMonthByNum";
import TransactionMovementsModal from "../components/Modals/TransactionMovementsModal";
import MonthNavigator from "../components/MonthNavigator";
import { useSearchParams } from "react-router-dom";
import saveToStorage from "../utils/saveToStorage";
import getFromStorage from "../utils/getFromStorage";

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

    return (
        <div className="h-full min-h-0 box-border overflow-hidden bg-slate-50 p-2 sm:p-3">
            <div className="flex h-full min-h-0 flex-col">
                <div className="mb-3 grid min-h-0 grid-cols-1 gap-3 overflow-hidden lg:grid-cols-4">
                    <div className="min-h-0 overflow-hidden lg:col-span-1">
                        <h1 className="truncate text-xl font-semibold text-slate-900 sm:text-xl">
                            Categorie e transazioni
                        </h1>

                        <p className="truncate text-[11px] text-slate-500 sm:text-xs">
                            Gestisci le transazioni per categoria
                        </p>
                    </div>

                    <div className="min-h-0 overflow-hidden lg:col-span-3">
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

                {error && (
                    <div className="mb-2 shrink-0 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
                        Errore durante il caricamento dei dati
                    </div>
                )}

                <div className="min-h-0 flex-1 overflow-hidden">
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

    const normalizedSearch = search.trim().toLowerCase();
    const isSearching = normalizedSearch.length > 0;

    const filteredCategories = useMemo(() => {
        if (!normalizedSearch) return categories;

        return categories
            .map((category) => {
                const categoryName = String(category.name || "").toLowerCase();
                const categoryMatches = categoryName.includes(normalizedSearch);

                const filteredTransactions = (category.transactions ?? []).filter(
                    (transaction) => {
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
                    }
                );

                return {
                    ...category,
                    transactions: categoryMatches
                        ? category.transactions ?? []
                        : filteredTransactions,
                    isSearchMatch:
                        categoryMatches || filteredTransactions.length > 0,
                };
            })
            .filter((category) => category.isSearchMatch);
    }, [categories, normalizedSearch]);

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

    const currentTotal = useMemo(() => {
        return categories.reduce((total, category) => {
            return total + Number(category.current_total || 0);
        }, 0);
    }, [categories]);

    function toggleCategory(categoryId) {
        if (isSearching) return;

        setOpenCategoryMap((prev) => ({
            ...prev,
            [categoryId]: !prev[categoryId],
        }));
    }

    function handleScroll(e) {
        if (isSearching) return;

        saveToStorage(scrollStorageKey, e.currentTarget.scrollTop);
    }

    return (
        <div className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:h-full">
            <HeadOfSide
                title="Transazioni"
                subtitle={`${categoriesTotal} categorie • ${transactionsTotal} transazioni`}
                iconCTA={Plus}
                hoverTitle="Aggiungi categoria"
                search={search}
                setSearch={setSearch}
                onCTAClick={() => setIsCreateCategoryModalOpen(true)}
                valuePill={formatCurrency(currentTotal)}
            />

            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="min-h-0 flex-1 overflow-y-auto p-2"
            >
                {loading ? (
                    <LoadingState />
                ) : filteredCategories.length > 0 ? (
                    <div className="space-y-2">
                        {filteredCategories.map((category) => {
                            const transactions = category.transactions ?? [];

                            const isOpen = isSearching
                                ? true
                                : openCategoryMap[category.id] ?? false;

                            const categoryCurrentTotal = Number(
                                category.current_total || 0
                            );

                            const categoryBudgetTotal = Number(
                                category.budget_total || 0
                            );

                            const dotColor =
                                !category.has_transactions
                                    ? "gray"
                                    : categoryBudgetTotal > 0
                                        ? "green"
                                        : "red";

                            return (
                                <DividerSection
                                    key={category.id}
                                    label={`${category.name} • ${getMonthByNum(
                                        selectedMonth,
                                        3
                                    )} ${selectedYear}`}
                                    numItems={transactions.length}
                                    show={isOpen}
                                    dotColor={dotColor}
                                    onClick={() => toggleCategory(category.id)}
                                >
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                                            <div className="min-w-0">
                                                <p className="truncate text-xs font-semibold text-slate-700">
                                                    {formatCurrency(
                                                        categoryCurrentTotal
                                                    )}
                                                    {" / "}
                                                    {formatCurrency(
                                                        categoryBudgetTotal
                                                    )}
                                                </p>

                                                <p className="truncate text-[11px] text-slate-500">
                                                    Totale corrente / budget
                                                    categoria
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onCreateTransaction(
                                                        category.id
                                                    )
                                                }
                                                className="inline-flex h-8 shrink-0 cursor-pointer items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                                            >
                                                <Plus size={13} />
                                                Transazione
                                            </button>
                                        </div>

                                        {transactions.length > 0 ? (
                                            transactions.map((transaction) => {
                                                const current = Number(
                                                    transaction.current || 0
                                                );

                                                const target = Number(
                                                    transaction.target || 0
                                                );

                                                return (
                                                    <TransactionCard
                                                        key={transaction.id}
                                                        budget={target}
                                                        current={current}
                                                        transaction={
                                                            transaction
                                                        }
                                                        categories={categories}
                                                        selectedCategoryId={
                                                            category.id
                                                        }
                                                        onClick={() =>
                                                            onTransactionCardClick(
                                                                transaction
                                                            )
                                                        }
                                                        openTransactionMenuId={
                                                            openTransactionMenuId
                                                        }
                                                        setOpenTransactionMenuId={
                                                            setOpenTransactionMenuId
                                                        }
                                                        transactionMenuAnchor={
                                                            transactionMenuAnchor
                                                        }
                                                        setTransactionMenuAnchor={
                                                            setTransactionMenuAnchor
                                                        }
                                                        transactionContextPosition={
                                                            transactionContextPosition
                                                        }
                                                        setTransactionContextPosition={
                                                            setTransactionContextPosition
                                                        }
                                                        reloadMonthlyOverview={
                                                            reloadMonthlyOverview
                                                        }
                                                        setSelectedDay={
                                                            setSelectedDay
                                                        }
                                                        selectedDay={
                                                            selectedDay
                                                        }
                                                        selectedMonth={
                                                            selectedMonth
                                                        }
                                                        selectedYear={
                                                            selectedYear
                                                        }
                                                    />
                                                );
                                            })
                                        ) : (
                                            <ItemEmpty
                                                text={
                                                    normalizedSearch
                                                        ? "Nessuna transazione trovata"
                                                        : "Nessuna transazione disponibile"
                                                }
                                            />
                                        )}
                                    </div>
                                </DividerSection>
                            );
                        })}
                    </div>
                ) : (
                    <ItemEmpty
                        text={
                            normalizedSearch
                                ? "Nessun risultato trovato"
                                : "Nessuna categoria disponibile"
                        }
                    />
                )}
            </div>
        </div>
    );
}

function IconButton({ icon: Icon, onClick, hoverTitle }) {
    return (
        <button
            type="button"
            title={hoverTitle || undefined}
            onClick={onClick}
            className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
        >
            <Icon size={14} />
        </button>
    );
}

function LoadingState() {
    return (
        <div className="flex h-full min-h-45 items-center justify-center">
            <div className="flex flex-col items-center gap-2">
                <div className="h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-slate-700" />
                <span className="text-xs text-slate-500">Caricamento...</span>
            </div>
        </div>
    );
}

function ItemEmpty({ text = "Nessun dato disponibile" }) {
    return (
        <div className="rounded-lg border border-dashed border-slate-300 p-4 text-center text-xs text-slate-500">
            {text}
        </div>
    );
}

function SearchBar({ search, setSearch }) {
    return (
        <div className="relative">
            <Search
                size={14}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
                type="text"
                placeholder="Cerca categoria o transazione..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 w-full rounded-lg border border-slate-200 bg-white py-1 pl-8 pr-8 text-xs outline-none transition focus:border-slate-400"
            />

            {search && (
                <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-2 top-1/2 flex h-5 w-5 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                    aria-label="Cancella ricerca"
                >
                    <X size={13} />
                </button>
            )}
        </div>
    );
}

function HeadOfSide({
    title,
    subtitle,
    iconCTA,
    hoverTitle,
    search,
    setSearch,
    onCTAClick,
    valuePill,
}) {
    return (
        <div className="flex shrink-0 flex-col border-b border-slate-200 p-2.5 sm:p-3">
            <div className="mb-2 flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <h2 className="truncate text-sm font-semibold text-slate-900">
                        {title}
                    </h2>

                    <p className="truncate text-[11px] text-slate-500">
                        {subtitle}
                    </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                    {valuePill ? <ValuePill value={valuePill} /> : null}

                    {iconCTA ? (
                        <IconButton
                            icon={iconCTA}
                            hoverTitle={hoverTitle}
                            onClick={onCTAClick}
                        />
                    ) : null}
                </div>
            </div>

            <SearchBar search={search} setSearch={setSearch} />
        </div>
    );
}

function ValuePill({ value }) {
    return (
        <div className="hidden rounded-md bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700 sm:block">
            {value}
        </div>
    );
}