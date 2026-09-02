import { useEffect, useState } from 'react';

// Fetch /api/rfef amb fallback silent al JSON local del caller.
// Retorna { data, source: 'live'|null, updatedAt, error }.
export function useLive(endpoint = '/api/rfef') {
  const [state, setState] = useState({ data: null, source: null, updatedAt: null, error: null });

  useEffect(() => {
    const ac = new AbortController();
    fetch(endpoint, { signal: ac.signal })
      .then(async r => {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        const j = await r.json();
        setState({ data: j, source: 'live', updatedAt: j.updatedAt, error: null });
      })
      .catch(err => {
        if (err.name !== 'AbortError') setState(s => ({ ...s, error: err.message }));
      });
    return () => ac.abort();
  }, [endpoint]);

  return state;
}
