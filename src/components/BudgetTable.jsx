import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Wallet, Calendar, ChevronRight, ChevronLeft } from 'lucide-react';
import MonthCard from "../components/MonthCard"

const BudgetTable = () => {


  const [mesi, setMesi] = useState([
    { nome: "Gennaio", entrate: 0, uscite: 0, iniziale: 4551.34 },
    { nome: "Febbraio", entrate: 1672, uscite: 3680.54, iniziale: 4551.34 },
    { nome: "Marzo", entrate: 1400, uscite: 1461.82, iniziale: 2542.80 },
    { nome: "Aprile", entrate: 1400, uscite: 1522.21, iniziale: 2480.98 },
    { nome: "Maggio", entrate: 1400, uscite: 1522.21, iniziale: 2480.98 },
    { nome: "Giugno", entrate: 1400, uscite: 1522.21, iniziale: 2480.98 },
    { nome: "Luglio", entrate: 1400, uscite: 1522.21, iniziale: 2480.98 },
    { nome: "Agosto", entrate: 1400, uscite: 1522.21, iniziale: 2480.98 },
    { nome: "Settembre", entrate: 1400, uscite: 1522.21, iniziale: 2480.98 },
    { nome: "Ottobre", entrate: 1400, uscite: 1522.21, iniziale: 2480.98 },
    { nome: "Novembre", entrate: 1400, uscite: 1522.21, iniziale: 2480.98 },
    { nome: "Dicembre", entrate: 1400, uscite: 1522.21, iniziale: 2480.98 },
  ]);

  const formatEuro = (val) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(val);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header moderno */}
      <header className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
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