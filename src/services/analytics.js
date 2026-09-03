// Arquitectura d'analytics preparada — no-op fins que activem tracker real.
//
// Ús:
//   import { track } from '@/services/analytics';
//   track('ticket_click', { matchId: 'j04' });
//
// Quan vulguem activar GA4/Plausible/Umami:
//   - Substituir _send() per la crida real (gtag, plausible.event, umami.track)
//   - No cal tocar cap component que ja cridi track()

const ENABLED = false;

const _queue = [];

function _send(event, props) {
  if (!ENABLED) return;
  // Exemple GA4 (quan s'activi):
  //   if (window.gtag) window.gtag('event', event, props);
  // Exemple Plausible:
  //   if (window.plausible) window.plausible(event, { props });
  console.log('[analytics]', event, props);
}

export function track(event, props = {}) {
  const enriched = { ...props, ts: Date.now(), path: typeof location !== 'undefined' ? location.pathname : '' };
  if (!ENABLED) _queue.push({ event, props: enriched });
  else _send(event, enriched);
}

export function pageview(path) {
  track('page_view', { path });
}

// Events estàndard (constants per evitar typos)
export const EVENTS = {
  TICKET_CLICK: 'ticket_click',
  MEMBERSHIP_CLICK: 'membership_click',
  SHOP_CLICK: 'shop_click',
  MATCH_VIEW: 'match_view',
  NEWS_VIEW: 'news_view',
  PLAYER_VIEW: 'player_view',
  SOCIAL_CLICK: 'social_click',
};
