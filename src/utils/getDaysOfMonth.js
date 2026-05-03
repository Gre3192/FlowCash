const DAYS = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];

export default function getDaysOfMonth(month, year) {
    const totalDays = new Date(year, month + 1, 0).getDate();

    return Array.from({ length: totalDays }, (_, index) => {
        const dayNumber = index + 1;
        const date = new Date(year, month, dayNumber);

        return {
            id: `${year}-${month + 1}-${dayNumber}`,
            dayNumber,
            dayName: DAYS[date.getDay()],
            date,
        };
    });
}