import { useGet } from "../hooks/useGet";
import { API_ENDPOINTS } from "../api/endpoint";
import InfoBanner from "../components/InfoBanner/InfoBanner";
import getCurrentDate from "../utils/getCurrentDate";
import ModalWrapper from "../components/ModalWrapper/ModalWrapper";
import MonthNavigator from "../components/MonthNavigator/MonthNavigator";
import { useSearchFilter } from "../hooks/useSearchFilter";
import React, { useMemo, useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import CategoriesList from "../components/CategoriesList/CategoriesList";
import { Search, Plus, X, TrendingUp, TrendingDown, Scale, FolderOpen, ChevronRight, ArrowLeft } from "lucide-react";
import CreateCategoryModal from "../components/Modals/CreateCategoryModal";
import CreateTransactionModal from "../components/Modals/CreateTransactionModal";
import TransactionMovementsModal from "../components/Modals/TransactionMovementsModal";


export default function CategoriesNewBuild(params) {

    const [searchParams, setSearchParams] = useSearchParams();

    // STATE TEMPORALI
    const { currentDay, currentMonth, currentYear } = getCurrentDate();
    const [selectedDay, setSelectedDay] = useState(currentDay);
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectedYear, setSelectedYear] = useState(currentYear);

    // APERTURA MODALI
    const [showCreateCategoryModal, setShowCreateCategoryModal] = useState(false);
    const [showCreateTransactionModal, setShowCreateTransactionModal] = useState(false);
    const [showMovementsModal, setShowMovementsModal] = useState(false);

    const [categoryIdForNewTransaction, setCategoryIdForNewTransaction] = useState(null);

    useEffect(() => {
        const nextParams = new URLSearchParams();
        nextParams.set("year", String(selectedYear));
        nextParams.set("month", String(selectedMonth));
        setSearchParams(nextParams, { replace: true });
    }, [selectedYear, selectedMonth]);

    // CHIAMATE BE
    const { data, loading, error, reload: reloadMonthlyOverview, } = useGet(API_ENDPOINTS.monthlyOverview(
        {
            month: selectedMonth,
            year: selectedYear,
        }),
        {
            delayMs: 0,
        }
    );

    const categories = data?.categories ?? [];

    return (
        <div className="box-border overflow-y-auto flex min-h-0 flex-col gap-3 lg:h-full bg-slate-50 p-2 sm:p-4 lg:min-h-0 lg:overflow-hidden">

            <Header
                title={'Categorie e transazioni'}
                subtitle={'Gestisci le transazioni per categoria'}
                selectedMonth={selectedMonth}
                setSelectedMonth={setSelectedMonth}
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
                availableYears={data?.available_budget_years}
                currentYear={currentYear}
            />

            <InfoBanner text={"Errore durante il caricamento dei dati"} show={error} />

            <div className="min-h-0 flex-1 lg:overflow-hidden">
                <CategoriesList
                    categories={categories}
                    loading={loading}
                    setShowCreateCategoryModal={setShowCreateCategoryModal}
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                    reloadMonthlyOverview={reloadMonthlyOverview}
                    setCategoryIdForNewTransaction={setCategoryIdForNewTransaction}
                    setShowCreateTransactionModal={setShowCreateTransactionModal}
                />
            </div>

            {/* MODALE CREA CATEGORIA */}
            <ModalWrapper
                height="h-fit"
                isOpen={showCreateCategoryModal}
                onClose={() => setShowCreateCategoryModal(false)}
                title="Nuova categoria"
            >
                <CreateCategoryModal
                    reload={reloadMonthlyOverview}
                    onClose={() => setShowCreateCategoryModal(false)}
                />
            </ModalWrapper>

            {/* MODALE CREA TRANSAZIONE */}
            <ModalWrapper
                height="h-fit"
                isOpen={showCreateTransactionModal}
                onClose={() => setShowCreateTransactionModal(false)}
                title="Nuova transazione"
            >
                <CreateTransactionModal
                    selectedCategoryId={categoryIdForNewTransaction}
                    reload={reloadMonthlyOverview}
                    onClose={() => setShowCreateTransactionModal(false)}
                />
            </ModalWrapper>

            {/* MODALE MOVIMENTI*/}
            <ModalWrapper
                // title={selectedTransaction?.name}
                height="h-[800px]"
                width="w-[80%]"
                isOpen={showMovementsModal}
                onClose={() => setShowMovementsModal(false)}
            >
                <TransactionMovementsModal
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                    selectedDay={selectedDay}
                    // transaction={selectedTransaction}
                    onClose={() => setShowMovementsModal(false)}
                    onDayChange={setSelectedDay}
                    // availableYears={data?.available_budget_years}
                    currentYear={currentYear}
                    reloadMonthlyOverview={reloadMonthlyOverview}
                />
            </ModalWrapper>

        </div>
    )
}


function Header({
    title,
    subtitle,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    availableYears,
    currentYear

}) {
    return (
        <div className="shrink-0">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                    <h1 className="truncate text-lg font-bold text-slate-900 sm:text-xl">
                        {title}
                    </h1>
                    <p className="truncate text-xs text-slate-500">
                        {subtitle}
                    </p>
                </div>
                <div className="w-full sm:w-auto sm:min-w-85">
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
        </div>
    )
}


