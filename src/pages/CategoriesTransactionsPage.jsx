import { useGet } from "../hooks/useGet";
import { Search, Plus, X } from "lucide-react";
import TransactionCard from "../components/TransactionCard";
import { API_ENDPOINTS } from "../api/endpoint";
import React, { useMemo, useState, useEffect, useCallback } from "react";
import formatCurrency from "../utils/formatCurrency";
import CategoryCard from "../components/CategoryCard";
import ModalWrapper from "../components/ModalWrapper";
import CreateCategoryModal from "../components/Modals/CreateCategoryModal";
import CreateTransactionModal from "../components/Modals/CreateTransactionModal";
import DividerSection from "../components/DividerSection";
import getMonthByNum from "../utils/getMonthByNum";
import TransactionMovementsModal from "../components/Modals/TransactionMovementsModal";
import MonthNavigator from "../components/MonthNavigator";
import { useSearchFilter } from "../hooks/useSearchFilter";
import { useSelectedItem } from "../hooks/useSelectedItem";

export default function CategoriesTransactionsPage() {

    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const [selectedDay, setSelectedDay] = useState(currentDay);
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectedYear, setSelectedYear] = useState(currentYear);

    const [searchedCategory, setSearchedCategory] = useState("");
    const [searchedTransaction, setSearchedTransaction] = useState("");

    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [openCategoryMenuId, setOpenCategoryMenuId] = useState(null);

    const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] = useState(false);
    const [isCreateTransactionModalOpen, setIsCreateTransactionModalOpen] = useState(false);

    const [showMovementsModal, setShowMovementsModal] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    const { data, loading, error, reload: reloadMonthlyOverview } = useGet(API_ENDPOINTS.monthlyOverview(
        {
            month: selectedMonth,
            year: selectedYear,
        }),
        {
            delayMs: 0,
        }
    );

    console.log(data);


    const categories = data?.categories ?? [];

    const filteredCategories = useSearchFilter(categories, searchedCategory, ["name"]);

    const selectedCategory = useSelectedItem(filteredCategories, selectedCategoryId);

    const transactions = selectedCategory?.transactions ?? [];

    const filteredTransactions = useSearchFilter(transactions, searchedTransaction, ["name", "note", "type"]);

    const maxCategoryTotal = useMemo(() => {
        if (!filteredCategories.length) return 0;

        return Math.max(
            ...filteredCategories.map((category) =>
                Number(category.current_total || 0)
            )
        );
    }, [filteredCategories]);

    const availableYears = useMemo(() => {
        const years = [];

        for (let year = currentYear - 2; year <= currentYear + 5; year++) {
            years.push(year);
        }

        return years;
    }, [currentYear]);

    function handleTransactionCard(transaction) {
        setSelectedTransaction(transaction);
        setShowMovementsModal(true);
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
                            Seleziona le transazioni
                        </p>
                    </div>

                    <div className="min-h-0 overflow-hidden lg:col-span-3">
                        <MonthNavigator
                            selectedMonth={selectedMonth}
                            setSelectedMonth={setSelectedMonth}
                            selectedYear={selectedYear}
                            setSelectedYear={setSelectedYear}
                            availableYears={availableYears}
                            currentYear={currentYear}
                        />
                    </div>
                </div>

                {error && (
                    <div className="mb-2 shrink-0 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
                        Errore durante il caricamento dei dati
                    </div>
                )}

                <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 overflow-hidden lg:grid-cols-4">
                    <div className="min-h-0 overflow-hidden lg:col-span-1">
                        <CategorySide
                            loading={loading}
                            categories={filteredCategories}
                            searchedCategory={searchedCategory}
                            setSearchedCategory={setSearchedCategory}
                            selectedCategory={selectedCategory}
                            maxCategoryTotal={maxCategoryTotal}
                            openCategoryMenuId={openCategoryMenuId}
                            setOpenCategoryMenuId={setOpenCategoryMenuId}
                            setSelectedCategoryId={setSelectedCategoryId}
                            setIsCreateCategoryModalOpen={setIsCreateCategoryModalOpen}
                            selectedYear={selectedYear}
                            selectedMonth={selectedMonth}
                            reloadMonthlyOverview={reloadMonthlyOverview}
                        />
                    </div>

                    <div className="min-h-0 overflow-hidden lg:col-span-3">
                        <TransactionsSide
                            loading={loading}
                            categories={categories}
                            transactions={filteredTransactions}
                            selectedCategory={selectedCategory}
                            selectedCategoryId={selectedCategory?.id}
                            setOpenCategoryMenuId={setOpenCategoryMenuId}
                            searchedTransaction={searchedTransaction}
                            setSearchedTransaction={setSearchedTransaction}
                            setIsCreateTransactionModalOpen={setIsCreateTransactionModalOpen}
                            selectedDay={selectedDay}
                            setSelectedDay={setSelectedDay}
                            selectedMonth={selectedMonth}
                            selectedYear={selectedYear}
                            onTransactionCardClick={handleTransactionCard}
                            reloadMonthlyOverview={reloadMonthlyOverview}
                        />
                    </div>
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
                    selectedCategoryId={selectedCategory?.id}
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
                    availableYears={availableYears}
                    currentYear={currentYear}
                    reloadMonthlyOverview={reloadMonthlyOverview}
                />
            </ModalWrapper>
        </div>
    );
}






function CategorySide({
    loading,
    categories,
    setIsCreateCategoryModalOpen,
    searchedCategory,
    setSearchedCategory,
    selectedCategory,
    maxCategoryTotal,
    openCategoryMenuId,
    setOpenCategoryMenuId,
    setSelectedCategoryId,
    selectedYear,
    selectedMonth,
    reloadMonthlyOverview,
}) {
    
    const [showCategoriesWithTransactions, setShowCategoriesWithTransactions] = useState(true);
    const [showCategoriesEmptyInSelectedPeriod, setShowCategoriesEmptyInSelectedPeriod] = useState(true);
    const [showCategoriesWithoutTransactions, setShowCategoriesWithoutTransactions] = useState(true);


    const categoriesWithTransactions = useMemo(() => {
        return categories.filter((category) => {
            return (
                category.has_transactions &&
                Number(category.budget_total || 0) > 0
            );
        });
    }, [categories]);

    const categoriesEmptyInSelectedPeriod = useMemo(() => {
        return categories.filter((category) => {
            return (
                category.has_transactions &&
                Number(category.budget_total || 0) === 0
            );
        });
    }, [categories]);

    const categoriesWithoutTransactions = useMemo(() => {
        return categories.filter((category) => !category.has_transactions);
    }, [categories]);

    useEffect(() => {
        const hasSearch = searchedCategory.trim().length > 0;

        if (!hasSearch) return;

        setShowCategoriesWithTransactions(categoriesWithTransactions.length > 0);
        setShowCategoriesEmptyInSelectedPeriod(categoriesEmptyInSelectedPeriod.length > 0);
        setShowCategoriesWithoutTransactions(categoriesWithoutTransactions.length > 0);
    }, [
        searchedCategory,
        categoriesWithTransactions.length,
        categoriesEmptyInSelectedPeriod.length,
        categoriesWithoutTransactions.length,
    ]);

    return (
        <div className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm max-lg:h-[38vh] lg:h-full">
            <HeadOfSide
                title="Categorie"
                subtitle={`${categories.length} categorie`}
                iconCTA={Plus}
                hoverTitle="Aggiungi categoria"
                search={searchedCategory}
                setSearch={setSearchedCategory}
                onCTAClick={() => setIsCreateCategoryModalOpen(true)}
            />

            <div className="min-h-0 flex-1 overflow-y-scroll p-2">
                {loading ? (
                    <LoadingState />
                ) : categories.length > 0 ? (
                    <div className="space-y-2">
                        <DividerSection
                            label={`Categorie attive • ${getMonthByNum(selectedMonth, 3)} ${selectedYear}`}
                            numItems={categoriesWithTransactions.length}
                            show={showCategoriesWithTransactions}
                            dotColor="green"
                            onClick={() =>
                                setShowCategoriesWithTransactions((prev) => !prev)
                            }
                        >
                            {categoriesWithTransactions.length > 0 ? (
                                categoriesWithTransactions.map((category) => {
                                    const isSelected = category.id === selectedCategory?.id;
                                    const total = Number(category.current_total || 0);

                                    const progress =
                                        maxCategoryTotal > 0
                                            ? (total / maxCategoryTotal) * 100
                                            : 0;

                                    return (
                                        <CategoryCard
                                            key={category.id}
                                            isSelected={isSelected}
                                            progress={progress}
                                            category={category}
                                            openCategoryMenuId={openCategoryMenuId}
                                            setOpenCategoryMenuId={setOpenCategoryMenuId}
                                            setSelectedCategoryId={setSelectedCategoryId}
                                            reloadMonthlyOverview={reloadMonthlyOverview}
                                            total={total}
                                        />
                                    );
                                })
                            ) : (
                                <ItemEmpty text="Nessuna categoria attiva" />
                            )}
                        </DividerSection>

                        <DividerSection
                            label={`Categorie inattive • ${getMonthByNum(selectedMonth, 3)} ${selectedYear}`}
                            numItems={categoriesEmptyInSelectedPeriod.length}
                            show={showCategoriesEmptyInSelectedPeriod}
                            dotColor="red"
                            onClick={() =>
                                setShowCategoriesEmptyInSelectedPeriod((prev) => !prev)
                            }
                        >
                            {categoriesEmptyInSelectedPeriod.length > 0 ? (
                                categoriesEmptyInSelectedPeriod.map((category) => {
                                    const isSelected = category.id === selectedCategory?.id;

                                    return (
                                        <CategoryCard
                                            key={category.id}
                                            isSelected={isSelected}
                                            progress={0}
                                            category={category}
                                            openCategoryMenuId={openCategoryMenuId}
                                            setOpenCategoryMenuId={setOpenCategoryMenuId}
                                            setSelectedCategoryId={setSelectedCategoryId}
                                            reloadMonthlyOverview={reloadMonthlyOverview}
                                            total={0}
                                        />
                                    );
                                })
                            ) : (
                                <ItemEmpty text="Nessuna categoria inattiva" />
                            )}
                        </DividerSection>

                        <DividerSection
                            label="Categorie vuote"
                            numItems={categoriesWithoutTransactions.length}
                            show={showCategoriesWithoutTransactions}
                            dotColor="gray"
                            onClick={() =>
                                setShowCategoriesWithoutTransactions((prev) => !prev)
                            }
                        >
                            {categoriesWithoutTransactions.length > 0 ? (
                                categoriesWithoutTransactions.map((category) => {
                                    const isSelected = category.id === selectedCategory?.id;

                                    return (
                                        <CategoryCard
                                            key={category.id}
                                            isSelected={isSelected}
                                            progress={0}
                                            category={category}
                                            openCategoryMenuId={openCategoryMenuId}
                                            setOpenCategoryMenuId={setOpenCategoryMenuId}
                                            setSelectedCategoryId={setSelectedCategoryId}
                                            reloadMonthlyOverview={reloadMonthlyOverview}
                                            total={0}
                                        />
                                    );
                                })
                            ) : (
                                <ItemEmpty text="Nessuna categoria vuota" />
                            )}
                        </DividerSection>
                    </div>
                ) : (
                    <ItemEmpty text="Nessuna categoria trovata" />
                )}
            </div>
        </div>
    );
}

function TransactionsSide({
    loading,
    selectedCategory,
    transactions,
    selectedCategoryId,
    setOpenCategoryMenuId,
    categories,
    searchedTransaction,
    setSearchedTransaction,
    setIsCreateTransactionModalOpen,
    selectedDay,
    setSelectedDay,
    selectedMonth,
    selectedYear,
    onTransactionCardClick,
    reloadMonthlyOverview,
}) {
    const total = Number(selectedCategory?.current_total || 0);

    const [openTransactionMenuId, setOpenTransactionMenuId] = useState(null);
    const [transactionMenuAnchor, setTransactionMenuAnchor] = useState("button");
    const [transactionContextPosition, setTransactionContextPosition] = useState({
        x: 0,
        y: 0,
    });

    return (
        <div className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:h-full">
            <HeadOfSide
                title={selectedCategory ? selectedCategory.name : "Transazioni"}
                subtitle={
                    selectedCategory
                        ? `${transactions.length} transazioni`
                        : "Transazioni della categoria"
                }
                iconCTA={Plus}
                hoverTitle="Aggiungi transazione"
                search={searchedTransaction}
                setSearch={setSearchedTransaction}
                onCTAClick={() => setIsCreateTransactionModalOpen(true)}
                valuePill={formatCurrency(total)}
            />

            <div className="min-h-0 flex-1 overflow-y-auto p-2">
                {loading ? (
                    <LoadingState />
                ) : selectedCategory ? (
                    transactions.length > 0 ? (
                        <div className="space-y-2">
                            {transactions.map((transaction) => {
                                const current = Number(transaction.current || 0);
                                const target = Number(transaction.target || 0);

                                return (
                                    <TransactionCard
                                        key={transaction.id}
                                        budget={target}
                                        current={current}
                                        transaction={transaction}
                                        categories={categories}
                                        selectedCategoryId={selectedCategoryId}
                                        setOpenCategoryMenuId={setOpenCategoryMenuId}
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
                            })}
                        </div>
                    ) : (
                        <ItemEmpty
                            text={
                                searchedTransaction
                                    ? "Nessuna transazione trovata"
                                    : "Nessuna transazione disponibile per il periodo selezionato"
                            }
                        />
                    )
                ) : (
                    <ItemEmpty text="Seleziona una categoria" />
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
                placeholder="Cerca..."
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