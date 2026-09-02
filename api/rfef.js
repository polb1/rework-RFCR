// Proxy Vercel per RFEF Segona Federació Grup 2 (Reus FC Reddis).
// Font: marcadores.rfef.es (portal PNFG oficial de la RFEF).
// Retorna JSON amb standings + partits de la jornada mostrada.
// Cache: 1h edge (s-maxage) + stale-while-revalidate 24h.
//
// Handshake fràgil del PNFG:
//   1) GET NUserLang crea sessió server-side (IP based, sense cookie retornable)
//   2) GET NFG_VisClasificacion retorna 65 KB HTML ISO-8859-15
// Retry fins a 3 cops si torna buit; si res funciona, 502 i el frontend usa el JSON local.

const COMP_ID   = '33836091'; // Segunda Federación
const GROUP_ID  = '33836093'; // Grupo 2 (Reus FC Reddis)
const PRIMARIA  = '1000120';
const SELF      = 'Reus FC Reddis';
const UA        = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const BASE = 'https://marcadores.rfef.es/pnfg';

export default async function handler(req, res) {
  const jornada = parseInt(req.query.jornada || '1', 10);
  const url = `${BASE}/NPcd/NFG_VisClasificacion?cod_primaria=${PRIMARIA}&codjornada=${jornada}&codgrupo=${GROUP_ID}&codcompeticion=${COMP_ID}`;

  let html = '';
  let jsid = '';
  for (let attempt = 1; attempt <= 3 && html.length < 1000; attempt++) {
    try {
      // Handshake: idioma + main page. Combinat amb pausa curta per si el servidor tarda.
      const seed = await fetch(`${BASE}/?accion=1&federacion=`, { headers: { 'User-Agent': UA } });
      jsid = (seed.headers.get('set-cookie') || '').match(/JSESSIONID=([^;]+)/)?.[1] || jsid;
      await fetch(`${BASE}/NUserLang`, { method: 'POST', headers: { 'User-Agent': UA, ...(jsid ? { Cookie: `JSESSIONID=${jsid}` } : {}) } });

      const r = await fetch(url, { headers: { 'User-Agent': UA, ...(jsid ? { Cookie: `JSESSIONID=${jsid}` } : {}) } });
      // La resposta és ISO-8859-15
      const buf = await r.arrayBuffer();
      html = new TextDecoder('iso-8859-15').decode(buf);
    } catch { /* retry */ }
  }

  if (html.length < 1000) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(502).json({ error: 'RFEF empty', jornada, attempts: 3 });
  }

  const standings = parseStandings(html);
  const results   = parseResults(html);
  const jornadaDetected = parseJornada(html) || jornada;

  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
  return res.status(200).json({
    source: 'marcadores.rfef.es',
    competition: 'Segunda Federación',
    group: 'Grupo 2',
    season: '2026-27',
    jornada: jornadaDetected,
    updatedAt: new Date().toISOString(),
    standings,
    results,
  });
}

function parseStandings(html) {
  const tableStart = html.indexOf('Ordenar por');
  const tableEnd   = html.indexOf('Jornada Siguiente');
  const chunk = tableStart >= 0 ? html.slice(tableStart, tableEnd > 0 ? tableEnd : undefined) : html;

  const rows = [];
  const rowRe = /padding:6px 2px["'\s>]+\s*([0-9]{1,2})\s*<\/td>([\s\S]*?)(?=padding:6px 2px|Jornada Siguiente|$)/g;
  let m;
  while ((m = rowRe.exec(chunk))) {
    const position = parseInt(m[1], 10);
    const cell = m[2];
    const nameMatch = cell.match(/codequipo=(\d+)[^"']*"[^>]*>\s*([^<]+?)\s*</);
    if (!nameMatch) continue;
    const teamId = nameMatch[1];
    const team = decode(nameMatch[2]);
    const nums = [...cell.matchAll(/<td[^>]*font_responsive[^>]*>\s*([\-0-9]+)(?:&nbsp;)?\s*<\/td>/g)].map(x => parseInt(x[1], 10));
    // Ordre PNFG: [pts, played, wins, draws, losses, gf, ga, ...]
    const [points, played, wins, draws, losses, gf, ga] = nums;
    rows.push({
      position, teamId, team,
      played: n(played), wins: n(wins), draws: n(draws), losses: n(losses),
      gf: n(gf), ga: n(ga), points: n(points),
      isSelf: team === SELF,
    });
  }
  return rows;
}

function parseResults(html) {
  const idx = html.search(/Jornada \d+\s*\([0-9\-]+\)/);
  if (idx < 0) return [];
  const tail = html.slice(idx);
  const rowRe = /codequipo=(\d+)[^"']*"[^>]*>\s*([^<]+?)\s*<[\s\S]{0,500}?<td[^>]*>\s*([0-9]{1,2})\s*[-–]\s*([0-9]{1,2})\s*<\/td>[\s\S]{0,500}?codequipo=(\d+)[^"']*"[^>]*>\s*([^<]+?)\s*</g;
  const scheduledRe = /codequipo=(\d+)[^"']*"[^>]*>\s*([^<]+?)\s*<[\s\S]{0,200}?-\s*<[\s\S]{0,200}?codequipo=(\d+)[^"']*"[^>]*>\s*([^<]+?)\s*</g;
  const results = [];
  let m;
  while ((m = rowRe.exec(tail))) {
    results.push({
      home: { id: m[1], name: decode(m[2]) },
      away: { id: m[5], name: decode(m[6]) },
      homeScore: +m[3], awayScore: +m[4],
      played: true,
    });
  }
  if (results.length === 0) {
    while ((m = scheduledRe.exec(tail))) {
      results.push({
        home: { id: m[1], name: decode(m[2]) },
        away: { id: m[3], name: decode(m[4]) },
        homeScore: null, awayScore: null,
        played: false,
      });
    }
  }
  return results;
}

function parseJornada(html) {
  const m = html.match(/Jornada\s+(\d+)\s*\(/);
  return m ? parseInt(m[1], 10) : null;
}

function n(v) { return Number.isFinite(v) ? v : 0; }
function decode(s) {
  return s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#(\d+);/g, (_, c) => String.fromCharCode(+c)).replace(/\s+/g, ' ').trim();
}
