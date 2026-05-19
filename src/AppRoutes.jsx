import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './ui/layouts/Layout';
import TestPage from './pages/TestPage';
import BudgetPage from './pages/BudgetPage';
import { ROUTE_PAGE } from "./routes/routePage"
import CategoriesNewBuild from "./pages/CategoriesNewBuild"

import CategoriesTransactionsPage from './pages/CategoriesTransactionsPage';

export default function AppRoute() {



    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path={ROUTE_PAGE.categoriesTransactionsPage} element={<CategoriesTransactionsPage />} />
                    <Route path={ROUTE_PAGE.categoriesNewBuild} element={<CategoriesNewBuild />} />
                    <Route path={ROUTE_PAGE.budgetPage} element={<BudgetPage />} />
                    <Route path={ROUTE_PAGE.testPage} element={<TestPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}