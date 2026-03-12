import BudgetCard from "../components/BudgetCard";
import BudgetOverview from "../components/BudgetOverview";


export default function TestPage() {




    return (
        <>
            <BudgetCard
                title="Alimentari"
                spent={300}
                limit={400}
                
            />
        </>
    );
}