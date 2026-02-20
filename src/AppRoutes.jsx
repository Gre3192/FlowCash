import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MonthlyBudgetPage from './pages/MonthlyBudgetPage';
import DailyBudgetPage from './pages/DailyBudgetPage';
import Layout from './components/Layout/Layout';

export default function AppRoute() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path="daily" element={<DailyBudgetPage />} />
                    <Route path="monthly" element={<MonthlyBudgetPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}