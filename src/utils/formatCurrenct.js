
    export default function formatCurrency(value) {
        return new Intl.NumberFormat("it-IT", {
            style: "currency",
            currency: "EUR",
            maximumFractionDigits: 2,
        }).format(Number(value) || 0);
    }