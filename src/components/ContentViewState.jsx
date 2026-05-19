export default function ContentViewState({
    loading = false,
    isEmpty = false,
    loadingComponent = null,
    emptyComponent = null,
    children,
}) {
    if (loading) {
        return (<div className="min-h-0 flex-1 overflow-y-auto p-2 sm:p-3">
            {loadingComponent}
        </div>)
    }

    if (isEmpty) {
        return (<div className="min-h-0 flex-1 overflow-y-auto p-2 sm:p-3">
            {emptyComponent}
        </div>)
    }

    return (
        <div className="min-h-0 flex-1 overflow-y-auto p-2 sm:p-3">
            {children}
        </div>
    )
}