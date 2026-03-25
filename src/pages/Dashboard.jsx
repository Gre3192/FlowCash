import IncomeExpenseTable from "../components/IncomeExpenseMonthlyTable";
import IncomeExpenseToggle from "../components/IncomeExpenseToggle";
import BudgetMonthlyTable from "../components/BudgetMonthlyTable";
import { Button } from "react-bootstrap";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useGet } from "../hooks/useGet";

const DATA = [
    {
        id: 'cat_1',
        title: 'Abbonamenti',
        type: 'expense',
        rows: [
            // { id: 'row_1_1', name: 'ChatGPT', values: [0, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
            { id: 'row_1_2', name: 'Amazon Prime', values: [0, 1, 2, 3, 45, 78, 55, 22, 58, 22, 889, 22] },
        ],
    },
    {
        id: 'cat_2',
        title: 'Sanità',
        type: 'expense',
        rows: [
            { id: 'row_2_1', name: 'Nutrizionista', values: [0, 1, 234, 3645, 675, 78, 55, 453, 58, 22, 889, 22] },
            { id: 'row_2_2', name: 'Dottore', values: [0, 1, 23453, 3345, 45, 78, 345, 3453, 58, 345, 889, 22] },
        ],
    },
    {
        id: 'cat_3',
        title: 'Stipendio',
        type: 'income',
        rows: [
            { id: 'row_3_1', name: 'Nutrizionista', values: [0, 1, 234, 3645, 675, 78, 55, 453, 58, 22, 889, 22] },
            { id: 'row_3_2', name: 'Dottore', values: [0, 1, 23453, 3345, 45, 78, 345, 3453, 58, 345, 889, 22] },
        ],
    },
    {
        id: 'cat_4',
        title: 'Lezioni private',
        type: 'income',
        rows: [
            { id: 'row_4_1', name: 'Nutrizionista', values: [0, 3, 234, 3645, 675, 78, 55, 453, 58, 22, 889, 22] },
            { id: 'row_4_2', name: 'Dottore', values: [0, 1, 23453, 3345, 45, 78, 345, 3453, 58, 345, 889, 22] },
        ],
    },
];

const DATA1 = {

    year: 2026,
    prevEndWallet: 123,
    currentSurplusMoneyAdded: [342, 234, 678, 675, 456, 848, 397, 585, 68, 54, 987, 69],
    currentSavedMoney: [342, 4234, 25, 325, 532, 654, 234, 76, 987, 456, 34, 346],
    savedMoney: 4564,
    categories: [
        {
            id: 'cat_1',
            title: 'Abbonamenti',
            type: 'expense',
            elements: [
                { id: 'row_1_1', name: 'ChatGPT', values: [0, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
                { id: 'row_1_2', name: 'Amazon Prime', values: [0, 1, 2, 3, 45, 78, 55, 22, 58, 22, 889, 22] },
            ],
        },
        {
            id: 'cat_2',
            title: 'Sanità',
            type: 'expense',
            rows: [
                { id: 'row_2_1', name: 'Nutrizionista', values: [0, 1, 234, 3645, 675, 78, 55, 453, 58, 22, 889, 22] },
                { id: 'row_2_2', name: 'Dottore', values: [0, 1, 23453, 3345, 45, 78, 345, 3453, 58, 345, 889, 22] },
            ],
        },
        {
            id: 'cat_3',
            title: 'Stipendio',
            type: 'income',
            rows: [
                { id: 'row_3_1', name: 'Nutrizionista', values: [0, 1, 234, 3645, 675, 78, 55, 453, 58, 22, 889, 22] },
                { id: 'row_3_2', name: 'Dottore', values: [0, 1, 23453, 3345, 45, 78, 345, 3453, 58, 345, 889, 22] },
            ],
        },
        {
            id: 'cat_4',
            title: 'Lezioni private',
            type: 'income',
            rows: [
                { id: 'row_4_1', name: 'Nutrizionista', values: [0, 3, 234, 3645, 675, 78, 55, 453, 58, 22, 889, 22] },
                { id: 'row_4_2', name: 'Dottore', values: [0, 1, 23453, 3345, 45, 78, 345, 3453, 58, 345, 889, 22] },
            ],
        },
    ]
}

const monthsLabels = [
    'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre',
];



export default function Dashboard() {

    const { data: data1 } = useGet('http://localhost:3000/transaction')

    const [data, setData] = useState(data1);
    const [activeKeys, setActiveKeys] = useState(['0']);
    const [mode, setMode] = useState('expense');

    const makeId = (prefix = 'id') => `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;

    const addCategory = () => {
        const newKey = String(data.length);

        const newCategory = {
            id: makeId('cat'),
            title: '',
            type: mode,
            rows: [{ id: makeId('row'), name: '', values: Array(12).fill(0) }],
        };

        setData((prev) => [...prev, newCategory]);
        setActiveKeys((prev) => {
            const arr = Array.isArray(prev) ? prev : prev ? [prev] : [];
            return arr.includes(newKey) ? arr : [...arr, newKey];
        });
    };

    function getTotalCategoryMonth(data, type, categoryIndex, valueIndex) {
        const category = data[categoryIndex];
        if (!category || category.type !== type || !category.rows?.length) return 0;

        return category.rows.reduce((sum, row) => {
            return sum + (Number(row.values?.[valueIndex]) || 0);
        }, 0);
    }

    const expandAll = () => setActiveKeys(data.map((_, i) => String(i)));
    const collapseAll = () => setActiveKeys([]);

    const bgHeaderColor = mode === 'expense' ? 'bg-[#f8a5a5]' : mode === 'income' ? 'bg-[#7BC67B]' : 'bg-[#87CEEB]';
    const textHeaderColor = mode === 'expense' ? 'Uscite 2026' : mode === 'income' ? 'Entrate 2026' : 'Bilancio 2026'

    return (
        <div>
            <div className={`mb-4 sticky top-0 z-50 p-4 rounded-xl ${bgHeaderColor} border border-slate-200 shadow-sm`} >
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <h1 className="text-xl font-bold text-slate-800">
                        {textHeaderColor}
                    </h1>
                    <IncomeExpenseToggle mode={mode} data={data} setActiveKeys={setActiveKeys} setMode={setMode} />
                </div>
                <div className="gap-2 mt-0 flex-wrap hidden">
                    <Button variant="primary" size="sm" onClick={expandAll}>
                        Espandi tutto
                    </Button>
                    <Button variant="primary" size="sm" onClick={collapseAll}>
                        Collassa tutto
                    </Button>
                    <Button
                        variant="primary"
                        onClick={addCategory}
                        size="sm"
                        className="d-flex align-items-center gap-2 px-3 shadow-sm ms-auto"
                    >
                        <Plus size={18} />
                        Aggiungi categoria
                    </Button>
                </div>
            </div>
            {
                mode === 'budget' ?
                    <BudgetMonthlyTable
                        data={data}
                        monthsLabels={monthsLabels}
                    />
                    :
                    <IncomeExpenseTable
                        monthsLabels={monthsLabels}
                        data={data}
                        setData={setData}
                        mode={mode}
                        activeKeys={activeKeys}
                        setActiveKeys={setActiveKeys}
                        getTotalCategoryMonth={getTotalCategoryMonth}

                    />
            }
        </div>
    )
}

