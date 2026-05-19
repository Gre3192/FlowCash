export default function AmountRatio({ firstNum, secondNum, isIncome }) {
    return (
        <div
            className={`
                mb-1 whitespace-nowrap text-xs font-medium leading-4
                ${isIncome ? "text-emerald-600" : "text-red-600"}
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