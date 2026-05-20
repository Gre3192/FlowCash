import { useState, useMemo } from "react";
import { Plus, FolderOpen, ChevronRight, ArrowLeft, ArrowUpRight, WalletCards, MoreVertical, Pencil, Trash2 } from "lucide-react";
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
import KindBadge from "../Badges/KindBadge/KindBadge";
import EdgeProgressBar from "../EdgeProgressBar/EdgeProgressBar";
import MoreActionsMenu from "../MoreActionMenu/MoreActionMenu"
import "./TransactionCard.scss";
import LogoBox from "../LogoBox/LogoBox";
import InfoBadge from "../Badges/InfoBadge/InfoBadge"
import AmountRatio from "../AmountRatio/AmountRatio";



export default function CategoriesList({
    categories,
    loading,
    setShowCreateCategoryModal,
}) {

    const [searchedCategories, setSearchedCategories] = useState("");
    const filteredCategories = useSearchFilter(categories, searchedCategories, ["name"]);

    return (
        <div className="flex min-h-0 flex-col rounded-xl border border-slate-200 bg-white shadow-sm lg:h-full lg:overflow-hidden">
            <CategoryListHeader
                searchedCategories={searchedCategories}
                setSearchedCategories={setSearchedCategories}
                setShowCreateCategoryModal={setShowCreateCategoryModal}
            />
            <ContentViewState
                loading={loading}
                loadingComponent={<LoadingState />}
                isEmpty={filteredCategories.length === 0}
                emptyComponent={<EmptyState text={searchedCategories ? "Nessun risultato trovato" : "Nessuna categoria disponibile"} />}
            >
                <CategoriesListBody
                    filteredCategories={filteredCategories}
                    loading={loading}
                />
            </ContentViewState>
        </div>
    )
}

function CategoryListHeader({
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

function CategoriesListBody({
    filteredCategories,
}) {

    const hero = useHeroAnimation("category-hero", "xl");
    const [selectedCategory, setSelectedCategory] = useState(null)

    useEffect(() => {
        if (!hero.isOpen) setSelectedCategory(null)
    }, [hero])

    function handleCardClick(category) {
        setSelectedCategory(category)
        hero.open(category.id)
    }

    return (
        <>
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
                            <CategoryCard category={category} onClick={() => handleCardClick(category)} />
                        </motion.div>
                    )
                })}
            </div>

            <HeroOverlay hero={hero}  >
                <ExpandedCategoryView
                    category={selectedCategory}
                    onClose={hero.close}
                />
            </HeroOverlay>
        </>
    )
}

function CategoryCard({
    category,
    onClick,
}) {

    return (
        <button
            type="button"
            onClick={onClick}
            className={`group flex w-full cursor-pointer items-center gap-3 rounded-xl border border-l-4 border-slate-200 bg-white px-3 py-3 text-left shadow-sm transition-all hover:shadow-md sm:px-4`}
        >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105`}>
                <FolderOpen size={18} />
            </div>

            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-semibold text-slate-900">
                        {category.name}
                    </span>
                    <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium `}>
                        {category.transactions.length}
                    </span>
                    <span className="ml-auto flex shrink-0 items-center gap-1 text-[11px] text-slate-500">
                        <span>{formatCurrency(category.current_total)}</span>
                        <span className="text-slate-300">/</span>
                        <span>{formatCurrency(category.budget_total)}</span>
                    </span>
                </div>

                <ProgressBar currentValue={category.current_total} totalValue={category.budget_total} />
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
    onClose
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
                            <span className={`shrink-0 rounded-full  px-2 py-0.5 text-xs font-medium `}>
                                {category.transactions.length}
                            </span>
                        </div>
                        <div className="mt-1 flex items-center gap-3 text-sm text-slate-500">
                            <span>{formatCurrency(category.current_total)} / {formatCurrency(category.budget_total)}</span>
                        </div>
                    </div>
                    <Button icon={Plus} label={'Transazione'} size={'md'} variant={"secondary"} onClick={() => { }} />
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
                            <TransactionCard transaction={transaction} />
                        )
                    })}
                </div>
            </ContentViewState>
        </>
    )

}







function TransactionCard({
    transaction,
    logo,
    onClick,
}) {

    const moreActions = [
        {
            label: "Movimenti",
            icon: Pencil,
            onClick: (transaction) => {
                onEdit?.(transaction);
            },
        },
        {
            label: "Budget",
            icon: Pencil,
            onClick: (transaction) => {
                onEdit?.(transaction);
            },
        },
        {
            label: "Elimina",
            icon: Trash2,
            variant: "danger",
            onClick: (transaction) => {
                onDelete?.(transaction);
            },
        },
    ];

    return (
        <div onClick={onClick} className="transaction-card" >

            <LogoBox src={logo} alt={transaction?.name ?? "Logo"} />

            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                    <h3 className="truncate text-sm font-semibold text-slate-900">
                        {transaction?.name ?? "Transazione"}
                    </h3>
                </div>
                <div className="mt-1 flex items-center gap-1.5">
                    <KindBadge type={transaction.type} />
                    <InfoBadge label={transaction.progress.toFixed(0) + "%"} />
                    <IconButton icon={WalletCards} size={'sm'} />
                </div>
            </div>

            <div className="hidden min-w-40 flex-col items-end sm:flex">
                <AmountRatio firstNum={formatCurrency(transaction.current)} secondNum={formatCurrency(transaction.target)}/>
                <div className="mt-1 text-xs font-semibold text-slate-500">
                    Rimanenti:{" "}
                    <span className="font-bold text-slate-900">
                        {formatCurrency(transaction.remaining)}
                    </span>
                </div>
                <EdgeProgressBar value={transaction.progress} />
            </div>

            <MoreActionsMenu
                item={transaction}
                actions={moreActions}
            />
        </div>
    );
}

