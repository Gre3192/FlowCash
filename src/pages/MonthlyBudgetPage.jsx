import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, GalleryHorizontal, List, Wallet } from 'lucide-react'; // Icone per il toggle
import BudgetTable from './../components/BudgetTable';
import BudgetCarousel from './../components/BudgetTableCarousel';
import ToggleButton from '../components/ToggleButton';
import formatEuro from '../utils/formatEuro';

export default function MonthlyBudgetPage() {

    const [mesi, setMesi] = useState([
        { nome: "Gennaio", entrate: 0, uscite: 0, iniziale: 4551.34 },
        { nome: "Febbraio", entrate: 1672, uscite: 3680.54, iniziale: 4551.34 },
        { nome: "Marzo", entrate: 1400, uscite: 1461.82, iniziale: 2542.80 },
        { nome: "Aprile", entrate: 1400, uscite: 1522.21, iniziale: 2480.98 },
        { nome: "Maggio", entrate: 1400, uscite: 1522.21, iniziale: 2480.98 },
        { nome: "Giugno", entrate: 1400, uscite: 1522.21, iniziale: 2480.98 },
        { nome: "Luglio", entrate: 1400, uscite: 1522.21, iniziale: 2480.98 },
        { nome: "Agosto", entrate: 0, uscite: 0, iniziale: 0 },
        { nome: "Settembre", entrate: 1400, uscite: 1522.21, iniziale: 2480.98 },
        { nome: "Ottobre", entrate: 1400, uscite: 1522.21, iniziale: 2480.98 },
        { nome: "Novembre", entrate: 1400, uscite: 1522.21, iniziale: 2480.98 },
        { nome: "Dicembre", entrate: 1400, uscite: 1522.21, iniziale: 2480.98 },
    ]);

    const [viewMode, setViewMode] = useState('carousel');

    return (
        <div className="min-h-screen bg-[#f8fafc]">


            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-sm font-black text-blue-600 uppercase tracking-[0.2em] mb-1">Timeline Finanziaria</h2>
                    <h1 className="text-4xl font-bold text-slate-900">Previsioni 2026</h1>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                        <Wallet size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Saldo Annuale Stimato</p>
                        <p className="text-xl font-black text-slate-800">{formatEuro(2766.99)}</p>
                    </div>
                </div>
            </header>



            {/* Container del Toggle */}
            <ToggleButton
                value={viewMode}
                onChange={setViewMode}
                options={[
                    {
                        value: "carousel",
                        icon: GalleryHorizontal,
                    },
                    {
                        value: "table",
                        icon: LayoutGrid,
                    },
                ]} />


            {/* Area Contenuto con AnimatePresence per il cambio vista */}
            <div className="max-w-7xl relative">
                <AnimatePresence mode="wait">
                    {viewMode === 'table' ? (
                        <motion.div
                            key="table"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <BudgetTable mesi={mesi} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="carousel"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <BudgetCarousel mesi={mesi} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

        </div>
    );
}