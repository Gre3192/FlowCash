import { useState } from "react";
import CategoryPage from "./CategoryPage"
import TransactionPage from "./TransactionsPage"
import DATA1 from "../Data/data"

export default function BudgetPage() {

    console.log(DATA1);

    const [isCategoryPage, setIsCategoryPage] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState(null)


    function onCategoryClick(category) {
        setSelectedCategory(category)
        setIsCategoryPage(!isCategoryPage)
    }

    function backToCategoryPage(params) {
        setSelectedCategory(null)
        setIsCategoryPage(true)
    }


    return (
        <>
            {
                isCategoryPage ?
                    <CategoryPage
                        data={DATA1}
                        onCategoryClick={onCategoryClick}
                    />
                    :
                    <TransactionPage
                        data={selectedCategory}
                        backToCategoryPage={backToCategoryPage}

                    />
            }
        </>
    )
}