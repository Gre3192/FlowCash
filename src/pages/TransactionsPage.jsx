import BudgetCard from "../components/BudgetCard";
import BudgetOverview from "../components/BudgetOverview";
import TransactionFilters from "../components/TransactionFilters";
import MonthBanner from "../components/MonthBanner";
import { Wallet, Car, Plus, ArrowLeft } from "lucide-react";

import DATA1 from "../Data/data";

export default function TransactionPage() {

    console.log(DATA1);


    return (
        <>

            <div className="flex items-start justify-between gap-5 mb-4">
                <div className="flex items-center gap-2">
                    <ArrowLeft size={18} />
                    <div>
                        <div className="text-2xl  font-semibold text-slate-900 leading-none mb-1">
                            Transazioni
                        </div>
                        <div className="text-[16px] text-slate-500">
                            Gestisci i tuoi budget mensili
                        </div>
                    </div>
                </div>

                <div
                    type="button"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#030722] px-3 h-11 text-white text-[16px] font-medium hover:opacity-95 transition"
                >
                    <Plus size={18} />
                    Nuova transazione
                </div>
            </div>


            {/* <div className="mb-4">
                <BudgetOverview
                    current={400}
                    total={1400}
                />
            </div> */}

            <div className="mb-4">
                <MonthBanner />
            </div>


            {/* <div className="mb-4">
                <TransactionFilters
                    search=""
                    setSearch={() => { }}
                    type="all"
                    setType={() => { }}
                    category="all"
                    setCategory={() => { }}
                />
            </div> */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {
                    DATA1.categories.map((cat, i) => {
                        return (
                            <BudgetCard
                                key={i}
                                title={cat.title}
                                spent={300}
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