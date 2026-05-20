export default function AmountRatio({ firstNum, secondNum, isIncome }) {
    function parseAmount(value) {
        if (typeof value === "number") return value;

        return Number(
            String(value)
                .replace("€", "")
                .replace(/\s/g, "")
                .replace(/\./g, "")
                .replace(",", ".")
        ) || 0;
    }

    function getAmountColor(firstValue, secondValue) {
        if (isIncome) return "text-emerald-600";

        if (secondValue <= 0) return "text-slate-600";

        const progress = (firstValue / secondValue) * 100;

        if (progress > 100) return "text-red-600";
        if (progress === 100) return "text-emerald-600";
        if (progress >= 70) return "text-blue-700";
        if (progress >= 40) return "text-blue-500";

        return "text-sky-500";
    }

    const firstValue = parseAmount(firstNum);
    const secondValue = parseAmount(secondNum);

    const amountColor = getAmountColor(firstValue, secondValue);

    return (
        <div
            className={`
                whitespace-nowrap text-xs font-medium leading-4
                ${amountColor}
            `}
        >
            {firstNum}
            <span className="font-normal text-slate-500">
                {" "}
                / {secondNum}
            </span>
        </div>
    );
}