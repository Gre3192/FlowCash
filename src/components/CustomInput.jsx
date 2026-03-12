 export default function CustomInput  ({ value, onChange, mode })  {

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') e.target.blur();
        if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault();
    };

    const handleFocus = (e) => {
        // seleziona tutto il contenuto della cella
        e.target.select();
    };

    return (
        <div className={`relative flex items-center group/input bg-white focus-within:ring-1 ${mode === 'expense' ? 'focus-within:ring-red-500' : 'focus-within:ring-green-500'} transition-all`}>
            <style>{`
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>

            <input
                type="number"
                step="0.01"
                lang="it-IT"
                value={value === 0 || value === undefined ? '' : value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                className="w-full bg-transparent text-right outline-none 
                   px-1.5 py-1 pr-4 text-sm text-gray-700 font-normal
                   placeholder:text-gray-300 transition-colors"
                placeholder="0,00"
            />

            <span className={`absolute right-1.5 top-1/2 -translate-y-1/2 
                       text-[10px] text-gray-400 font-bold pointer-events-none 
                       ${mode === 'expense' ? 'group-focus-within/input:text-red-500' : 'group-focus-within/input:text-green-500'} transition-colors`}>
                €
            </span>
        </div>
    );
};