import { useEffect, useMemo, useState } from "react";

function wait(ms, signal) {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(resolve, ms);

        signal?.addEventListener("abort", () => {
            clearTimeout(timeoutId);
            reject(new DOMException("Aborted", "AbortError"));
        });
    });
}

export function useGet(url, config = {}) {
    const delayMs = config.delayMs ?? 0;

    const options = useMemo(() => {
        return config.options ?? {};
    }, [config.options]);

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(!!url);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!url) {
            setLoading(false);
            return;
        }

        const controller = new AbortController();

        async function fetchData() {
            try {
                setLoading(true);
                setError(null);

                if (delayMs > 0) {
                    await wait(delayMs, controller.signal);
                }

                const response = await fetch(url, {
                    method: "GET",
                    ...options,
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error(`Errore HTTP: ${response.status}`);
                }

                const result = await response.json();

                if (!controller.signal.aborted) {
                    setData(result);
                }
            } catch (err) {
                if (err.name !== "AbortError") {
                    console.error("fetch error:", err);
                    setError(err.message || "Errore sconosciuto");
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        fetchData();

        return () => controller.abort();
    }, [url, delayMs, options]);

    return { data, loading, error };
}