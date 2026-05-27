export default function toNumber(value) {
    if (value === "" || value === null || value === undefined) return 0;

    return Number(String(value).replace(",", ".")) || 0;
}