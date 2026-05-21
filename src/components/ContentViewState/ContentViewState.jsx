export default function ContentViewState({
    loading = false,
    isEmpty = false,
    loadingComponent = null,
    emptyComponent = null,
    children,
    autoScroll = false,
}) {
    const overflowClass = autoScroll ? "overflow-y-auto" : "overflow-y-scroll";

    function renderContent() {
        if (loading) return loadingComponent;
        if (isEmpty) return emptyComponent;
        return children;
    }

    return (
        <div className={`min-h-0 flex-1 p-2 sm:p-3 ${overflowClass}`}>
            {renderContent()}
        </div>
    );
}