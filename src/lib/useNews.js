import { useEffect, useState } from 'react';
import { client, sanityEnabled, urlFor } from './sanity.js';
import fallback from '../data/news.json';

const QUERY_ALL = `*[_type == "news"] | order(date desc){
  "id": _id, title, "slug": slug.current, excerpt, body, date, category,
  "image": image.asset->url, author
}`;

const QUERY_ONE = `*[_type == "news" && slug.current == $slug][0]{
  "id": _id, title, "slug": slug.current, excerpt, body, date, category,
  "image": image.asset->url, author
}`;

function normalizeBody(body) {
  if (!body) return [];
  if (Array.isArray(body) && body.length > 0 && typeof body[0] === 'string') return body;
  if (Array.isArray(body)) {
    return body
      .filter(b => b._type === 'block')
      .map(b => (b.children || []).map(c => c.text).join(''));
  }
  return [];
}

export function useNews() {
  const [data, setData] = useState(sanityEnabled ? null : fallback);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sanityEnabled) return;
    client.fetch(QUERY_ALL)
      .then(rows => setData(rows.map(r => ({ ...r, body: normalizeBody(r.body) }))))
      .catch(e => { setError(e); setData(fallback); });
  }, []);

  return { data: data || [], loading: data === null, error };
}

export function useNewsItem(slug) {
  const [item, setItem] = useState(sanityEnabled ? null : fallback.find(n => n.slug === slug) || null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sanityEnabled) return;
    client.fetch(QUERY_ONE, { slug })
      .then(r => setItem(r ? { ...r, body: normalizeBody(r.body) } : null))
      .catch(e => { setError(e); setItem(fallback.find(n => n.slug === slug) || null); });
  }, [slug]);

  return { item, loading: item === null && !error, error };
}
