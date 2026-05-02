export default function getMonthByNum(numero, letters) {
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
        "Dicembre",
    ];

    if (!Number.isInteger(numero) || numero < 1 || numero > 12) {
        return null;
    }

    const monthName = mesi[numero - 1];

    if (letters === undefined || letters === null) {
        return monthName;
    }

    if (!Number.isInteger(letters) || letters < 1) {
        return monthName;
    }

    return monthName.slice(0, letters);
}