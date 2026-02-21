import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, GalleryHorizontal, List } from 'lucide-react'; // Icone per il toggle
import BudgetTable from './../components/BudgetTable';
import BudgetCarousel from './../components/BudgetTableCarousel';

export default function MonthlyBudgetPage() {
    // 'table' o 'carousel'
    const [viewMode, setViewMode] = useState('carousel');

    return (
        <div className="min-h-screen bg-[#f8fafc] p-6">

            {/* Container del Toggle */}
            <div className="max-w-5xl mx-auto flex justify-end mb-8">
                <div className="bg-white p-1 rounded-2xl shadow-sm border border-slate-200 flex items-center relative">

                    {/* Sfondo animato del toggle */}
                    <motion.div
                        className="absolute bg-blue-600 rounded-xl h-[calc(100%-8px)]"
                        initial={false}
                        animate={{
                            x: viewMode === 'table' ? 0 : '100%',
                            width: viewMode === 'table' ? '120px' : '135px' // Larghezza dinamica in base al testo
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />

                    {/* Bottone Modalità Tabella */}
                    <button
                        onClick={() => setViewMode('table')}
                        className={`relative z-10 px-4 py-2 flex items-center gap-2 text-sm font-bold transition-colors duration-300 ${viewMode === 'table' ? 'text-white' : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        <LayoutGrid size={18} />
                        Tabella
                    </button>

                    {/* Bottone Modalità Carosello */}
                    <button
                        onClick={() => setViewMode('carousel')}
                        className={`relative z-10 px-4 py-2 flex items-center gap-2 text-sm font-bold transition-colors duration-300 ${viewMode === 'carousel' ? 'text-white' : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        <GalleryHorizontal size={18} />
                        Carosello
                    </button>
                </div>
            </div>

            {/* Area Contenuto con AnimatePresence per il cambio vista */}
            <div className="max-w-7xl mx-auto relative">
                <AnimatePresence mode="wait">
                    {viewMode === 'table' ? (
                        <motion.div
                            key="table"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <BudgetTable />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="carousel"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <BudgetCarousel />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

        </div>
    );
}