import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

export default function TransactionTypeToggle({ type, setType }) {
  return (
    <div className="flex bg-slate-200 rounded-lg p-1 text-sm">

      <button
        onClick={() => setType("income")}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition
        ${
          type === "income"
            ? "bg-white shadow text-green-600"
            : "text-slate-600 hover:text-slate-800"
        }`}
      >
        <ArrowDownLeft size={16} />
        Entrate
      </button>

      <button
        onClick={() => setType("expense")}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition
        ${
          type === "expense"
            ? "bg-white shadow text-red-600"
            : "text-slate-600 hover:text-slate-800"
        }`}
      >
        <ArrowUpRight size={16} />
        Uscite
      </button>

    </div>
  );
}