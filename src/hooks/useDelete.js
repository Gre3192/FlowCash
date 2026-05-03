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

export function useDelete(config = {}) {
    const delayMs = config.delayMs ?? 0;

    const options = useMemo(() => {
        return config.options ?? {};
    }, [config.options]);

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function deleteData(url, body = null) {
        const controller = new AbortController();

        try {
            setLoading(true);
            setError(null);

            if (delayMs > 0) {
                await wait(delayMs, controller.signal);
            }

            const fetchOptions = {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    ...(options.headers ?? {}),
                },
                ...options,
                signal: controller.signal,
            };

            if (body !== null) {
                fetchOptions.body = JSON.stringify(body);
            }

            const response = await fetch(url, fetchOptions);

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

            let result = null;

            if (response.status !== 204) {
                try {
                    result = await response.json();
                } catch {
                    result = null;
                }
            }

            if (!controller.signal.aborted) {
                setData(result);
            }

            return result;
        } catch (err) {
            if (err.name !== "AbortError") {
                console.error("delete error:", err);
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
        deleteData,
    };
}