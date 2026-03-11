import React from "react";

const BudgetOverview = ({
  title = "Panoramica generale",
  current = 993.79,
  total = 1400,
}) => {
  const percent = Math.min((current / total) * 100, 100).toFixed(1);

  return (
    <div className="w-full rounded-xl border border-gray-200 bg-gray-100 p-4">
      
      {/* titolo */}
      <h3 className="text-sm font-medium text-gray-700 mb-3">
        {title}
      </h3>

      {/* valori */}
      <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
        <span>
          €{current.toFixed(2)} di €{total.toFixed(2)}
        </span>
        <span className="font-medium text-gray-700">
          {percent}%
        </span>
      </div>

      {/* progress bar */}
      <div className="w-full h-2 rounded-full bg-gray-300 overflow-hidden">
        <div
          className="h-full bg-slate-900 transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>

    </div>
  );
};

export default BudgetOverview;