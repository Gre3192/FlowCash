export default function saveToStorage(key, value, storageType = "local") {
    
    const storage = storageType === "session"
        ? sessionStorage
        : localStorage;

    try {
        const serializedValue = JSON.stringify(value);
        storage.setItem(key, serializedValue);
    } catch (error) {
        console.error("Errore durante il salvataggio nello storage:", error);
    }
}