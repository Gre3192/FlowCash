import { useState } from "react";
import CategoryPage from "./CategoryPage"
import TransactionPage from "./TransactionsPage"
import DATA1 from "../Data/data"

export default function BudgetPage() {

    console.log(DATA1);

    const [isCategoryPage, setIsCategoryPage] = useState(true)
    const [categoryElements, setCategoryElements] = useState(null)


    function onChangePageType() {
        setIsCategoryPage(!isCategoryPage)
    }

    return (
        <>
            {
                isCategoryPage ?
                    <CategoryPage
                        data={DATA1}
                        onChangePageType={onChangePageType}
                        setCategoryElements={setCategoryElements}
                    />
                    :
                    <TransactionPage

                    />
            }
        </>
    )
}