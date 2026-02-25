import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import sumArray from '../utils/sumArray';
import 'bootstrap/dist/css/bootstrap.min.css';

const CustomInput = ({ value, onChange }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') e.target.blur();
    if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault();
  };

  const handleFocus = (e) => {
    // seleziona tutto il contenuto della cella
    e.target.select();
  };

  return (
    <div className="relative border-slate-200 flex items-center group/input bg-white focus-within:ring-1 focus-within:ring-red-500/20 transition-all">
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
        onFocus={handleFocus}
        className="w-full bg-transparent text-right outline-none 
                   px-1.5 py-1 pr-4 text-sm text-gray-700 font-normal
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
const monthsLabels = [
  'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
  'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre',
];

const DATA = [
  {
    id: 'cat_1',
    title: 'Abbonamenti',
    type: 'expenditure',
    rows: [
      { id: 'row_1_1', name: 'ChatGPT', values: [0, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
      { id: 'row_1_2', name: 'Amazon Prime', values: [0, 1, 2, 3, 45, 78, 55, 22, 58, 22, 889, 22] },
    ],
  },
  {
    id: 'cat_2',
    title: 'Sanità',
    type: 'expenditure',
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

const BudgetTable = () => {
  const [data, setdata] = useState(DATA);
  const [activeKeys, setActiveKeys] = useState(['0']);
  const [mode, setMode] = useState('expenditure');

  const expandAll = () => setActiveKeys(data.map((_, i) => String(i)));
  const collapseAll = () => setActiveKeys([]);

  const makeId = (prefix = 'id') =>
    `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;

  // ✅ UPDATE: categoria -> riga -> mese
  const updateCellValue = (categoryId, rowId, monthIndex, rawValue) => {
    const normalized = String(rawValue ?? '').replace(',', '.');
    const num = normalized === '' ? 0 : Number(normalized);

    setdata((prev) =>
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

  const addCategory = () => {
    const newKey = String(data.length);

    const newCategory = {
      id: makeId('cat'),
      title: '',
      type: mode,
      rows: [{ id: makeId('row'), name: '', values: Array(12).fill(0) }],
    };

    setdata((prev) => [...prev, newCategory]);
    setActiveKeys((prev) => {
      const arr = Array.isArray(prev) ? prev : prev ? [prev] : [];
      return arr.includes(newKey) ? arr : [...arr, newKey];
    });
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
    <div className="p-3">
      <div
        className={`mb-4 p-4 rounded-xl ${
          mode === 'expenditure' ? 'bg-[#f8a5a5]' : 'bg-[#a5f8c7]'
        } border border-slate-200 shadow-sm`}
      >
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-xl font-bold text-slate-800">
            {mode === 'expenditure' ? 'Uscite 2026' : 'Entrate 2026'}
          </h1>

          <div className="relative flex bg-white/60 backdrop-blur rounded-lg p-1 shadow-inner">
            <button
              className={`px-4 py-1 text-sm font-medium rounded-md transition-all duration-200 ${
                mode === 'expenditure'
                  ? 'bg-slate-800 text-white shadow'
                  : 'text-slate-700 hover:bg-white/70'
              }`}
              onClick={() => setMode('expenditure')}
            >
              Uscite
            </button>

            <button
              className={`px-4 py-1 text-sm font-medium rounded-md transition-all duration-200 ${
                mode === 'income'
                  ? 'bg-slate-800 text-white shadow'
                  : 'text-slate-700 hover:bg-white/70'
              }`}
              onClick={() => setMode('income')}
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

      <Accordion activeKey={activeKeys} onSelect={(keys) => setActiveKeys(keys)} alwaysOpen>
        {data?.map((category, indexCat) => {
          if (category.type !== mode) return null;

          return (
            <Accordion.Item key={category.id} eventKey={String(indexCat)}>
              <h2 className="accordion-header">
                <Accordion.Button
                  className="d-flex align-items-center gap-2"
                  style={{
                    background: mode === 'expenditure' ? '#ffe2e2' : '#e2ffea',
                    color: '#333',
                  }}
                >
                  <div className="fw-bold">{category.title}</div>
                  <Button variant="outline" onClick={(e) => e.stopPropagation()}>
                    <Plus size={18} strokeWidth={2.5} />
                  </Button>
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
                        <div className="sticky left-0 z-20 bg-white border-r border-slate-200 py-2.5">
                          <div className="text-xs font-bold text-slate-700 truncate px-0">
                            {row.name}
                          </div>
                        </div>

                        {row.values.map((val, idx) => (
                          <div key={`${row.id}_${idx}`} className="px-1 z-10">
                            <CustomInput
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
    </div>
  );
};

export default BudgetTable;