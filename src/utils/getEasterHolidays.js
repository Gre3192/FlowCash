// Algoritmo di Meeus/Jones/Butcher per calcolare la data della Pasqua nel calendario gregoriano.

export default function getEasterHolidays(year) {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);

    const easterMonth = Math.floor((h + l - 7 * m + 114) / 31);
    const easterDay = ((h + l - 7 * m + 114) % 31) + 1;

    const easterDate = new Date(year, easterMonth - 1, easterDay);

    const easterMondayDate = new Date(easterDate);
    easterMondayDate.setDate(easterDate.getDate() + 1);

    return {
        easter: {
            month: easterMonth,
            day: easterDay,
            label: "Pasqua",
        },
        easterMonday: {
            month: easterMondayDate.getMonth() + 1,
            day: easterMondayDate.getDate(),
            label: "Pasquetta",
        },
    };
}