import { Plus } from 'lucide-react';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import sumArray from '../utils/sumArray';
import 'bootstrap/dist/css/bootstrap.min.css';
import CustomInput from './CustomInput';


const IncomeExpenseTable = ({

    data,
    setData,
    mode,
    activeKeys,
    setActiveKeys,
    monthsLabels,
    getTotalCategoryMonth
    
}) => {

    const makeId = (prefix = 'id') => `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;

    const updateCellValue = (categoryId, rowId, monthIndex, rawValue) => {
        const normalized = String(rawValue ?? '').replace(',', '.');
        const num = normalized === '' ? 0 : Number(normalized);

        setData((prev) =>
            prev.map((cat) => {
                if (cat.id !== categoryId) return cat;

                return {
                    ...cat,
                    rows: cat.rows.map((r) => {
                        if (r.id !== rowId) return r;

                        const nextValues = [...(r.values ?? Array(12).fill(0))];
                        nextValues[monthIndex] = Number.isFinite(num) ? num : 0;

                        return { ...r, values: nextValues };
                    }),
                };
            })
        );
    };

    const updateCategoryTitle = (categoryId, newTitle) => {
        setData(prev =>
            prev.map(cat =>
                cat.id === categoryId
                    ? { ...cat, title: newTitle }
                    : cat
            )
        );
    };

    const addRow = (categoryId, indexCat) => {

        setActiveKeys(prev => {
            const strCatId = String(indexCat);
            const arr = Array.isArray(prev) ? prev : prev ? [prev] : [];
            return arr.includes(strCatId) ? arr : [...arr, strCatId];
        });

        setData(prev =>
            prev.map(cat => {
                if (cat.id !== categoryId) return cat;

                const newRow = {
                    id: makeId("row"),
                    name: "",
                    values: Array(12).fill(0),
                };

                return {
                    ...cat,
                    rows: [...cat.rows, newRow],
                };
            })
        );
    };

    const updateRowName = (categoryId, rowId, newName) => {
        setData(prev =>
            prev.map(cat => {
                if (cat.id !== categoryId) return cat;

                return {
                    ...cat,
                    rows: cat.rows.map(row =>
                        row.id === rowId
                            ? { ...row, name: newName }
                            : row
                    )
                };
            })
        );
    };

    function getCategoryTotal(data, type, categoryIndex) {
        const category = data[categoryIndex];
        if (!category) return 0;
        if (category.type !== type) return 0;

        return category.rows.reduce((categoryTotal, row) => {
            return categoryTotal + row.values.reduce((sum, value) => sum + (Number(value) || 0), 0);
        }, 0);
    }

    function getTotalCategoryMonth(data, type, categoryIndex, valueIndex) {
        const category = data[categoryIndex];
        if (!category || category.type !== type || !category.rows?.length) return 0;

        return category.rows.reduce((sum, row) => {
            return sum + (Number(row.values?.[valueIndex]) || 0);
        }, 0);
    }

    return (
        <Accordion activeKey={activeKeys} onSelect={(keys) => setActiveKeys(keys)} alwaysOpen>
            {data?.map((category, indexCat) => {

                if (category.type !== mode) return null;

                return (
                    <Accordion.Item key={category.id} eventKey={String(indexCat)}>
                        <h2 className="accordion-header">
                            <Accordion.Button
                                className="flex align-items-center justify-between gap-2"
                                style={{
                                    background: mode === 'expense' ? '#ffe2e2' : '#CFEAD0',
                                    color: '#333',
                                }}
                            >
                                <div className="flex items-center justify-between gap-2 w-full">
                                    <input
                                        type="text"
                                        value={category.title}
                                        onChange={(e) => updateCategoryTitle(category.id, e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                        onFocus={(e) => e.target.select()}
                                        placeholder="Nuova categoria"
                                        className="w-fit fw-bold bg-transparent border-none outline-none"
                                    />
                                    <Button
                                        variant="outline"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            addRow(category.id);
                                        }}
                                    >
                                        <Plus size={18} strokeWidth={2.5} />
                                    </Button>
                                </div>
                            </Accordion.Button>
                        </h2>

                        <Accordion.Body>
                            <div className="overflow-x-auto pb-0">
                                <div className="space-y-2 pb-1 min-w-7xl">
                                    {/* HEADER */}
                                    <div
                                        className="grid gap-0 items-center border-b border-slate-100 pb-2 relative"
                                        style={{ gridTemplateColumns: '110px repeat(12, 1fr) 100px' }}
                                    >
                                        <div className="sticky left-0 z-30 bg-white h-full border-r border-transparent">
                                            <div className="bg-white h-full w-full" />
                                        </div>

                                        {monthsLabels.map((month, indexMonthLabels) => (
                                            <div
                                                key={indexMonthLabels}
                                                className="text-right font-medium text-gray-400 text-sm italic flex flex-col items-end px-2 z-10"
                                            >
                                                <div>{month.slice(0, 3)}</div>
                                                <div className="text-gray-500 font-normal whitespace-nowrap">
                                                    {getTotalCategoryMonth(data, mode, indexCat, indexMonthLabels)} €
                                                </div>
                                            </div>
                                        ))}

                                        <div className="flex flex-col items-end font-medium text-gray-500 text-sm italic px-2 z-10">
                                            <div className={mode === 'income' ? 'text-green-500' : 'text-red-500'}>
                                                All&apos;anno
                                            </div>
                                            <div className={mode === 'income' ? 'text-green-500' : 'text-red-500'}>
                                                {getCategoryTotal(data, mode, indexCat)} €
                                            </div>
                                        </div>
                                    </div>

                                    {/* RIGHE */}
                                    {category.rows.map((row) => (
                                        <div
                                            key={row.id}
                                            className="grid gap-0 items-center hover:bg-slate-50 group transition-colors"
                                            style={{ gridTemplateColumns: '110px repeat(12, 1fr) 100px' }}
                                        >
                                            <div className="sticky text-xs left-0 z-20 bg-white border-r border-slate-200 py-2.5">
                                                <input
                                                    type="text"
                                                    value={row.name}
                                                    onChange={(e) => updateRowName(category.id, row.id, e.target.value)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    onFocus={(e) => e.target.select()}
                                                    placeholder="Nuova voce"
                                                    className="font-bold text-slate-700 bg-transparent border-none outline-none w-full px-0"
                                                />
                                            </div>

                                            {row.values.map((val, idx) => (
                                                <div key={`${row.id}_${idx}`} className="px-1 z-10">
                                                    <CustomInput
                                                        mode={mode}
                                                        value={val}
                                                        onChange={(v) => updateCellValue(category.id, row.id, idx, v)}
                                                    />
                                                </div>
                                            ))}

                                            <div className="flex font-medium justify-end italic text-gray-500 text-sm px-2 z-10 h-full items-center">
                                                {sumArray(row.values)} €
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                );
            })}
        </Accordion>
    );
};

export default IncomeExpenseTable;