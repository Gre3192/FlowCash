const DAYS = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];

export default function getDaysOfMonth(month, year) {
    const jsMonth = month - 1;

    const totalDays = new Date(year, month, 0).getDate();

    return Array.from({ length: totalDays }, (_, index) => {
        const dayNumber = index + 1;
        const date = new Date(year, jsMonth, dayNumber);

        return {
            id: `${year}-${month}-${dayNumber}`,
            dayNumber,
            dayName: DAYS[date.getDay()],
            date,
        };
    });
}