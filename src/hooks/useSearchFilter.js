import { useMemo } from "react";

export default function useSearchFilter(items = [], searchValue = "", getSearchText) {
    return useMemo(() => {
        const query = searchValue.trim().toLowerCase();

        if (!query) return items;

        return items.filter((item) => {
            const text = getSearchText(item);

            return String(text ?? "")
                .toLowerCase()
                .includes(query);
        });
    }, [items, searchValue, getSearchText]);
}