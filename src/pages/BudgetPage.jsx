import BudgetCard from "../components/BudgetCard";
import BudgetOverview from "../components/BudgetOverview";
import TransactionFilters from "../components/TransactionFilters";
import { Wallet, Car } from "lucide-react";

export default function BudgetPage() {



    return (
        <>
            <div className="mb-4">
                <BudgetOverview
                    current={993.79}
                    total={1400}
                />
            </div>
            <div className="mb-4">
                <TransactionFilters
                    search=""
                    setSearch={() => { }}
                    type="all"
                    setType={() => { }}
                    category="all"
                    setCategory={() => { }}
                />
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-3 lg gap-4">
                <BudgetCard
                    title="Auto"
                    spent={399}
                    limit={400}
                    icon={Car}
                />
                <BudgetCard
                    title="Alimentari"
                    spent={300}
                    limit={400}
                />
                <BudgetCard
                    title="Alimentari"
                    spent={300}
                    limit={400}
                />
                <BudgetCard
                    title="Alimentari"
                    spent={300}
                    limit={400}
                />
            </div>
        </>
    );
}