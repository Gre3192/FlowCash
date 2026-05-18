import { useState, useCallback } from "react";
import getFromStorage from "../utils/getFromStorage";
import saveToStorage from "../utils/saveToStorage";

const HERO_WIDTHS = {
    sm: { label: "S", maxW: "max-w-md" },
    md: { label: "M", maxW: "max-w-2xl" },
    lg: { label: "L", maxW: "max-w-4xl" },
    xl: { label: "XL", maxW: "max-w-6xl" },
    full: { label: "Full", maxW: "max-w-[calc(100%-2rem)]" },
};

const STORAGE_KEY = "hero-width-preference";

export { HERO_WIDTHS };

export default function useHeroAnimation(prefix = "hero", defaultWidth = "md") {
    const [selectedId, setSelectedId] = useState(null);
    const [width, setWidth] = useState(() => getFromStorage(STORAGE_KEY, defaultWidth));

    const open = useCallback((id) => {
        setSelectedId(id);
    }, []);

    const close = useCallback(() => {
        setSelectedId(null);
    }, []);

    const changeWidth = useCallback((key) => {
        setWidth(key);
        saveToStorage(STORAGE_KEY, key);
    }, []);

    const getLayoutId = useCallback(
        (id) => `${prefix}-${id}`,
        [prefix]
    );

    const isOpen = selectedId !== null;
    const maxWClass = HERO_WIDTHS[width]?.maxW || HERO_WIDTHS[defaultWidth].maxW;

    return {
        selectedId,
        isOpen,
        width,
        maxWClass,
        open,
        close,
        changeWidth,
        getLayoutId,
    };
}
