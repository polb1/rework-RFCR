// Scraper RFEF Segona Federació Grup 2 — actualitza src/data/matches.json.
//
// Dues fonts complementàries:
//  1) Classificació PNFG (marcadores.rfef.es) — estructura del calendari (rivals, jornada base)
//  2) PDFs oficials rfef.es "Horarios ... Jornada N" — data i hora CONFIRMADES per partit
//
// Prioritat: PDF > classificació. Si el PDF té data/hora, sobreescriu la del calendari base.
//
// Requereix `pdftotext` (paquet poppler-utils) — instal·lat via apt al workflow.
//
// Execució:
//   node scripts/fetch-rfef.mjs           actualitza matches.json
//   node scripts/fetch-rfef.mjs --dry     només diu què canviaria

import { readFile, writeFile, mkdtemp } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import path from 'node:path';

const execFileP = promisify(execFile);
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
const PNFG = 'https://marcadores.rfef.es/pnfg';
const HORARIOS_LIST = 'https://rfef.es/es/noticias/labor-federativa/horarios?baseFilters=79393';

const SHORTS = {
  'CD Arnedo':'ARN','CD Ebro':'EBR','CD Tudelano':'TUD','CE Manresa':'MAN',
  'CF Calamocha':'CAL','CA Osasuna B':'OSB','Barça Atlètic':'BAR',
  'Girona FC B':'GIB','Náxara CD':'NAX','Peña Sport FC':'PEN',
  'RCD Espanyol B':'ESB','Reus FC Reddis':'RFCR','SD Logroñés':'SDL',
  'Terrassa FC':'TER','UD Barbastro':'BAR2','UD Logroñés B':'UDL',
  'UE Olot':'OLO','Utebo FC':'UTE',
};

const dry = process.argv.includes('--dry');

// ── util ───────────────────────────────────────────────────────────────

const sleep = ms => new Promise(r => setTimeout(r, ms));

function decode(s) {
  return s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();
}

async function loadTeamMap() {
  const src = await readFile(MAP_PATH, 'utf8');
  const match = src.match(/RFEF_TO_LOCAL\s*=\s*(\{[\s\S]*?\});/);
  if (!match) throw new Error('No es pot llegir RFEF_TO_LOCAL de rfefTeamMap.js');
  return new Function('return ' + match[1])();
}

// ── font 1: PNFG classificació ─────────────────────────────────────────

async function seedPnfg() {
  const jar = { cookie: '' };
  const r1 = await fetch(`${PNFG}/?accion=1&federacion=`, { headers: { 'User-Agent': UA } });
  const jsid = (r1.headers.get('set-cookie') || '').match(/JSESSIONID=([^;]+)/)?.[1];
  if (jsid) jar.cookie = `JSESSIONID=${jsid}`;
  await fetch(`${PNFG}/NUserLang`, { method: 'POST', headers: { 'User-Agent': UA, ...(jar.cookie ? { Cookie: jar.cookie } : {}) } });
  return jar;
}

async function fetchJornadaPnfg(j, jar, attempt = 1) {
  const url = `${PNFG}/NPcd/NFG_VisClasificacion?cod_primaria=${PRIMARIA}&codjornada=${j}&codgrupo=${GROUP_ID}&codcompeticion=${COMP_ID}`;
  const r = await fetch(url, { headers: { 'User-Agent': UA, ...(jar.cookie ? { Cookie: jar.cookie } : {}) } });
  const buf = await r.arrayBuffer();
  const html = new TextDecoder('iso-8859-15').decode(buf);
  if (html.length < 2000 && attempt < 3) {
    await sleep(1500 * attempt);
    const fresh = await seedPnfg();
    jar.cookie = fresh.cookie;
    return fetchJornadaPnfg(j, jar, attempt + 1);
  }
  return html;
}

function parsePnfgJornada(html, rfefMap) {
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

// ── font 2: PDFs horaris confirmats ────────────────────────────────────

// Descobreix les URLs de PDFs horaris de Segona Federació (masculina) publicades a rfef.es
async function discoverHorariosPdfs() {
  const r = await fetch(HORARIOS_LIST, { headers: { 'User-Agent': UA, 'Accept': 'text/html' } });
  if (!r.ok) return {};
  const html = await r.text();
  // Enllaços a noticies del tipus /noticias/...jornada-N-...segunda-federacion (exclou femenina)
  const linkRe = /href="(\/es\/noticias\/[^"]*(?:horarios?[^"]*jornada|jornada[^"]*horarios?)[^"]*segunda-federacion(?![-_]?fem)[^"]*)"/gi;
  const news = [...new Set([...html.matchAll(linkRe)].map(m => 'https://rfef.es' + m[1]))];
  // Alternativa: recerca general de posts que continguin "jornada" i "segunda federacion" al slug
  if (news.length === 0) {
    const generic = /href="(\/es\/noticias\/[^"]*(?:jornada-\d+|jornada\d+|inaugural)[^"]*segunda-federacion(?![-_]?fem)[^"]*)"/gi;
    news.push(...new Set([...html.matchAll(generic)].map(m => 'https://rfef.es' + m[1])));
  }
  console.error(`Notícies horaris trobades: ${news.length}`);

  const pdfByJornada = {};
  for (const url of news) {
    try {
      const page = await fetch(url, { headers: { 'User-Agent': UA, 'Accept': 'text/html' } });
      const body = await page.text();
      const pdfMatch = body.match(/href="([^"]+segunda_?federacion[^"]*jornada[^"]*\.pdf)"/i)
                    || body.match(/href="([^"]+jornada[^"]*segunda_?federacion[^"]*\.pdf)"/i)
                    || body.match(/href="([^"]+segunda_?federacion[^"]*\.pdf)"/i);
      if (!pdfMatch) continue;
      const pdfUrl = pdfMatch[1].startsWith('http') ? pdfMatch[1] : 'https://rfef.es' + pdfMatch[1];
      // Extreu número de jornada del slug o del text del post
      const jn = url.match(/jornada[-_]?(\d+)/i) || body.match(/JORNADA\s*(\d+)/) || url.match(/(\d+)[a-z]?[-_]/);
      if (!jn) continue;
      const j = parseInt(jn[1], 10);
      if (j >= 1 && j <= TOTAL_JORNADES) pdfByJornada[j] = pdfUrl;
      await sleep(300);
    } catch { /* ignore */ }
  }
  return pdfByJornada;
}

async function fetchAndParsePdf(pdfUrl) {
  const r = await fetch(pdfUrl, { headers: { 'User-Agent': UA } });
  if (!r.ok) return null;
  const buf = Buffer.from(await r.arrayBuffer());
  const dir = await mkdtemp(path.join(tmpdir(), 'rfef-'));
  const fp = path.join(dir, 'j.pdf');
  await writeFile(fp, buf);
  try {
    const { stdout } = await execFileP('pdftotext', ['-layout', fp, '-']);
    return stdout;
  } catch (err) {
    console.error('pdftotext error:', err.message);
    return null;
  }
}

// Extreu la fila del Reus del text del PDF (secció GRUPO 2)
function parseReusFromPdf(text) {
  const idx = text.indexOf('GRUPO 2');
  if (idx < 0) return null;
  const nextGroup = text.indexOf('GRUPO 3', idx);
  const chunk = text.slice(idx, nextGroup > 0 ? nextGroup : idx + 4000);
  // Localitza línia amb "Reus FC Reddis" i extreu hora HH:MM més propera. Data del capçalera anterior.
  const lines = chunk.split(/\r?\n/);
  let currentDate = null;
  for (let i = 0; i < lines.length; i++) {
    const dateHead = lines[i].match(/(\d{2})-(\d{2})-(\d{4})/);
    if (dateHead) currentDate = `${dateHead[3]}-${dateHead[2]}-${dateHead[1]}`;
    if (/Reus FC Reddis/i.test(lines[i]) && currentDate) {
      // Busca hora dins la mateixa línia (últimes tres columnes són Hora Jornada Resul.)
      const timeMatch = lines[i].match(/\b(\d{1,2}):(\d{2})\b/);
      if (timeMatch) {
        return { date: currentDate, time: `${timeMatch[1].padStart(2,'0')}:${timeMatch[2]}` };
      }
      // Si no és a la línia, mira les 2 següents (a vegades cauen a la dreta)
      for (let k = 1; k <= 3; k++) {
        const alt = lines[i + k]?.match(/\b(\d{1,2}):(\d{2})\b/);
        if (alt) return { date: currentDate, time: `${alt[1].padStart(2,'0')}:${alt[2]}` };
      }
      return { date: currentDate, time: null };
    }
  }
  return null;
}

// ── construcció del match ──────────────────────────────────────────────

function buildMatch(parsed, mm, standingsBadges, pdfInfo) {
  const isHome = mm.home === SELF;
  const isAway = mm.away === SELF;
  if (!isHome && !isAway) return null;
  const played = mm.homeScore !== null;

  const dateStr = pdfInfo?.date || parsed.dateStr;
  const timeStr = pdfInfo?.time || '17:00';

  return {
    id: `j${String(parsed.jornada).padStart(2, '0')}`,
    competition: 'Segona Federació',
    matchday: parsed.jornada,
    date: `${dateStr}T${timeStr}:00+02:00`,
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
    ...(pdfInfo?.time ? { horariConfirmat: true } : {}),
    ...(isHome && !played ? { ticketsUrl: 'https://reusfcreddis.compralaentrada.com/eventos/' } : {}),
  };
}

function mergeMatch(existing, fresh) {
  if (!existing) return fresh;
  const out = { ...existing, ...fresh };
  // Preserva venue no genèric
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

  // Font 2: PDFs (opcional — si falla, seguim amb classificació)
  let pdfByJornada = {};
  try {
    pdfByJornada = await discoverHorariosPdfs();
    console.error(`PDFs mapejats a jornades: ${Object.keys(pdfByJornada).length}`);
  } catch (err) {
    console.error('Error descobrint PDFs:', err.message);
  }

  // Cache d'info del PDF per jornada
  const pdfInfoByJornada = {};
  for (const [jStr, url] of Object.entries(pdfByJornada)) {
    const j = parseInt(jStr, 10);
    try {
      const text = await fetchAndParsePdf(url);
      if (!text) continue;
      const info = parseReusFromPdf(text);
      if (info) {
        pdfInfoByJornada[j] = info;
        console.error(`J${j}: PDF confirma ${info.date} ${info.time || '(hora pendent)'}`);
      }
    } catch (err) {
      console.error(`PDF J${j} error:`, err.message);
    }
  }

  // Font 1: PNFG classificació
  const jar = await seedPnfg();
  const updated = [];
  let fetched = 0, failed = 0;
  for (let j = 1; j <= TOTAL_JORNADES; j++) {
    try {
      const html = await fetchJornadaPnfg(j, jar);
      const parsed = parsePnfgJornada(html, rfefMap);
      if (!parsed) { failed++; continue; }
      fetched++;
      for (const mm of parsed.matches) {
        const built = buildMatch(parsed, mm, standingsBadges, pdfInfoByJornada[j]);
        if (built) updated.push(mergeMatch(existingByRound[built.matchday], built));
      }
      await sleep(400);
    } catch (err) {
      console.error(`J${j} error:`, err.message);
      failed++;
    }
  }

  // Rescata jornades on PNFG ha fallat però tenim entrada prèvia
  for (const m of existing) {
    if (!updated.find(u => u.matchday === m.matchday)) {
      // Si el PDF confirma per aquesta jornada, apliquem-lo sobre la còpia local
      const info = pdfInfoByJornada[m.matchday];
      if (info) {
        const time = info.time || m.date.slice(11, 16);
        updated.push({ ...m, date: `${info.date}T${time}:00+02:00`, horariConfirmat: !!info.time });
      } else {
        updated.push(m);
      }
    }
  }
  updated.sort((a, b) => a.matchday - b.matchday);

  const before = JSON.stringify(existing);
  const after = JSON.stringify(updated);
  const changed = before !== after;

  console.log(`PNFG: fetched=${fetched} failed=${failed}. PDFs: ${Object.keys(pdfInfoByJornada).length}. Total=${updated.length}. Changed=${changed}`);

  if (dry) {
    if (changed) console.log('--dry: canvis detectats, no s\'escriu');
    else console.log('--dry: cap canvi');
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
