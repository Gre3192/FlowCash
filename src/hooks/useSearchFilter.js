import { useMemo } from "react";

export function useSearchFilter(items = [], searchValue = "", searchKeys = ["name"]) {
    return useMemo(() => {
        const query = searchValue.trim().toLowerCase();

        if (!query) return items;

        return items.filter((item) => {
            return searchKeys.some((key) => {
                const value = item?.[key];
                return String(value ?? "").toLowerCase().includes(query);
            });
        });
    }, [items, searchValue, searchKeys]);
}