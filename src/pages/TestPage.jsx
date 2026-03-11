import BudgetCard from "../components/BudgetCard";

export default function TestPage() {




    return (
        <>
            <BudgetCard
                title="Alimentari"
                spent={200}
                limit={400}
                
            />
        </>
    );
}