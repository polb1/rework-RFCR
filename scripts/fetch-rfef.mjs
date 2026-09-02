// Scraper RFEF Segona Federació Grup 2 — actualitza src/data/matches.json
// Baixa les 34 jornades de marcadores.rfef.es, extreu el partit del Reus FCR
// (data/hora/resultat) i fusiona amb el fitxer existent.
//
// Execució:
//   node scripts/fetch-rfef.mjs                → actualitza matches.json
//   node scripts/fetch-rfef.mjs --dry          → només imprimeix el diff
//
// Ús programat: workflow .github/workflows/update-matches.yml (cada dia 03:00)

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const MATCHES_PATH = path.join(ROOT, 'src/data/matches.json');
const STANDINGS_PATH = path.join(ROOT, 'src/data/standings.json');
const MAP_PATH = path.join(ROOT, 'src/data/rfefTeamMap.js');

const COMP_ID = '33836091';
const GROUP_ID = '33836093';
const PRIMARIA = '1000120';
const TOTAL_JORNADES = 34;
const SELF = 'Reus FC Reddis';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const BASE = 'https://marcadores.rfef.es/pnfg';

const SHORTS = {
  'CD Arnedo':'ARN','CD Ebro':'EBR','CD Tudelano':'TUD','CE Manresa':'MAN',
  'CF Calamocha':'CAL','CA Osasuna B':'OSB','Barça Atlètic':'BAR',
  'Girona FC B':'GIB','Náxara CD':'NAX','Peña Sport FC':'PEN',
  'RCD Espanyol B':'ESB','Reus FC Reddis':'RFCR','SD Logroñés':'SDL',
  'Terrassa FC':'TER','UD Barbastro':'BAR2','UD Logroñés B':'UDL',
  'UE Olot':'OLO','Utebo FC':'UTE',
};

const dry = process.argv.includes('--dry');

async function loadTeamMap() {
  const src = await readFile(MAP_PATH, 'utf8');
  const match = src.match(/RFEF_TO_LOCAL\s*=\s*(\{[\s\S]*?\});/);
  if (!match) throw new Error('No es pot llegir RFEF_TO_LOCAL de rfefTeamMap.js');
  // eslint-disable-next-line no-new-func
  return new Function('return ' + match[1])();
}

async function seedSession() {
  const jar = { cookie: '' };
  const r1 = await fetch(`${BASE}/?accion=1&federacion=`, { headers: { 'User-Agent': UA } });
  const c = r1.headers.get('set-cookie') || '';
  const jsid = c.match(/JSESSIONID=([^;]+)/)?.[1];
  if (jsid) jar.cookie = `JSESSIONID=${jsid}`;
  await fetch(`${BASE}/NUserLang`, { method: 'POST', headers: { 'User-Agent': UA, ...(jar.cookie ? { Cookie: jar.cookie } : {}) } });
  return jar;
}

async function fetchJornada(jornada, jar, attempt = 1) {
  const url = `${BASE}/NPcd/NFG_VisClasificacion?cod_primaria=${PRIMARIA}&codjornada=${jornada}&codgrupo=${GROUP_ID}&codcompeticion=${COMP_ID}`;
  const r = await fetch(url, { headers: { 'User-Agent': UA, ...(jar.cookie ? { Cookie: jar.cookie } : {}) } });
  const buf = await r.arrayBuffer();
  const html = new TextDecoder('iso-8859-15').decode(buf);
  if (html.length < 2000 && attempt < 3) {
    await sleep(1500 * attempt);
    const fresh = await seedSession();
    jar.cookie = fresh.cookie;
    return fetchJornada(jornada, jar, attempt + 1);
  }
  return html;
}

function parseJornada(html, rfefMap) {
  const jm = html.match(/Jornada\s+(\d+)\s*\(([\d\-]+)\)/);
  if (!jm) return null;
  const jornada = parseInt(jm[1], 10);
  const [dd, mm, yyyy] = jm[2].split('-');
  const dateStr = `${yyyy}-${mm}-${dd}`;

  const section = html.slice(html.indexOf(jm[0]));
  const rowRe = /Codigo_Equipo=(\d+)"[^>]*>\s*([^<]+?)\s*<\/a>[\s\S]{0,300}?<h4[^>]*>\s*([0-9\-\s]+?)\s*<\/h4>[\s\S]{0,300}?Codigo_Equipo=(\d+)"[^>]*>\s*([^<]+?)\s*<\/a>/g;
  const matches = [];
  let m;
  while ((m = rowRe.exec(section)) && matches.length < 9) {
    const home = rfefMap[decode(m[2])];
    const away = rfefMap[decode(m[5])];
    if (!home || !away) continue;
    const scoreMatch = m[3].trim().match(/^(\d+)\s*-\s*(\d+)$/);
    matches.push({
      home, away,
      homeScore: scoreMatch ? +scoreMatch[1] : null,
      awayScore: scoreMatch ? +scoreMatch[2] : null,
    });
  }
  return { jornada, dateStr, matches };
}

function decode(s) {
  return s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function buildMatch(parsed, mm, standingsBadges) {
  const isHome = mm.home === SELF;
  const isAway = mm.away === SELF;
  if (!isHome && !isAway) return null;
  const played = mm.homeScore !== null;
  return {
    id: `j${String(parsed.jornada).padStart(2, '0')}`,
    competition: 'Segona Federació',
    matchday: parsed.jornada,
    date: `${parsed.dateStr}T17:00:00+02:00`,
    venue: isHome ? 'Estadi Municipal de Reus' : `Camp del ${isHome ? mm.away : mm.home}`,
    isHome,
    home: {
      name: mm.home,
      shortName: SHORTS[mm.home] || mm.home.slice(0, 3).toUpperCase(),
      badge: standingsBadges[mm.home] || '/assets/badges/placeholder.svg',
    },
    away: {
      name: mm.away,
      shortName: SHORTS[mm.away] || mm.away.slice(0, 3).toUpperCase(),
      badge: standingsBadges[mm.away] || '/assets/badges/placeholder.svg',
    },
    homeScore: mm.homeScore,
    awayScore: mm.awayScore,
    status: played ? 'played' : 'scheduled',
    ...(isHome && !played ? { ticketsUrl: 'https://reusfcreddis.compralaentrada.com/eventos/' } : {}),
  };
}

// Fusiona: mantenim l'hora concreta si l'existent és d'aquesta jornada i el nou només porta 17:00 genèric.
// Prioritzem sempre les dates i resultats nous. Preservem `venue` si l'existent és més descriptiu.
function mergeMatch(existing, fresh) {
  if (!existing) return fresh;
  const out = { ...existing, ...fresh };
  // Si l'usuari ha editat manualment l'hora (i el nou és 17:00), preservem la manual.
  const freshTime = fresh.date.slice(11, 16);
  const existingTime = existing.date.slice(11, 16);
  if (freshTime === '17:00' && existingTime !== '17:00' && fresh.date.slice(0, 10) === existing.date.slice(0, 10)) {
    out.date = existing.date;
  }
  // Preserva venue si l'existent no és el genèric "Camp del X"
  if (existing.venue && !existing.venue.startsWith('Camp del ') && !fresh.venue.startsWith('Estadi Municipal')) {
    out.venue = existing.venue;
  }
  return out;
}

// ── main ───────────────────────────────────────────────────────────────

async function main() {
  const [rfefMap, standingsRaw, matchesRaw] = await Promise.all([
    loadTeamMap(),
    readFile(STANDINGS_PATH, 'utf8'),
    readFile(MATCHES_PATH, 'utf8'),
  ]);
  const standings = JSON.parse(standingsRaw);
  const standingsBadges = Object.fromEntries(standings.map(r => [r.team, r.badge]));
  const existing = JSON.parse(matchesRaw);
  const existingByRound = Object.fromEntries(existing.map(m => [m.matchday, m]));

  let jar = await seedSession();
  const updated = [];
  let fetched = 0, failed = 0;

  for (let j = 1; j <= TOTAL_JORNADES; j++) {
    try {
      const html = await fetchJornada(j, jar);
      const parsed = parseJornada(html, rfefMap);
      if (!parsed) { failed++; continue; }
      fetched++;
      for (const mm of parsed.matches) {
        const built = buildMatch(parsed, mm, standingsBadges);
        if (built) updated.push(mergeMatch(existingByRound[built.matchday], built));
      }
      await sleep(400);
    } catch (err) {
      console.error(`J${j} error:`, err.message);
      failed++;
    }
  }

  // Rescata jornades que hem tingut abans però que ara han fallat
  for (const m of existing) {
    if (!updated.find(u => u.matchday === m.matchday)) updated.push(m);
  }
  updated.sort((a, b) => a.matchday - b.matchday);

  const before = JSON.stringify(existing);
  const after = JSON.stringify(updated);
  const changed = before !== after;

  console.log(`Jornades fetched=${fetched} failed=${failed} totals=${updated.length} changed=${changed}`);

  if (dry) {
    console.log('--dry: no s\'escriu res');
    if (changed) console.log('Diff detected, would write.');
    return;
  }
  if (changed) {
    await writeFile(MATCHES_PATH, JSON.stringify(updated, null, 2) + '\n');
    console.log('matches.json actualitzat');
  } else {
    console.log('Cap canvi');
  }
}

main().catch(err => { console.error(err); process.exit(1); });
