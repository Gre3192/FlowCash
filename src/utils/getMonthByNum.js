export default function getMonthByNum(numero) {
    
  const mesi = [
    "Gennaio",
    "Febbraio",
    "Marzo",
    "Aprile",
    "Maggio",
    "Giugno",
    "Luglio",
    "Agosto",
    "Settembre",
    "Ottobre",
    "Novembre",
    "Dicembre"
  ];

  if (!Number.isInteger(numero) || numero < 1 || numero > 12) {
    return null;
  }

  return mesi[numero - 1];
}