import BudgetCard from "../components/BudgetCard";
import BudgetOverview from "../components/BudgetOverview";
import TransactionFilters from "../components/TransactionFilters";
import { Wallet, Car } from "lucide-react";

import DATA1 from "../Data/data";

export default function BudgetPage() {

    console.log(DATA1);
    

    return (
        <>
            <div className="mb-4">
                <BudgetOverview
                    current={400}
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
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                {
                    DATA1.categories.map((cat, i) => {
                        return (
                            <BudgetCard
                                key={i}
                                title={cat.title}
                                spent={43}
                                limit={400}
                                icon={Car}
                            />

                        )
                    })
                }
            </div>
        </>
    );
}