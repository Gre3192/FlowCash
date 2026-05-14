// utils/getFromStorage.js
export default function getFromStorage(key, fallbackValue = null, storageType = "local") {
    const storage = storageType === "session" ? sessionStorage : localStorage;

    try {
        const value = storage.getItem(key);

        if (value === null) return fallbackValue;

        return JSON.parse(value);
    } catch (error) {
        console.error("Errore durante la lettura dallo storage:", error);
        return fallbackValue;
    }
}