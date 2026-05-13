// src/hooks/useSelectedItem.js
import { useMemo } from "react";

export function useSelectedItem(items = [], selectedId = null, fallbackToFirst = true) {
    return useMemo(() => {
        if (!items.length) return null;

        const selectedItem = items.find((item) => item.id === selectedId);

        if (selectedItem) return selectedItem;

        return fallbackToFirst ? items[0] : null;
    }, [items, selectedId, fallbackToFirst]);
}