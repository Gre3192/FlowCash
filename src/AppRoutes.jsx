import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MonthlyBudgetPage from './pages/MonthlyBudgetPage';
import DailyBudgetPage from './pages/DailyBudgetPage';


export default function AppRoute() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/daily" element={<DailyBudgetPage />} />
                <Route path="/monthly" element={<MonthlyBudgetPage />} />
            </Routes>
        </BrowserRouter>
    )
}