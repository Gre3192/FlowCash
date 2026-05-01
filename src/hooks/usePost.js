import { useMemo, useState } from "react";

function wait(ms, signal) {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(resolve, ms);

        signal?.addEventListener("abort", () => {
            clearTimeout(timeoutId);
            reject(new DOMException("Aborted", "AbortError"));
        });
    });
}

export function usePost(config = {}) {
    const delayMs = config.delayMs ?? 0;

    const options = useMemo(() => {
        return config.options ?? {};
    }, [config.options]);

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function postData(url, body = {}) {
        const controller = new AbortController();

        try {
            setLoading(true);
            setError(null);

            if (delayMs > 0) {
                await wait(delayMs, controller.signal);
            }

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(options.headers ?? {}),
                },
                ...options,
                body: JSON.stringify(body),
                signal: controller.signal,
            });

            if (!response.ok) {
                let errorMessage = `Errore HTTP: ${response.status}`;

                try {
                    const errorResult = await response.json();

                    errorMessage =
                        errorResult.detail ||
                        errorResult.message ||
                        JSON.stringify(errorResult);
                } catch {
                    // se il backend non restituisce JSON
                }

                throw new Error(errorMessage);
            }

            const result = await response.json();

            if (!controller.signal.aborted) {
                setData(result);
            }

            return result;
        } catch (err) {
            if (err.name !== "AbortError") {
                console.error("post error:", err);
                setError(err.message || "Errore sconosciuto");
            }

            throw err;
        } finally {
            if (!controller.signal.aborted) {
                setLoading(false);
            }
        }
    }

    return {
        data,
        loading,
        error,
        postData,
    };
}