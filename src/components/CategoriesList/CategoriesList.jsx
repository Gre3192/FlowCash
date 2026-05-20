import { useState, useMemo } from "react";
import { Plus, FolderOpen, ChevronRight, ArrowLeft, ArrowUpRight, WalletCards, MoreVertical, ListChecks, Pencil, Trash2 } from "lucide-react";
import { EmptyState, LoadingState, IconButton, Button } from "../../ui";
import SearchBar from "../SearchBar/SearchBar";
import ProgressBar from "../ProgressBar/ProgressBar";
import formatCurrency from "../../utils/formatCurrency";
import ContentViewState from "../ContentViewState/ContentViewState"
import useHeroAnimation from "../../hooks/useHeroAnimation";
import { motion } from "framer-motion";
import { useSearchFilter } from "../../hooks/useSearchFilter";
import { div } from "framer-motion/m";
import HeroOverlay from "../HeroOverlay/HeroOverlay";
import { useEffect } from "react";
import TransactionCard from "../TransactionCard1/TransactionCard1";
import InfoBadge from "../Badges/InfoBadge/InfoBadge";
import MoreActionsMenu from "../MoreActionMenu/MoreActionMenu";
import AmountRatio from "../AmountRatio/AmountRatio";


export default function CategoriesList({
    categories,
    loading,
    setShowCreateCategoryModal,
    selectedMonth,
    selectedYear,
    reloadMonthlyOverview,
    setCategoryIdForNewTransaction,
    setShowCreateTransactionModal
}) {

    const [searchedCategories, setSearchedCategories] = useState("");
    const filteredCategories = useSearchFilter(categories, searchedCategories, ["name"]);

    return (
        <div className="flex min-h-0 flex-col rounded-xl border border-slate-200 bg-white shadow-sm lg:h-full lg:overflow-hidden">
            <CategoriesListHeader
                searchedCategories={searchedCategories}
                setSearchedCategories={setSearchedCategories}
                setShowCreateCategoryModal={setShowCreateCategoryModal}
            />
            <CategoriesListBody
                filteredCategories={filteredCategories}
                loading={loading}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                reloadMonthlyOverview={reloadMonthlyOverview}
                loading={loading}
                searchedCategories={searchedCategories}
                setCategoryIdForNewTransaction={setCategoryIdForNewTransaction}
                setShowCreateTransactionModal={setShowCreateTransactionModal}
            />
        </div>
    )
}

function CategoriesListHeader({
    searchedCategories,
    setSearchedCategories,
    setShowCreateCategoryModal
}) {
    return (
        <div className="flex shrink-0 flex-col gap-3 border-b border-slate-200 p-3 sm:p-4">
            <div className="flex justify-between items-center gap-2">
                <h2 className="truncate text-lg font-bold text-slate-900">
                    Categorie
                </h2>
                <Button icon={Plus} label={'Categoria'} variant={"secondary"} onClick={() => setShowCreateCategoryModal(true)} size={'sm'} />
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                    <SearchBar search={searchedCategories} setSearch={setSearchedCategories} />
                </div>

                {/* <div className="flex items-center gap-2">
                    <TypeToggle value={typeFilter} onChange={setTypeFilter} />
                    <StatusSelect value={statusFilter} onChange={setStatusFilter} />
                </div> */}
            </div>
        </div>
    )
}

const OPENED_HERO_KEY = "flowcash_openedHero";
function CategoriesListBody({
    filteredCategories,
    selectedMonth,
    selectedYear,
    reloadMonthlyOverview,
    loading,
    searchedCategories,
    setCategoryIdForNewTransaction,
    setShowCreateTransactionModal
}) {

    const hero = useHeroAnimation("category-hero", "xl");

    const selectedCategory = useMemo(() => {
        if (!hero.selectedId) return null;

        return filteredCategories.find(
            (category) => category.id === hero.selectedId
        );
    }, [filteredCategories, hero.selectedId]);

    useEffect(() => {
        const storedCategoryId = sessionStorage.getItem(OPENED_HERO_KEY);
        if (!storedCategoryId) return;
        if (hero.isOpen) return;
        const categoryExists = filteredCategories.some(
            (category) => category.id === storedCategoryId
        );
        if (!categoryExists) return;
        hero.open(storedCategoryId);
    }, [filteredCategories, hero]);

    function handleOpenHero(category) {
        sessionStorage.setItem(OPENED_HERO_KEY, category.id);
        setCategoryIdForNewTransaction(category.id);
        hero.open(category.id);
    }

    function handleCloseHero() {
        sessionStorage.removeItem(OPENED_HERO_KEY);
        setCategoryIdForNewTransaction(null);
        hero.close();
    }

    return (
        <>
            <ContentViewState
                loading={loading}
                loadingComponent={<LoadingState />}
                isEmpty={filteredCategories.length === 0}
                emptyComponent={<EmptyState text={searchedCategories ? "Nessun risultato trovato" : "Nessuna categoria disponibile"} />}
            >
                <div className="space-y-4">
                    {filteredCategories.map((category, i) => {

                        if (hero.selectedId === category.id) {
                            return <div key={category.id} className="h-16 rounded-xl bg-slate-100/50" />;
                        }

                        return (
                            <motion.div
                                key={category.id}
                                layoutId={hero.getLayoutId(category.id)}
                            >
                                <CategoryCard category={category} onClick={() => handleOpenHero(category)} />
                            </motion.div>
                        )
                    })}
                </div>
            </ContentViewState>
            <HeroOverlay hero={hero} onClose={handleCloseHero}>
                <ExpandedCategoryView
                    category={selectedCategory}
                    onClose={handleCloseHero}
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                    reloadMonthlyOverview={reloadMonthlyOverview}
                    setShowCreateTransactionModal={setShowCreateTransactionModal}
                />
            </HeroOverlay>
        </>
    )
}

function CategoryCard({
    category,
    onClick,
}) {

    const moreActions = [
        {
            label: "Modifica",
            icon: Pencil,
            onClick: (category) => { },
        },
        {
            label: "Elimina",
            icon: Trash2,
            variant: "danger",
            onClick: (category) => { },
        },
    ];

    return (
        <div
            type="button"
            onClick={onClick}
            className={`group flex w-full cursor-pointer items-center gap-3 rounded-xl border border-l-4 border-slate-200 bg-white px-3 py-3 text-left shadow-sm transition-all hover:shadow-md sm:px-4`}
        >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105`}>
                <FolderOpen size={18} />
            </div>

            <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                    <div className="flex items-center  gap-2">
                        <span className="truncate text-sm font-semibold text-slate-900">
                            {category.name}
                        </span>
                        <InfoBadge label={category.transactions.length} />
                    </div>
                    <AmountRatio firstNum={formatCurrency(category.current_total)} secondNum={formatCurrency(category.budget_total)} />
                </div>

                <ProgressBar currentValue={category.current_total} totalValue={category.budget_total} />
            </div>
            {/* <ChevronRight
                size={18}
                className="shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-500"
            /> */}

            <MoreActionsMenu
                item={category}
                actions={moreActions}
            />
        </div>
    );
}

function ExpandedCategoryView({
    category,
    onClose,
    selectedMonth,
    selectedYear,
    reloadMonthlyOverview,
    setShowCreateTransactionModal
}) {

    const transactions = category?.transactions ?? [];

    const [searchedTransactions, setSearchedTransactions] = useState("");
    const filteredTransactions = useSearchFilter(transactions, searchedTransactions, ["name"]);

    return (
        <>

            {/* HEADER */}
            <div className={`shrink-0 border-b border-slate-200 `}>
                <div className="flex items-center gap-3 px-4 py-4 sm:px-6">
                    <IconButton icon={ArrowLeft} size={'md'} onClick={onClose} />
                    <div className={`flex h-10 w-10 bg-slate-100 shrink-0 items-center justify-center rounded-lg `}>
                        <FolderOpen size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                            <h2 className="truncate text-base font-bold text-slate-900 sm:text-lg">
                                {category.name}
                            </h2>
                            <InfoBadge label={category.transactions.length} size="sm" />
                        </div>
                        <AmountRatio firstNum={formatCurrency(category.current_total)} secondNum={formatCurrency(category.budget_total)} />
                    </div>
                    <Button icon={Plus} label={'Transazione'} size={'md'} variant={"secondary"} onClick={() => setShowCreateTransactionModal(true)} />
                </div>
                <div className="px-4 pb-3 sm:px-6">
                    <ProgressBar currentValue={category.current_total} totalValue={category.budget_total} size="lg" />
                </div>
                <div className="min-w-0 flex-1 px-4 pb-3 sm:px-6">
                    <SearchBar search={searchedTransactions} setSearch={setSearchedTransactions} />
                </div>
            </div>

            {/* BODY */}
            <ContentViewState
                isEmpty={filteredTransactions.length === 0}
                emptyComponent={<EmptyState text={searchedTransactions ? "Nessun risultato trovato" : "Nessuna categoria disponibile"} />}
            >
                <div className="space-y-2">
                    {filteredTransactions.map((transaction, i) => {

                        return (
                            <TransactionCard
                                transaction={transaction}
                                selectedMonth={selectedMonth}
                                selectedYear={selectedYear}
                                reloadMonthlyOverview={reloadMonthlyOverview}
                            />
                        )
                    })}
                </div>
            </ContentViewState>
        </>
    )

}





