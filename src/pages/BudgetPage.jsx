import { useState } from "react";
import { useGet } from "../hooks/useGet";
import CategoryPage from "./CategoryPage"
import TransactionPage from "./TransactionsPage"

export default function BudgetPage() {

    const { data, loading } = useGet("http://localhost:3000/budget")


    const [isCategoryPage, setIsCategoryPage] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [dateSelected, setDateSelected] = useState('')


    function onCategoryClick(category) {
        setSelectedCategory(category)
        setIsCategoryPage(false)
    }

    function backToCategoryPage() {
        setSelectedCategory(null)
        setIsCategoryPage(true)
    }


    return (
        <div>
            {
                loading ?
                    <div>Loading...</div>
                    :
                    isCategoryPage ?
                        <CategoryPage
                            data={data}
                            onCategoryClick={onCategoryClick}
                            setDateSelected={setDateSelected}
                        />
                        :
                        <TransactionPage
                            data={selectedCategory}
                            backToCategoryPage={backToCategoryPage}
                            setDateSelected={setDateSelected}
                        />
            }
        </div>
    )
}