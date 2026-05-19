import { useGet } from "../hooks/useGet";
import { API_ENDPOINTS } from "../api/endpoint";
import getCurrentDate from "../utils/getCurrentDate";
import React, { useMemo, useState, useEffect, useRef } from "react";
import MonthNavigator from "../components/MonthNavigator";
import { Search, Plus, X, TrendingUp, TrendingDown, Scale, FolderOpen, ChevronRight, ArrowLeft } from "lucide-react";

export default function CategoriesNewBuild(params) {


    // STATE TEMPORALI
    const { currentDay, currentMonth, currentYear } = getCurrentDate();
    const [selectedDay, setSelectedDay] = useState(currentDay);
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectedYear, setSelectedYear] = useState(currentYear);

    // APERTURA MODALI
    const [showCreateCategoryModal, setShowCreateCategoryModal] = useState(false);
    const [showCreateTransactionModal, setShowCreateTransactionModal] = useState(false);
    const [showMovementsModal, setShowMovementsModal] = useState(false);

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