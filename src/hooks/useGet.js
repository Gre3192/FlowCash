import { useEffect, useState, useCallback } from "react";

export function useGet(url, options) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!!url);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (signal) => {
    
    if (!url) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(url, {
        method: "GET",
        ...options,
        signal,
      });

      if (!response.ok) {
        throw new Error(`Errore HTTP: ${response.status}`);
      }

      const text = await response.text();
      console.log("RISPOSTA RAW:", text);

      const result = JSON.parse(text);
      setData(result);
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("fetch error:", err);
        setError(err.message || "Errore sconosciuto");
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, [url, options]);

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);
    return () => controller.abort();
  }, [fetchData]);

  return { data, loading, error };
}