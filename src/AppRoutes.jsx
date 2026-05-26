import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ROUTE_PAGE } from "./routes/routePage"
import Layout from './ui/layouts/Layout';
import SummaryPage from './pages/SummaryPage';
import SummaryPageCopy from './pages/SummaryPage copy';


import CategoriesTransactionsPage from "./pages/CategoriesTransactionsPage"
import BudgetPage from './pages/BudgetPage';
import TestPage from './pages/TestPage';


export default function AppRoute() {



    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path={ROUTE_PAGE.summaryPage} element={<SummaryPage />} />
                    <Route path={"/try"} element={<SummaryPageCopy />} />
                    <Route path={ROUTE_PAGE.categoriesTransactionsPage} element={<CategoriesTransactionsPage />} />
                    <Route path={ROUTE_PAGE.budgetPage} element={<BudgetPage />} />
                    <Route path={ROUTE_PAGE.testPage} element={<TestPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}