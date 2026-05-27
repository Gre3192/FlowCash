export default function getCurrentDateData() {
    
    const currentDate = new Date();

    return {
        currentDate,
        currentDay: currentDate.getDate(),
        currentMonth: currentDate.getMonth() + 1,
        currentYear: currentDate.getFullYear(),

        currentHour: currentDate.getHours(),
        currentMinutes: currentDate.getMinutes(),
        currentSeconds: currentDate.getSeconds(),

        currentTime: currentDate.toLocaleTimeString("it-IT", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        }),
    };
}