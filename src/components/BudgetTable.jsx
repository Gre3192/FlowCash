import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Wallet, Calendar, ChevronRight, ChevronLeft } from 'lucide-react';
import MonthCard from "../components/MonthCard"
import formatEuro from '../utils/formatEuro';

const BudgetTable = ({ mesi }) => {


  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">


      {/* Grid di Card */}
      <div className="max-w-6xl  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {mesi.map((m, i) => {
          return (
            <MonthCard
              key={i}
              monthName={m.nome}
              startValue={m.iniziale}
              entryValue={m.entrate}
              exitValue={m.uscite}
            />
          );
        })}
      </div>

      {/* Footer / Barra di Navigazione Rapida */}
      {/* <footer className="max-w-6xl mx-auto mt-12 bg-slate-900 text-white p-6 rounded-3xl flex flex-wrap justify-around gap-6 shadow-xl">
        <div className="text-center">
          <p className="text-slate-400 text-xs uppercase mb-1">Totale Entrate</p>
          <p className="text-xl font-bold text-emerald-400">{formatEuro(16972)}</p>
        </div>
        <div className="w-px bg-slate-700 hidden md:block"></div>
        <div className="text-center">
          <p className="text-slate-400 text-xs uppercase mb-1">Totale Uscite</p>
          <p className="text-xl font-bold text-rose-400">{formatEuro(18756)}</p>
        </div>
        <div className="w-px bg-slate-700 hidden md:block"></div>
        <div className="text-center">
          <p className="text-slate-400 text-xs uppercase mb-1">Cash Flow Netto</p>
          <p className="text-xl font-bold text-blue-400">{formatEuro(-1784)}</p>
        </div>
      </footer> */}
    </div>
  );
};

export default BudgetTable;