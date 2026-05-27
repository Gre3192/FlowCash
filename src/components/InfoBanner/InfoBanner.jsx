function InfoBanner({
    show = false,
    text = "Errore durante il caricamento dei dati",
}) {
    if (!show) return null;

    return (
        <div className="shrink-0 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            <div className="h-2 w-2 shrink-0 rounded-full bg-red-400" />
            {text}
        </div>
    );
}

export default InfoBanner;