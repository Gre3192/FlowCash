export default function formatCurrency(value, showDashForZero = false) {
    const numericValue = Number(value) || 0;

    if (showDashForZero && numericValue === 0) {
        return "-";
    }

    return new Intl.NumberFormat("it-IT", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 2,
    }).format(numericValue);
}