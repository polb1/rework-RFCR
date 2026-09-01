// Vercel Serverless Function — proxy a API-Football amb caché
// GET /api/live?type=next|last|standings|live

const BASE = 'https://v3.football.api-sports.io';

const cache = new Map();
const TTL = {
  next: 5 * 60_000,
  last: 5 * 60_000,
  standings: 15 * 60_000,
  live: 30_000,
};

async function apiFootball(path, key) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(`${BASE}${path}`, {
      headers: { 'x-apisports-key': key, 'Accept': 'application/json' },
      signal: controller.signal,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`API-Football ${res.status}: ${text.slice(0, 200)}`);
    }
    const data = await res.json();
    if (data.errors && !Array.isArray(data.errors) && Object.keys(data.errors).length > 0) {
      throw new Error(`API-Football errors: ${JSON.stringify(data.errors)}`);
    }
    return data.response;
  } finally {
    clearTimeout(timeout);
  }
}

function normalizeFixture(f) {
  return {
    id: `af-${f.fixture.id}`,
    competition: f.league?.name,
    round: f.league?.round,
    date: f.fixture.date,
    venue: f.fixture.venue?.name || '',
    status: f.fixture.status.short === 'FT' ? 'played'
          : ['1H','2H','HT','ET','P','LIVE','BT'].includes(f.fixture.status.short) ? 'live'
          : 'scheduled',
    home: {
      name: f.teams.home.name,
      shortName: (f.teams.home.name || '').slice(0, 3).toUpperCase(),
      badge: f.teams.home.logo,
    },
    away: {
      name: f.teams.away.name,
      shortName: (f.teams.away.name || '').slice(0, 3).toUpperCase(),
      badge: f.teams.away.logo,
    },
    homeScore: f.goals.home,
    awayScore: f.goals.away,
    minute: f.fixture.status.elapsed || null,
  };
}

function normalizeStanding(row) {
  return {
    position: row.rank,
    team: row.team.name,
    badge: row.team.logo,
    played: row.all.played,
    wins: row.all.win,
    draws: row.all.draw,
    losses: row.all.lose,
    gf: row.all.goals.for,
    ga: row.all.goals.against,
    points: row.points,
    form: row.form,
  };
}

function json(res, status, body) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.status(status).end(JSON.stringify(body));
}

export default async function handler(req, res) {
  try {
    console.log('[/api/live] hit', req.url);

    let type = 'next';
    try {
      const u = new URL(req.url, `http://${req.headers.host || 'x'}`);
      type = u.searchParams.get('type') || 'next';
    } catch {}

    const key = process.env.APIFOOTBALL_KEY;
    const leagueId = process.env.APIFOOTBALL_LEAGUE_ID;
    const teamId = process.env.APIFOOTBALL_TEAM_ID;
    const season = process.env.APIFOOTBALL_SEASON || String(new Date().getFullYear());

    const missing = [];
    if (!key) missing.push('APIFOOTBALL_KEY');
    if (!leagueId) missing.push('APIFOOTBALL_LEAGUE_ID');
    if (!teamId) missing.push('APIFOOTBALL_TEAM_ID');
    if (missing.length) {
      console.error('[/api/live] missing env:', missing);
      return json(res, 500, { error: `Missing env vars: ${missing.join(', ')}` });
    }

    if (typeof fetch !== 'function') {
      console.error('[/api/live] global fetch not available (Node <18?)');
      return json(res, 500, { error: 'Server Node runtime lacks global fetch. Set Node 22.x at Vercel.' });
    }

    const cacheKey = `${type}:${leagueId}:${teamId}:${season}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.at < (TTL[type] || 60_000)) {
      res.setHeader('X-Cache', 'HIT');
      res.setHeader('Cache-Control', `s-maxage=${Math.floor((TTL[type] || 60_000) / 1000)}, stale-while-revalidate=60`);
      return json(res, 200, cached.data);
    }

    let data;
    try {
      if (type === 'next') {
        const rows = await apiFootball(`/fixtures?team=${teamId}&league=${leagueId}&season=${season}&next=1`, key);
        data = rows?.[0] ? normalizeFixture(rows[0]) : null;
      } else if (type === 'last') {
        const rows = await apiFootball(`/fixtures?team=${teamId}&league=${leagueId}&season=${season}&last=5`, key);
        data = (rows || []).map(normalizeFixture);
      } else if (type === 'live') {
        const rows = await apiFootball(`/fixtures?team=${teamId}&live=all`, key);
        data = rows?.[0] ? normalizeFixture(rows[0]) : null;
      } else if (type === 'standings') {
        const rows = await apiFootball(`/standings?league=${leagueId}&season=${season}`, key);
        const standings = rows?.[0]?.league?.standings?.[0] || [];
        data = standings.map(normalizeStanding);
      } else {
        return json(res, 400, { error: `invalid type: ${type}` });
      }
    } catch (e) {
      console.error('[/api/live] api-football fetch failed:', e.message);
      if (cached) {
        res.setHeader('X-Cache', 'STALE');
        return json(res, 200, cached.data);
      }
      return json(res, 502, { error: e.message });
    }

    cache.set(cacheKey, { at: Date.now(), data });
    res.setHeader('X-Cache', 'MISS');
    res.setHeader('Cache-Control', `s-maxage=${Math.floor((TTL[type] || 60_000) / 1000)}, stale-while-revalidate=60`);
    return json(res, 200, data);
  } catch (e) {
    console.error('[/api/live] unexpected crash:', e?.stack || e);
    try {
      return json(res, 500, { error: e?.message || 'unknown error' });
    } catch {
      res.status(500).end();
    }
  }
}
