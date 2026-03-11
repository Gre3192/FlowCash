import BudgetCard from "../components/BudgetCard";
import BudgetOverview from "../components/BudgetOverview";


export default function ProjectionsPage() {




    return (
        <>
            <BudgetOverview
                current={993.79}
                total={1400}
            />
            <BudgetCard
                title="Alimentari"
                spent={300}
                limit={400}
            />
        </>
    );
}