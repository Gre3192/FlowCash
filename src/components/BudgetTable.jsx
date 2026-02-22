import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Wallet, Calendar, ChevronRight, ChevronLeft } from 'lucide-react';
import MonthCard from "../components/MonthCard"
import formatEuro from '../utils/formatEuro';

const BudgetTable = ({ mesi }) => {


  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
    </div>
  );
};

export default BudgetTable;