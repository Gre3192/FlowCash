import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MonthlyBudgetPage from './pages/MonthlyBudgetPage';
import DailyBudgetPage from './pages/DailyBudgetPage';
import Layout from './components/layout/Layout';
import MonthBudget from './pages/Dashboard';
import TestPage from './pages/TestPage';
import ForecastsPage from './pages/ForecastsPage';
import ProjectionsPage from './pages/ProjectionsPage';
import CategoryPage from './pages/CategoryPage';
import Dashboard from './pages/Dashboard';
import TransactionsPage from './pages/TransactionsPage';
import BudgetPage from './pages/BudgetPage';
import SummaryPage from './pages/SummaryPage';
import BudgetYearlyPage from './pages/BudgetYearlyPage';

export default function AppRoute() {



    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="/summaryPage" element={<SummaryPage />} />
                    <Route path="/budgetPage" element={<BudgetPage />} />
                    <Route path="/budgetYearlyPage" element={<BudgetYearlyPage />} />
                    {/* <Route path="daily" element={<DailyBudgetPage />} /> */}
                    {/* <Route path="forecasts" element={<ForecastsPage />} />
                    <Route path="projections" element={<ProjectionsPage />} /> */}
                    <Route path="test" element={<TestPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}