import React, { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import MonthCard from './MonthCard';

const BudgetCarousel = ({ onMonthClick }) => {
  // Configurazione Embla: drag libero con frizione e allineamento centrale
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'end', // Permette l'effetto elastico ai bordi
    dragFree: true,       // Abilita lo scorrimento inerziale (stile mobile)
    loop: false
  });

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const mesi = [
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
  ];

  return (
    <div className="relative group py-10">
      <div className="max-w-6xl mx-auto px-4 mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-blue-600 font-black uppercase tracking-widest text-xs">Timeline 2026</h2>
          <h1 className="text-3xl font-bold text-slate-900">I tuoi risparmi</h1>
        </div>

        <div className="flex gap-2">
          <button onClick={scrollPrev} className="p-3 rounded-full bg-white shadow-md hover:bg-slate-50 active:scale-90 transition-all border border-slate-100">
            <ChevronLeft size={20} />
          </button>
          <button onClick={scrollNext} className="p-3 rounded-full bg-white shadow-md hover:bg-slate-50 active:scale-90 transition-all border border-slate-100">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Viewport del Carosello */}
      <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
        <div className="flex touch-pan-y ml-[-20px]"> {/* Container delle slide */}
          {mesi.map((m) => (
            <div
              key={m.id}
              className="flex-[0_0_85%] sm:flex-[0_0_45%] lg:flex-[0_0_30%] pl-[20px] min-w-0"
            >
              <motion.div
                layoutId={`card-hero-${m.id}`} // Collegamento per la Hero Animation
                onClick={() => onMonthClick(m)}
                whileTap={{ scale: 0.97 }} // Feedback al click
                className="h-full"
              >
                <MonthCard
                  monthName={m.nome}
                  startValue={m.iniziale}
                  entryValue={m.entrate}
                  exitValue={m.uscite}
                />
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      {/* Barra di progresso estetica */}
      <div className="max-w-xs mx-auto mt-10 h-1 bg-slate-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-blue-500"
          initial={{ width: "10%" }}
        // Qui potresti legare la larghezza alla percentuale di scroll di Embla
        />
      </div>
    </div>
  );
};

export default BudgetCarousel;