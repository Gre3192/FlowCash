import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MonthlyBudgetPage from './pages/MonthlyBudgetPage';
import DailyBudgetPage from './pages/DailyBudgetPage';
import Layout from './components/Layout/Layout';
import MonthBudget from './pages/Dashboard';
import TestPage from './pages/TestPage';
import ForecastsPage from './pages/ForecastsPage';
import ProjectionsPage from './pages/ProjectionsPage';
import BudgetPage from './pages/BudgetPage';
import Dashboard from './pages/Dashboard';
import TransactionsPage from './pages/TransactionsPage';

export default function AppRoute() {



    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="budget" element={<BudgetPage />} />
                    <Route path="daily" element={<DailyBudgetPage />} />
                    <Route path="transactions" element={<TransactionsPage />} />
                    <Route path="forecasts" element={<ForecastsPage />} />
                    <Route path="projections" element={<ProjectionsPage />} />
                    <Route path="test" element={<TestPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}