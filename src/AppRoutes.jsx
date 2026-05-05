import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './ui/layouts/Layout';
import TestPage from './pages/TestPage';
import BudgetYearlyPage from './pages/BudgetYearlyPage';

import CategoriesTransactionsPage from './pages/CategoriesTransactionsPage';

export default function AppRoute() {



    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="/" element={<CategoriesTransactionsPage />} />
                    <Route path="/budgetYearlyPage" element={<BudgetYearlyPage />} />
                    <Route path="test" element={<TestPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}