import React, { useState, useMemo, useEffect } from 'react';
import { Plus, ChevronDown, Trash2, Expand, Shrink } from 'lucide-react';
import Accordion from 'react-bootstrap/Accordion';
import Button from "react-bootstrap/Button";
import sumArray from '../utils/sumArray';
import 'bootstrap/dist/css/bootstrap.min.css';



const CustomInput = ({ value, onChange }) => {

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') e.target.blur();
        // Blocca caratteri non numerici comuni negli input type="number"
        if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault();
    };

    return (
        <div className="relative  border-slate-200 flex items-center group/input bg-white focus-within:ring-1 focus-within:ring-red-500/20 transition-all">
            <style>{`
                input::-webkit-outer-spin-button,
                input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
                input[type=number] { -moz-appearance: textfield; }
            `}</style>
            
            <input
                type="number"
                step="0.01"
                lang="it-IT"
                value={value === 0 || value === undefined ? '' : value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent text-right outline-none 
                           px-1.5 py-1 pr-4 text-sm text-gray-700 font-medium
                           placeholder:text-gray-300 transition-colors"
                placeholder="0,00"
            />
            
            <span className="absolute right-1.5 top-1/2 -translate-y-1/2 
                             text-[10px] text-gray-400 font-bold pointer-events-none 
                             group-focus-within/input:text-red-500 transition-colors">
                €
            </span>
        </div>
    );
};

const monthsLabels = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];

const DATA = [
    {
        id: "cat_1",
        title: "Abbonamenti",
        type: 'expenditure',
        rows: [
            { id: "row_1_1", name: "ChatGPT", values: [0, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
            { id: "row_1_2", name: "Amazon Prime", values: [0, 1, 2, 3, 45, 78, 55, 22, 58, 22, 889, 22] }
        ]
    },
    {
        id: "cat_2",
        title: "Sanità",
        type: 'expenditure',
        rows: [
            { id: "row_2_1", name: "Nutrizionista", values: [0, 1, 234, 3645, 675, 78, 55, 453, 58, 22, 889, 22] },
            { id: "row_2_2", name: "Dottore", values: [0, 1, 23453, 3345, 45, 78, 345, 3453, 58, 345, 889, 22] }
        ]
    },
    {
        id: "cat_3",
        title: "Stipendio",
        type: 'income',
        rows: [
            { id: "row_3_1", name: "Nutrizionista", values: [0, 1, 234, 3645, 675, 78, 55, 453, 58, 22, 889, 22] },
            { id: "row_3_2", name: "Dottore", values: [0, 1, 23453, 3345, 45, 78, 345, 3453, 58, 345, 889, 22] }
        ]
    },
    {
        id: "cat_4",
        title: "Lezioni private",
        type: 'income',
        rows: [
            { id: "row_4_1", name: "Nutrizionista", values: [0, 3, 234, 3645, 675, 78, 55, 453, 58, 22, 889, 22] },
            { id: "row_4_2", name: "Dottore", values: [0, 1, 23453, 3345, 45, 78, 345, 3453, 58, 345, 889, 22] }
        ]
    },
]



const BudgetTable = () => {

    const [data, setdata] = useState(DATA);
    const [activeKeys, setActiveKeys] = useState(["0"]);
    const [mode, setMode] = useState("expenditure");

    const expandAll = () => {
        const allKeys = data.map((_, i) => String(i));
        setActiveKeys(allKeys);
    };

    const collapseAll = () => {
        setActiveKeys([]);
    };

    const makeId = (prefix = "id") => `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;

    const addCategory = () => {
        const newKey = String(data.length); // indice della nuova categoria

        const newCategory = {
            id: makeId("cat"),
            title: "Nuova categoria",
            type: mode,
            rows: [
                {
                    id: makeId("row"),
                    name: "Voce 1",
                    values: Array(12).fill(0),
                },
            ],
        };

        setdata((prev) => [...prev, newCategory]);

        setActiveKeys((prev) => {
            const arr = Array.isArray(prev) ? prev : prev ? [prev] : [];
            return arr.includes(newKey) ? arr : [...arr, newKey];
        });
    };

    const editCategory = () => {

    }

    const deleteCategory = () => {

    }

    const addRow = () => {

    }

    const aditRow = () => {

    }

    const deleteRow = () => {

    }

    function getTotalYear(data, type) {
        return data
            .filter(c => c.type === mode)
            .flatMap(c => c.rows)
            .flatMap(r => r.values)
            .reduce((sum, v) => sum + v, 0);
    }

    function getTotalMonth(data, type, index) {
        return data
            .filter(c => c.type === type)
            .flatMap(c => c.rows)
            .reduce((sum, row) => sum + (row.values[index] ?? 0), 0);
    }

    function getCategoryTotal(data, type, categoryIndex) {
        const category = data[categoryIndex];

        if (!category) return 0;
        if (category.type !== type) return 0;

        return category.rows.reduce((categoryTotal, row) => {
            return categoryTotal + row.values.reduce((sum, value) => sum + value, 0);
        }, 0);
    }

    function getTotalCategoryMonth(data, type, categoryIndex, valueIndex) {

        const category = data[categoryIndex];
        if (!category || !category.rows?.length) return 0;

        return category.rows.reduce((sum, row) => {
            return sum + (Number(row.values?.[valueIndex]) || 0);
        }, 0);
    };

    return (
        <div className="p-3">


            <div className={`mb-4 p-4 rounded-xl ${mode === "expenditure" ? "bg-[#f8a5a5]" : "bg-[#a5f8c7]"} border border-slate-200 shadow-sm`}>

                <div className="flex items-center justify-between flex-wrap gap-3">

                    {/* Titolo dinamico */}
                    <h1 className="text-xl font-bold text-slate-800">
                        {mode === "expenditure" ? "Uscite 2026" : "Entrate 2026"}
                    </h1>

                    {/* Toggle Entrate / Uscite */}
                    <div className="relative flex bg-white/60 backdrop-blur rounded-lg p-1 shadow-inner">
                        <button
                            className={`px-4 py-1 text-sm font-medium rounded-md transition-all duration-200 ${mode === "expenditure" ? "bg-slate-800 text-white shadow" : "text-slate-700 hover:bg-white/70"}`}
                            onClick={() => setMode("expenditure")}
                        >
                            Uscite
                        </button>

                        <button
                            className={`px-4 py-1 text-sm font-medium rounded-md transition-all duration-200 ${mode === "income" ? "bg-slate-800 text-white shadow" : "text-slate-700 hover:bg-white/70"}`}
                            onClick={() => setMode("income")}
                        >
                            Entrate
                        </button>
                    </div>
                </div>

                <div className="flex gap-2 mt-0 flex-wrap">
                    <Button variant="primary" size="sm" onClick={expandAll}>
                        Espandi tutto
                    </Button>
                    <Button variant="primary" size="sm" onClick={collapseAll}>
                        Collassa tutto
                    </Button>
                    <Button variant="primary" onClick={addCategory} size="sm" className="d-flex align-items-center gap-2 px-3 shadow-sm ms-auto"   >
                        <Plus size={18} />
                        Aggiungi categoria
                    </Button>
                </div>
            </div>

            <Accordion
                activeKey={activeKeys}
                onSelect={(keys) => setActiveKeys(keys)}
                alwaysOpen
            >
                {data?.map((category, indexCat) => {

                    const isEventKeyOpen = activeKeys.includes(String(indexCat));

                    if (category.type !== mode) return null

                    return (
                        <Accordion.Item key={category.id} eventKey={String(indexCat)}>
                            <h2 className="accordion-header">
                                <Accordion.Button
                                    className="d-flex align-items-center gap-2"
                                    style={{
                                        background: mode === 'expenditure' ? "#ffe2e2" : "#e2ffea",
                                        color: "#333",
                                    }}
                                >
                                    <ChevronDown
                                        size={18}
                                        style={{
                                            transform: isEventKeyOpen ? "rotate(180deg)" : "rotate(0deg)",
                                            transition: "transform .2s ease"
                                        }}
                                    />
                                    <div className="fw-bold">{category.title}</div>
                                    <Button
                                        variant='outline'
                                        onClick={(e) => { e.stopPropagation() }}
                                    >
                                        <Plus size={18} strokeWidth={2.5} />
                                    </Button>
                                </Accordion.Button>
                            </h2>
                            <Accordion.Body>
                                <div className="overflow-x-auto pb-0">
                                    <div className="space-y-2 min-w-7xl">

                                        {/* HEADER */}
                                        <div
                                            className="grid gap-0 items-center border-b border-slate-100 pb-2 relative"
                                            style={{ gridTemplateColumns: '110px repeat(12, 1fr) 100px' }}
                                        >
                                            <div className="sticky left-0 z-30 bg-white h-full border-r border-transparent">
                                                {/* Lasciare vuoto o mettere un titolo tipo "Categorie" */}
                                                <div className="bg-white h-full w-full"></div>
                                            </div>

                                            {monthsLabels.map((month, indexMonthLabels) => (
                                                <div key={indexMonthLabels}
                                                    className="text-right font-medium text-gray-400 text-sm italic flex flex-col items-end px-2 z-10">
                                                    <div className="">{month.slice(0, 3)}</div>
                                                    <div className="text-slate-500 font-semibold whitespace-nowrap">
                                                        {getTotalCategoryMonth(data, mode, indexCat, indexMonthLabels)} €
                                                    </div>
                                                </div>
                                            ))}

                                            <div className='flex flex-col items-end font-bold text-gray-500 text-sm italic px-2 z-10'>
                                                <div>All'anno</div>
                                                <div className="text-indigo-600">{getCategoryTotal(data, mode, indexCat)} €</div>
                                            </div>
                                        </div>

                                        {/* RIGHE DATI */}
                                        {category.rows.map((row) => (
                                            <div
                                                key={row.id}
                                                className="grid gap-0 items-center hover:bg-slate-50 group transition-colors"
                                                style={{ gridTemplateColumns: '110px repeat(12, 1fr) 100px' }}
                                            >
                                                <div className="sticky left-0 z-20 bg-white border-r border-slate-200 py-2">
                                                    <div className="text-xs font-bold text-slate-700 truncate px-0">
                                                        {row.name}
                                                    </div>
                                                </div>

                                                {row.values.map((val, idx) => (
                                                    <div key={`${row.id}_${idx}`} className="px-1 z-10">
                                                        <CustomInput value={val} onChange={(v) => console.log(v)} />
                                                    </div>
                                                ))}

                                                <div className='flex justify-end font-bold text-slate-600 text-sm px-2 z-10 bg-slate-50/50 h-full items-center'>
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
        </div>
    );
};


export default BudgetTable;