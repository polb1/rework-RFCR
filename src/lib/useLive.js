import { useEffect, useState } from 'react';

const isDev = import.meta.env.DEV;

/**
 * Hook per obtenir dades en directe de /api/live.
 * Cau silenciosament al fallback (dades JSON estàtiques) si:
 *  - som en dev (no hi ha serverless funcionant amb `vite dev`)
 *  - el fetch falla (5xx, sense clau, etc.)
 *
 * @param {'next'|'last'|'standings'|'live'} type
 * @param {any} fallback
 * @param {number} intervalMs interval de polling (0 = només un cop)
 */
export function useLive(type, fallback, intervalMs = 0) {
  const [data, setData] = useState(fallback);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isDev) return; // en local no cridem el proxy

    let cancelled = false;
    let timer = null;

    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/live?type=${type}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!cancelled) { setData(json); setError(null); }
      } catch (e) {
        if (!cancelled) setError(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    if (intervalMs > 0) {
      timer = setInterval(load, intervalMs);
    }
    return () => { cancelled = true; if (timer) clearInterval(timer); };
  }, [type, intervalMs]);

  return { data, loading, error };
}
