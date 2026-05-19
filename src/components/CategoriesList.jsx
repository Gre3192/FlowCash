import { useState, useMemo } from "react";
import { IconButton } from "../ui";
import { Plus, FolderOpen, ChevronRight, ArrowLeft } from "lucide-react";
import { EmptyState, LoadingState } from "../ui";
import SearchBar from "./SearchBar";
import ProgressBar from "./ProgressBar";
import formatCurrency from "../utils/formatCurrency";
import ContentViewState from "./ContentViewState"
import useHeroAnimation from "../hooks/useHeroAnimation";
import { motion } from "framer-motion";
import { useSearchFilter } from "../hooks/useSearchFilter";
import { div } from "framer-motion/m";
import HeroOverlay from "./HeroOverlay";
import { useEffect } from "react";

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
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <h2 className="truncate text-sm font-bold text-slate-900">
                        Categorie
                    </h2>
                    <IconButton icon={Plus} size={'md'} onClick={() => setShowCreateCategoryModal(true)} />
                </div>
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

    const hero = useHeroAnimation("category-hero");
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

            <HeroOverlay hero={hero} >
                <ExpandedCategoryCard
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


function ExpandedCategoryCard({

    category,
    onClose

}) {



    return (
        <div className={`shrink-0 border-b border-l-4  border-slate-200 `}>
            <div className="flex items-center gap-3 px-4 py-4 sm:px-6">
                <button
                    type="button"
                    onClick={onClose}
                    className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50"
                >
                    <ArrowLeft size={18} />
                </button>

                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg `}>
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
                    {/* <div className="mt-1 flex items-center gap-3 text-sm text-slate-500">
                            <span>{formatCurrency(categoryCurrentTotal)} / {formatCurrency(categoryBudgetTotal)}</span>
                            <span>{progress.toFixed(0)}%</span>
                        </div> */}
                </div>

                <button
                    type="button"
                    onClick={() => { }}
                    className={`inline-flex items-center gap-1.5 rounded-lg border  px-3 py-2 text-xs font-medium transition `}
                >
                    <Plus size={15} />
                    <span className="hidden sm:inline">Aggiungi</span>
                </button>
            </div>

            <div className="px-4 pb-3 sm:px-6">
                {/* <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200/60">
                        <div
                            className={`h-full rounded-full ${colorTheme.progressBar} transition-all duration-500`}
                            style={{ width: `${progress}%` }}
                        />
                    </div> */}
            </div>
            {/* 
                <div className="flex items-center gap-2 px-4 pb-3 sm:px-6">
                    <div className="min-w-0 flex-1">
                        <SearchBar search={transactionSearch} setSearch={setTransactionSearch} />
                    </div>
                    <HeroOverlay.WidthSelector width={hero.width} onChange={hero.changeWidth} />
                </div> */}
        </div>
    )

}