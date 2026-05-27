
import { Search, X } from "lucide-react";

export default function SearchBar({ search, setSearch, placeholder = "Cerca..." }) {
    return (
        <div className="relative">
            <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
                type="text"
                placeholder={placeholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 py-1 pl-9 pr-9 text-xs outline-none transition-all focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />

            {search && (
                <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-2.5 top-1/2 flex h-5 w-5 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-200 hover:text-slate-600"
                    aria-label="Cancella ricerca"
                >
                    <X size={13} />
                </button>
            )}
        </div>
    );
}