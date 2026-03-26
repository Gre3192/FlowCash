import BudgetCard from "../components/BudgetCard";
import BudgetOverview from "../components/BudgetOverview";
import TransactionFilters from "../components/TransactionFilters";
import MonthBanner from "../components/MonthBanner";
import { Wallet, Car, Plus } from "lucide-react";


export default function CategoryPage({

    data,
    onCategoryClick,
    setSelectedDate,
    selectedDate

}) {


    console.log(data)


    return (
        <>
            <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                    <div className="text-3xl font-semibold text-slate-900 leading-none mb-2">
                        Categorie
                    </div>
                    <p className="text-[16px] text-slate-500">
                        Gestisci i tuoi budget mensili
                    </p>
                </div>

                <div
                    type="button"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#030722] px-3 h-11 text-white text-[16px] font-medium hover:opacity-95 transition"
                >
                    <Plus size={18} />
                    Nuova categoria
                </div>
            </div>

            <div className="mb-4">
                <MonthBanner
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {
                    data?.categories.map((cat, i) => {

                        console.log(cat);


                        return (
                            <BudgetCard
                                key={i}
                                title={cat.title}
                                spent={300}
                                limit={400}
                                icon={Car}
                                isCategoryShape={true}
                                onCategoryClick={() => onCategoryClick(cat)}
                            />

                        )
                    })
                }
            </div>
        </>
    );
}