import React, { useState, useMemo, useEffect } from 'react';
import { Plus, ChevronDown, Trash2, Expand, Shrink } from 'lucide-react';
import Accordion from 'react-bootstrap/Accordion';
import Button from "react-bootstrap/Button";
import sumArray from '../utils/sumArray';
import 'bootstrap/dist/css/bootstrap.min.css';



const CustomInput = ({ value, onChange }) => {

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') e.target.blur();
        if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault();
    };

    return (
        <div className="relative border flex items-center group/input">
            <style>{`
                input::-webkit-outer-spin-button,
                input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
                input[type=number] { -moz-appearance: textfield; }
            `}</style>
            <input
                type="number"
                step="0.01"
                lang="it-IT"
                value={value === 0 ? '' : value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent text-right outline-none border-b border-transparent 
                           hover:border-gray-300 focus:border-red-500 transition-all duration-200 
                           p-1 pr-4 text-sm text-gray-700 appearance-none font-medium"
                placeholder="0,00"
            />
            <span className="absolute right-0 text-[10px] text-gray-400 font-medium pointer-events-none 
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

    const getTotalMonthByCategory = (data, type, categoryIndex, valueIndex) => {
        const filtered = data.filter(cat => cat.type === type);

        const category = filtered[categoryIndex];
        if (!category || !category.rows?.length) return 0;

        return category.rows.reduce((sum, row) => {
            return sum + (Number(row.values?.[valueIndex]) || 0);
        }, 0);
    };

    console.log(getTotalYear(data, mode));
    console.log(getTotalMonth(data, mode, 1));


    let indexCat = -1

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
                            onClick={() => setMode("expenditure")}
                            className={`px-4 py-1 text-sm font-medium rounded-md transition-all duration-200 ${mode === "expenditure" ? "bg-slate-800 text-white shadow" : "text-slate-700 hover:bg-white/70"}`}
                        >
                            Uscite
                        </button>

                        <button
                            onClick={() => setMode("income")}
                            className={`px-4 py-1 text-sm font-medium rounded-md transition-all duration-200 ${mode === "income" ? "bg-slate-800 text-white shadow" : "text-slate-700 hover:bg-white/70"}`}
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
                                <div className="overflow-hidden">
                                    <div className="space-y-2">
                                        <div className="grid grid-cols-14 gap-0 items-center">
                                            <div></div>
                                            {monthsLabels.map((month, indexMonthLabels) => {
                                                return (
                                                    <div key={indexMonthLabels} className='flex flex-col items-end'>
                                                        <div>
                                                            {month.slice(0, 3)}
                                                        </div>
                                                        <div>
                                                            {getTotalMonthByCategory(data, mode, indexCat, indexMonthLabels)}
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                            <div className='flex flex-col items-end'>
                                                <div>
                                                    Totale
                                                </div>
                                                <div>
                                                    546
                                                </div>
                                            </div>
                                        </div>
                                        {category.rows.map((row) => {
                                            return (

                                                <div key={row.id} className="grid grid-cols-14 gap-0 items-center" >
                                                    <div className="sticky left-0 z-10 bg-white border-r border-slate-200">
                                                        <div className="text-sm font-semibold text-slate-700 truncate pr-2">
                                                            {row.name}
                                                        </div>
                                                    </div>
                                                    {row.values.map((val, idx) => {

                                                        return (
                                                            <CustomInput
                                                                key={`${row.id}_${idx}`}
                                                                value={val}
                                                                onChange={(v) => console.log(v)}
                                                            />
                                                        )
                                                    })}
                                                    <div className='flex justify-end'>
                                                        {sumArray(row.values)}
                                                    </div>
                                                </div>
                                            )
                                        })}
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