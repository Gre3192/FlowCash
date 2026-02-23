import React, { useState, useMemo, useEffect } from 'react';
import { Plus, ChevronDown, Trash2 } from 'lucide-react';

// --- SOTTO-COMPONENTE: INPUT NUMERICO ---
const CustomInput = ({ value, onChange }) => {
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') e.target.blur();
        if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault();
    };

    return (
        <div className="relative flex items-center group/input">
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

// --- COMPONENTE PRINCIPALE ---
const BudgetTable = () => {

    const monthsLabels = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];

    const [sections, setSections] = useState([
        {
            id: "cat_1",
            title: "Abbonamenti",
            rows: [
                { id: "row_1_1", name: "ChatGPT", values: [0, 1, 2, 3, 45, 78, 55, 22, 58, 22, 889, 22] },
                { id: "row_1_2", name: "Amazon Prime", values: [0, 1, 2, 3, 45, 78, 55, 22, 58, 22, 889, 22] }
            ]
        },
        {
            id: "cat_2",
            title: "Sanità",
            rows: [
                { id: "row_2_1", name: "Nutrizionista", values: [0, 1, 2, 3, 45, 78, 55, 22, 58, 22, 889, 22] },
                { id: "row_2_2", name: "Dottore", values: [0, 1, 2, 3, 45, 78, 55, 22, 58, 22, 889, 22] }
            ]
        }
    ]);

    const [openSections, setOpenSections] = useState({ "cat_1": true, "cat_2": true });
    const [contextMenu, setContextMenu] = useState(null);

    useEffect(() => {
        const closeMenu = () => setContextMenu(null);
        window.addEventListener('click', closeMenu);
        return () => window.removeEventListener('click', closeMenu);
    }, []);

    const totals = useMemo(() => {
        let grandTotal = 0;
        const sectionTotals = sections.map(s => {
            const total = s.rows.reduce((acc, r) => acc + r.values.reduce((a, b) => a + b, 0), 0);
            grandTotal += total;
            return total;
        });
        return { sectionTotals, grandTotal };
    }, [sections]);

    const handleUpdate = (sectionId, rowId, monthIdx, val) => {
        const newValue = parseFloat(val) || 0;
        setSections(prev => prev.map(s => s.id === sectionId ? {
            ...s, rows: s.rows.map(r => r.id === rowId ? {
                ...r, values: r.values.map((v, i) => i === monthIdx ? newValue : v)
            } : r)
        } : s));
    };

    const updateLabel = (sectionId, rowId, newValue, isTitle = false) => {
        setSections(prev => prev.map(s => {
            if (s.id !== sectionId) return s;
            if (isTitle) return { ...s, title: newValue };
            return { ...s, rows: s.rows.map(r => r.id === rowId ? { ...r, name: newValue } : r) };
        }));
    };

    const addCategory = () => {
        const newId = `cat_${Date.now()}`;
        setSections([...sections, {
            id: newId,
            title: "",
            rows: [{ id: `row_${Date.now()}`, name: '', values: Array(12).fill(0) }]
        }]);
        setOpenSections(prev => ({ ...prev, [newId]: true }));
    };

    const addRowAt = (sectionId, index) => {
        setSections(prev => prev.map(s => {
            if (s.id !== sectionId) return s;
            const newRows = [...s.rows];
            newRows.splice(index, 0, { id: `row_${Date.now()}`, name: '', values: Array(12).fill(0) });
            return { ...s, rows: newRows };
        }));
        setOpenSections(prev => ({ ...prev, [sectionId]: true }));
    };

    const deleteRow = (sectionId, rowId) => {
        setSections(prev => prev.map(s => s.id === sectionId ? { ...s, rows: s.rows.filter(r => r.id !== rowId) } : s));
    };

    const deleteCategory = (sectionId) => {
        setSections(prev => prev.filter(s => s.id !== sectionId));
    };

    const handleContextMenu = (e, sectionId, rowId = null) => {
        e.preventDefault();
        setContextMenu({
            mouseX: e.clientX,
            mouseY: e.clientY,
            sectionId,
            rowId,
            type: rowId ? 'ROW' : 'SECTION'
        });
    };

    const AddRowDivider = ({ onClick }) => (
        <tr className="group/divider relative h-0">
            <td colSpan={14} className="p-0 h-0 relative border-none">
                <div className="absolute inset-x-0 -top-3 bottom-0 z-30 flex items-center justify-center pointer-events-none">
                    <button
                        onClick={(e) => { e.stopPropagation(); onClick(); }}
                        className="cursor-pointer pointer-events-auto opacity-0 group-hover/divider:opacity-100 group-hover/cat:opacity-100 text-blue-500 hover:text-blue-700 transition-all active:scale-90 p-1"
                        title="Aggiungi riga"
                    >
                        <Plus size={18} strokeWidth={2.5} />
                    </button>
                    <div className="w-full h-[1.5px] bg-blue-300 opacity-0 group-hover/divider:opacity-30 transition-opacity" />
                </div>
            </td>
        </tr>
    );

    return (
        <div className="bg-slate-100 min-h-screen font-sans select-none text-slate-900">
            <div className="max-w-[1400px] mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 relative">

                {/* Header */}
                <div className="bg-[#f8a5a5] p-6 flex justify-between items-center border-b border-red-200">
                    <div>
                        <h1 className="text-2xl font-black text-red-900 tracking-tight uppercase">Uscite 2026</h1>
                        <button onClick={addCategory} className="mt-2 bg-white/30 hover:bg-white/50 text-red-900 text-[10px] font-bold uppercase px-4 py-1.5 rounded-full shadow-sm transition-all">
                            + Nuova Categoria
                        </button>
                    </div>
                    <div className="text-right">
                        <span className="block text-xs font-bold uppercase text-red-800 opacity-60">Uscite Totali</span>
                        <span className="text-3xl font-light text-red-950 tracking-tighter">
                            {totals.grandTotal.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}
                        </span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-400">
                                {/* Angolo in alto a sinistra: sticky su entrambi gli assi */}
                                <th className="p-4 text-left text-[10px] font-black uppercase sticky left-0 top-0 bg-gray-50 z-50 border-b border-gray-200 min-w-[240px]">
                                    Dettaglio Spesa
                                </th>
                                {monthsLabels.map(m => (
                                    <th key={m} className="p-4 text-right text-[10px] font-bold uppercase min-w-[100px] sticky top-0 bg-gray-50 z-40 border-b border-gray-200">
                                        {m.slice(0, 3)}
                                    </th>
                                ))}
                                <th className="p-4 text-right text-[10px] font-black uppercase text-red-500 sticky top-0 bg-red-50/80 backdrop-blur-sm z-40 border-b border-red-100">
                                    Totale
                                </th>
                            </tr>
                        </thead>

                        <tbody>

                            {/* Categorie */}
                            {sections.map((section, sIdx) => {
                                const isOpen = openSections[section.id];
                                return (
                                    <React.Fragment key={section.id}>
                                        <tr
                                            className="bg-red-100 hover:bg-red-200 transition-colors border-b border-gray-100 cursor-pointer group/cat"
                                            onClick={() => setOpenSections(p => ({ ...p, [section.id]: !p[section.id] }))}
                                            onContextMenu={(e) => handleContextMenu(e, section.id)}
                                        >
                                            <td className="p-4 sticky left-0 bg-inherit z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] flex items-center gap-3">
                                                <ChevronDown
                                                    size={18}
                                                    className={`transition-transform duration-300 text-gray-500 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                                                />
                                                <div className="flex-1 flex items-center gap-2">
                                                    <input
                                                        className="font-bold text-gray-800 bg-transparent outline-none border-b border-transparent focus:border-red-400 w-full"
                                                        value={section.title}
                                                        placeholder='Inserisci categoria'
                                                        onClick={(e) => e.stopPropagation()}
                                                        onChange={(e) => updateLabel(section.id, null, e.target.value, true)}
                                                        onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
                                                    />
                                                    {/* PULSANTE + ACCANTO AL NOME */}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            addRowAt(section.id, section.rows.length);
                                                        }}
                                                        className="opacity-0 cursor-pointer group-hover/cat:opacity-100 text-red-500 hover:text-red-700 transition-all active:scale-90 p-1 flex items-center justify-center"
                                                        title="Aggiungi riga"
                                                    >
                                                        <Plus size={18} strokeWidth={2.5} />
                                                    </button>
                                                </div>
                                            </td>
                                            {monthsLabels.map((_, mIdx) => (
                                                <td key={mIdx} className="p-4 text-right font-medium text-gray-400 text-sm italic">
                                                    {section.rows.reduce((acc, row) => acc + row.values[mIdx], 0).toFixed(0)}€
                                                </td>
                                            ))}
                                            <td className="p-4 text-right font-bold text-red-600 bg-red-50/20">{totals.sectionTotals[sIdx].toFixed(2)}€</td>
                                        </tr>


                                        {/* Righe */}
                                        {isOpen && section.rows.map((row, rIdx) => (
                                            <React.Fragment key={row.id}>
                                                <AddRowDivider onClick={() => addRowAt(section.id, rIdx)} />
                                                <tr
                                                    onContextMenu={(e) => handleContextMenu(e, section.id, row.id)}
                                                    className="border-b border-gray-50 hover:bg-blue-50/40 transition-all group/row"
                                                >
                                                    <td className="p-4 pl-12 text-sm text-gray-500 sticky left-0 bg-white z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] group/cell transition-colors duration-300">
                                                        <div className="flex items-center gap-2">

                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    deleteRow(section.id, row.id);
                                                                }}
                                                                className="shrink-0 p-1 cursor-pointer text-gray-400 hover:text-red-500 opacity-0 group-hover/cell:opacity-100 transition-opacity duration-500 ease-in-out"
                                                                title="Elimina riga"
                                                            >
                                                                <Trash2 size={16} strokeWidth={2} />
                                                            </button>
                                                            <input
                                                                className="bg-transparent outline-none italic w-full border-b border-transparent hover:border-gray-300 focus:border-red-500 transition-all duration-300"
                                                                value={row.name}
                                                                placeholder="Inserisci voce"
                                                                onChange={(e) => updateLabel(section.id, row.id, e.target.value)}
                                                                onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
                                                            />
                                                        </div>
                                                    </td>

                                                    {row.values.map((val, mIdx) => (
                                                        <td key={mIdx} className="p-2">
                                                            <CustomInput value={val} onChange={(v) => handleUpdate(section.id, row.id, mIdx, v)} />
                                                        </td>
                                                    ))}

                                                    <td className="p-4 text-right text-sm font-semibold text-red-400 italic">
                                                        {row.values.reduce((a, b) => a + b, 0).toFixed(2)}€
                                                    </td>
                                                </tr>
                                                {rIdx === section.rows.length - 1 && (
                                                    <AddRowDivider onClick={() => addRowAt(section.id, rIdx + 1)} />
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Context Menu */}
                {contextMenu && (
                    <div
                        className="fixed z-[100] bg-white shadow-2xl border border-gray-200 rounded-lg py-1 min-w-[160px] animate-in fade-in zoom-in duration-75"
                        style={{ top: contextMenu.mouseY, left: contextMenu.mouseX }}
                    >

                        {
                            contextMenu.type === 'ROW' ?
                                <button
                                    onClick={() => addRowAt(contextMenu.sectionId, contextMenu.rowId)}
                                    className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-red-50 flex items-center gap-2 font-medium"
                                >
                                    Aggiungi voce
                                </button>
                                : null
                        }
                        <button
                            onClick={() => contextMenu.type === 'ROW' ? deleteRow(contextMenu.sectionId, contextMenu.rowId) : deleteCategory(contextMenu.sectionId)}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
                        >
                            Elimina {contextMenu.type === 'ROW' ? 'voce' : 'categoria'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BudgetTable;