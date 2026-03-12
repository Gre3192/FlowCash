import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MonthlyBudgetPage from './pages/MonthlyBudgetPage';
import DailyBudgetPage from './pages/DailyBudgetPage';
import Layout from './components/Layout/Layout';
import MonthBudget from './pages/MonthBudget';

export default function AppRoute() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="/" element={<MonthBudget />} />
                    <Route path="daily" element={<DailyBudgetPage />} />
                    <Route path="monthly" element={<MonthlyBudgetPage />} />
                    <Route path="monthly" element={<MonthlyBudgetPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}