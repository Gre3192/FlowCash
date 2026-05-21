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
import InfoBadge from "../Badges/InfoBadge/InfoBadge";
import MoreActionsMenu from "../MoreActionMenu/MoreActionMenu";
import AmountRatio from "../AmountRatio/AmountRatio";
import TransactionCard from "../TransactionCard/TransactionCard";
import { useDelete } from "../../hooks/useDelete";
import { API_ENDPOINTS } from "../../api/endpoint";
import ToggleButtonGroup from "../../ui/ToggleButtonGroup";
import LogoBox from "../LogoBox/LogoBox";
import SectionsDivider from "../SectionsDivider/SectionsDivider";
import getMonthByNum from "../../utils/getMonthByNum";

const OPENED_HERO_VIEW_KEY = "flowcash_openedHeroView";

export default function CategoriesList({
    categories,
    loading,
    setShowCreateCategoryModal,
    selectedMonth,
    selectedYear,
    reloadMonthlyOverview,
    setCategoryIdForNewTransaction,
    setShowCreateTransactionModal,
    setTransactionForNewMovement,
    setShowMovementsModal
}) {

    const [searchedCategories, setSearchedCategories] = useState("");

    const filteredCategories = useSearchFilter(categories, searchedCategories, ["name"]);

    // const filteredCategories = useMemo(() => {
    //     return searchedFilteredCategories.filter((category) => {
    //         const matchesType =
    //             (typeFilter === "all") ||
    //             (typeFilter === "active" && category.has_transactions && Number(category.budget_total) != 0) ||
    //             (typeFilter === "inactive" && category.has_transactions && Number(category.budget_total) === 0) ||
    //             (typeFilter === "empty" && !category.has_transactions);
    //         return matchesType;
    //     });
    // }, [searchedFilteredCategories, typeFilter]);


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
                setTransactionForNewMovement={setTransactionForNewMovement}
                setShowMovementsModal={setShowMovementsModal}
            />
        </div>
    )
}

function CategoriesListHeader({
    searchedCategories,
    setSearchedCategories,
    setShowCreateCategoryModal,
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
                    <SearchBar search={searchedCategories} setSearch={setSearchedCategories} placeholder={"Cerca categoria..."} />
                </div>
            </div>
        </div>
    )
}

function CategoriesListBody({
    filteredCategories,
    selectedMonth,
    selectedYear,
    reloadMonthlyOverview,
    loading,
    searchedCategories,
    setCategoryIdForNewTransaction,
    setShowCreateTransactionModal,
    setTransactionForNewMovement,
    setShowMovementsModal,
}) {

    const [openSections, setOpenSections] = useState({
        budgeted: true,
        toPlan: false,
        empty: false,
    });

    const hero = useHeroAnimation("category-hero", "xl");

    // Crea una nuova struttura delle categorie separando tra pianificate, non pianificate e vuote
    const categorizedCategories = useMemo(() => {
        return filteredCategories.reduce(
            (acc, category) => {

                if (!Boolean(category.has_transactions)) {
                    acc.empty.push(category);
                    return acc;
                }

                if (Number(category.budget_total || 0) === 0) {
                    acc.toPlan.push(category);
                    return acc;
                }

                acc.budgeted.push(category);
                return acc;
            },
            {
                budgeted: [],
                toPlan: [],
                empty: [],
            }
        );
    }, [filteredCategories]);

    // Salva la categoria cliccata
    const selectedCategory = useMemo(() => {
        if (!hero.selectedId) return null;
        return filteredCategories.find((category) => category.id === hero.selectedId);
    }, [filteredCategories, hero.selectedId]);

    // Apre gli accordion in cui sono presenti le categorie cercate
    useEffect(() => {
        const hasSearch = searchedCategories.trim().length > 0;
        if (!hasSearch) return;
        setOpenSections({
            budgeted: categorizedCategories.budgeted.length > 0,
            toPlan: categorizedCategories.toPlan.length > 0,
            empty: categorizedCategories.empty.length > 0,
        });
    }, [
        searchedCategories,
        categorizedCategories.budgeted.length,
        categorizedCategories.toPlan.length,
        categorizedCategories.empty.length,
    ]);

    // Apre la heroView salvando l'id della categoria aperta in sessionStorage
    useEffect(() => {
        const storedCategoryId = sessionStorage.getItem(OPENED_HERO_VIEW_KEY);

        if (!storedCategoryId) return;
        if (hero.isOpen) return;

        const categoryExists = filteredCategories.some(
            (category) => category.id === storedCategoryId
        );

        if (!categoryExists) return;

        setCategoryIdForNewTransaction?.(storedCategoryId);
        hero.open(storedCategoryId);
    }, [filteredCategories, hero.isOpen, setCategoryIdForNewTransaction]);

    // Apre l'accordion cliccato
    function toggleSection(sectionKey) {
        if (searchedCategories.trim().length > 0) return
        setOpenSections((prev) => ({ ...prev, [sectionKey]: !prev[sectionKey], }));
    }

    // Apre la heroView
    function handleOpenHero(category) {
        sessionStorage.setItem(OPENED_HERO_VIEW_KEY, category.id);
        setCategoryIdForNewTransaction?.(category.id);
        hero.open(category.id);
    }

    // Chiude la heroView
    function handleCloseHero() {
        sessionStorage.removeItem(OPENED_HERO_VIEW_KEY);
        setCategoryIdForNewTransaction?.(null);
        hero.close();
    }

    // Renderizza categoria
    function renderCategory(category) {

        if (hero.selectedId === category.id) {
            return (
                <div key={category.id} className="h-16 rounded-xl bg-slate-100/50" />
            );
        }

        return (
            <motion.div
                key={category.id}
                layoutId={hero.getLayoutId(category.id)}
                className="px-5"
            >
                <CategoryCard
                    category={category}
                    onClick={() => handleOpenHero(category)}
                    reloadMonthlyOverview={reloadMonthlyOverview}
                />
            </motion.div>
        );
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

                    {/* Categorie pianificate */}
                    <SectionsDivider
                        label={`Categorie pianificate per ${getMonthByNum(selectedMonth)} ${selectedYear}`}
                        numItems={categorizedCategories.budgeted.length}
                        show={openSections.budgeted}
                        onClick={() => toggleSection("budgeted")}
                    >
                        <ContentViewState
                            isEmpty={categorizedCategories.budgeted.length === 0}
                            emptyComponent={<EmptyState text={`Nessuna categoria pianificata per ${getMonthByNum(selectedMonth)} ${selectedYear}`} />}
                            autoScroll={true}
                        >
                            <div className="space-y-3">
                                {categorizedCategories.budgeted.map(renderCategory)}
                            </div>
                        </ContentViewState>
                    </SectionsDivider>

                    {/* Categorie non pianificate */}
                    <SectionsDivider
                        label={`Categorie non pianificate per ${getMonthByNum(selectedMonth)} ${selectedYear}`}
                        numItems={categorizedCategories.toPlan.length}
                        show={openSections.toPlan}
                        onClick={() => toggleSection("toPlan")}
                    >
                        <ContentViewState
                            isEmpty={categorizedCategories.toPlan.length === 0}
                            emptyComponent={<EmptyState text={`Nessuna categoria non pianificata per ${getMonthByNum(selectedMonth)} ${selectedYear}`} />}
                            autoScroll={true}
                        >
                            <div className="space-y-3">
                                {categorizedCategories.toPlan.map(renderCategory)}
                            </div>
                        </ContentViewState>
                    </SectionsDivider>

                    {/* Categorie vuote */}
                    <SectionsDivider
                        label="Categorie senza transazioni"
                        numItems={categorizedCategories.empty.length}
                        show={openSections.empty}
                        onClick={() => toggleSection("empty")}
                    >
                        <ContentViewState
                            isEmpty={categorizedCategories.empty.length === 0}
                            emptyComponent={<EmptyState text={"Nessuna categoria senza transazioni"} />}
                            autoScroll={true}
                        >
                            <div className="space-y-3">
                                {categorizedCategories.empty.map(renderCategory)}
                            </div>
                        </ContentViewState>
                    </SectionsDivider>

                </div>
            </ContentViewState>

            <HeroOverlay hero={hero} onClose={handleCloseHero}>
                {selectedCategory && (
                    <ExpandedCategoryView
                        category={selectedCategory}
                        onClose={handleCloseHero}
                        selectedMonth={selectedMonth}
                        selectedYear={selectedYear}
                        reloadMonthlyOverview={reloadMonthlyOverview}
                        setShowCreateTransactionModal={setShowCreateTransactionModal}
                        setTransactionForNewMovement={setTransactionForNewMovement}
                        setShowMovementsModal={setShowMovementsModal}
                    />
                )}
            </HeroOverlay>
        </>
    );
}

function CategoryCard({
    category,
    onClick,
    reloadMonthlyOverview
}) {

    const { deleteData } = useDelete()

    async function handleDeleteCategory(category) {
        if (!category?.id) return;
        try {
            await deleteData(API_ENDPOINTS.categories({}, category.id));
            reloadMonthlyOverview?.();
        } catch (error) {
            if (error.name !== "AbortError") {
                console.error("Errore durante l'eliminazione della categoria:", error);
            }
        }
    }

    const moreActions = [
        {
            label: "Modifica",
            icon: Pencil,
            onClick: (category) => {
                console.log("Modifica categoria", category);
            },
        },
        {
            label: "Elimina",
            icon: Trash2,
            variant: "danger",
            onClick: (category) => { handleDeleteCategory(category) },
        },
    ];

    return (
        <div
            type="button"
            onClick={onClick}
            className={`group flex w-full cursor-pointer items-center gap-3 rounded-xl border border-l-4 border-slate-200 bg-white px-3 py-3 text-left shadow-sm transition-all hover:shadow-md sm:px-4`}
        >
            <LogoBox icon={FolderOpen} />
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
    setShowCreateTransactionModal,
    setTransactionForNewMovement,
    setShowMovementsModal
}) {

    const transactions = category?.transactions ?? [];

    const [typeFilter, setTypeFilter] = useState("all");
    const [searchedTransactions, setSearchedTransactions] = useState("");
    const [openSections, setOpenSections] = useState({
        budgeted: true,
        toPlan: false,
        empty: false,
    });

    const filteredTransactions = useSearchFilter(transactions, searchedTransactions, ["name"]);

    console.log(transactions);


    const categorizedTransactions = useMemo(() => {
        return filteredTransactions.reduce(
            (acc, transaction) => {

                if (Boolean(transaction.needs_budget)) {
                    acc.empty.push(transaction);
                    return acc;
                }

                if (Number(transaction.target || 0) === 0) {
                    acc.toPlan.push(transaction);
                    return acc;
                }

                acc.budgeted.push(transaction);
                return acc;
            },
            {
                budgeted: [],
                toPlan: [],
                empty: [],
            }
        );
    }, [filteredTransactions]);


    useEffect(() => {
        const hasSearch = searchedTransactions.trim().length > 0;
        if (!hasSearch) return;
        setOpenSections({
            budgeted: categorizedTransactions.budgeted.length > 0,
            toPlan: categorizedTransactions.toPlan.length > 0,
            empty: categorizedTransactions.empty.length > 0,
        });
    }, [
        searchedTransactions,
        categorizedTransactions.budgeted.length,
        categorizedTransactions.toPlan.length,
        categorizedTransactions.empty.length,
    ]);

    function handleCardClick(transaction) {
        if (transaction.needs_budget) return
        setTransactionForNewMovement(transaction)
        setShowMovementsModal(true)
    }

    // Apre l'accordion cliccato
    function toggleSection(sectionKey) {
        if (searchedTransactions.trim().length > 0) return
        setOpenSections((prev) => ({
            ...prev,
            [sectionKey]: !prev[sectionKey],
        }));
    }

    function renderTransaction(transaction) {

        return (
            <TransactionCard
                transaction={transaction}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                reloadMonthlyOverview={reloadMonthlyOverview}
                onClick={() => handleCardClick(transaction)}
            />
        );
    }

    const filterOptions = [
        {
            label: "Tutte",
            value: "all",
            icon: null,
        },
        {
            label: "Entrate",
            value: "Income",
            icon: null,
        },
        {
            label: "Uscite",
            value: "Expense",
            icon: ArrowUpRight,
        },
    ];

    return (
        <>

            {/* HEADER */}
            <div className={`shrink-0 border-b border-slate-200 `}>
                <div className="flex items-center gap-3 px-4 py-4 sm:px-6">
                    <IconButton icon={ArrowLeft} size={'md'} onClick={onClose} />
                    <LogoBox icon={FolderOpen} />
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                            <h2 className="truncate text-base font-bold text-slate-900 sm:text-lg">
                                {category?.name}
                            </h2>
                            <InfoBadge label={category?.transactions.length} size="sm" />
                        </div>
                        <AmountRatio firstNum={formatCurrency(category?.current_total)} secondNum={formatCurrency(category?.budget_total)} />
                    </div>
                    <Button icon={Plus} label={'Transazione'} size={'sm'} variant={"secondary"} onClick={() => setShowCreateTransactionModal(true)} />
                </div>
                <div className="px-4 pb-3 sm:px-6">
                    <ProgressBar currentValue={category?.current_total} totalValue={category?.budget_total} size="lg" />
                </div>
                <div className="min-w-0 flex-1 px-4 pb-3 sm:px-6 flex items-center justify-between">
                    <SearchBar search={searchedTransactions} setSearch={setSearchedTransactions} placeholder={"Cerca transazione..."} />
                    <ToggleButtonGroup
                        options={filterOptions}
                        value={typeFilter}
                        onChange={setTypeFilter}
                    />
                </div>

            </div>

            {/* BODY */}
            <ContentViewState
                isEmpty={filteredTransactions.length === 0}
                emptyComponent={<EmptyState text={searchedTransactions ? "Nessun risultato trovato" : "Nessuna transazione disponibile"} />}
            >
                <div className="space-y-2">

                    {/* Transazioni pianificate */}
                    <SectionsDivider
                        label={`Transazioni pianificate per ${getMonthByNum(selectedMonth)} ${selectedYear}`}
                        numItems={categorizedTransactions.budgeted.length}
                        show={openSections.budgeted}
                        onClick={() => toggleSection("budgeted")}
                    >
                        <ContentViewState
                            isEmpty={categorizedTransactions.budgeted.length === 0}
                            emptyComponent={<EmptyState text={`Nessuna transazione pianificata per ${getMonthByNum(selectedMonth)} ${selectedYear}`} />}
                            autoScroll={true}
                        >
                            <div className="space-y-3">
                                {categorizedTransactions.budgeted.map(renderTransaction)}
                            </div>
                        </ContentViewState>
                    </SectionsDivider>

                    {/* Transazioni non pianificate */}
                    <SectionsDivider
                        label={`Transazioni pianificate per ${getMonthByNum(selectedMonth)} ${selectedYear}`}
                        numItems={categorizedTransactions.toPlan.length}
                        show={openSections.toPlan}
                        onClick={() => toggleSection("toPlan")}
                    >
                        <ContentViewState
                            isEmpty={categorizedTransactions.toPlan.length === 0}
                            emptyComponent={<EmptyState text={`Nessuna transazione non pianificata per ${getMonthByNum(selectedMonth)} ${selectedYear}`} />}
                            autoScroll={true}
                        >
                            <div className="space-y-3">
                                {categorizedTransactions.toPlan.map(renderTransaction)}
                            </div>
                        </ContentViewState>
                    </SectionsDivider>

                    {/* Transazioni vuote */}
                    <SectionsDivider
                        label={`Transazioni non pianificate`}
                        numItems={categorizedTransactions.empty.length}
                        show={openSections.empty}
                        onClick={() => toggleSection("empty")}
                    >
                        <ContentViewState
                            isEmpty={categorizedTransactions.empty.length === 0}
                            emptyComponent={<EmptyState text={`Nessuna transazione non pianificata`} />}
                            autoScroll={true}
                        >
                            <div className="space-y-3">
                                {categorizedTransactions.empty.map(renderTransaction)}
                            </div>
                        </ContentViewState>
                    </SectionsDivider>


                </div>
            </ContentViewState>
        </>
    )

}






