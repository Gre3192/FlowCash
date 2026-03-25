import { useState, useEffect, useCallback } from "react";

export function useGet(url, options = {}) {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    
    if (!url) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        method: "GET",
        ...options,
      });

      if (!response.ok) {
        throw {
          message: "Richiesta fallita",
          status: response.status,
          statusText: response.statusText,
        };
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError({
        message: err.message || "Errore sconosciuto",
        status: err.status || null,
        statusText: err.statusText || null,
      });
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}