import React, { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import MonthCard from './MonthCard';
import formatEuro from '../utils/formatEuro';

const BudgetCarousel = ({ onMonthClick, mesi }) => {

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'end',
    dragFree: true,
    loop: false
  });

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  return (
    <div className="relative group py-10">
      <div className="max-w-6xl mx-auto px-4 mb-8 flex justify-between items-end">

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
        <div className="flex touch-pan-y -ml-5"> {/* Container delle slide */}
          {mesi.map((m) => (
            <div
              key={m.id}
              className="flex-[0_0_85%] sm:flex-[0_0_45%] lg:flex-[0_0_30%] pl-5 min-w-0"
            >
              <MonthCard
                monthName={m.nome}
                startValue={m.iniziale}
                entryValue={m.entrate}
                exitValue={m.uscite}
              />
            </div>
          ))}
        </div>
      </div>


    </div>
  );
};

export default BudgetCarousel;