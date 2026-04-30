export default function getNumByMonth(meseInput) {
    
  const mesi = [
    "gennaio",
    "febbraio",
    "marzo",
    "aprile",
    "maggio",
    "giugno",
    "luglio",
    "agosto",
    "settembre",
    "ottobre",
    "novembre",
    "dicembre"
  ];

  if (typeof meseInput !== "string") {
    return null;
  }

  const input = meseInput.trim().toLowerCase();

  if (input.length < 3) {
    return null;
  }

  const indice = mesi.findIndex(mese =>
    mese.startsWith(input.slice(0, 3))
  );

  return indice === -1 ? null : indice + 1;
}