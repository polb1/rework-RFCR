// Vercel Serverless Function — proxy a API-Football amb caché
// GET /api/live?type=next|last|standings|live
//
// Env vars requerides:
//   APIFOOTBALL_KEY       - la teva clau (secret, mai al frontend)
//   APIFOOTBALL_LEAGUE_ID - ID de la Segunda Federación Grup 2 (numèric)
//   APIFOOTBALL_TEAM_ID   - ID del Reus FC Reddis (numèric)
//   APIFOOTBALL_SEASON    - any de la temporada (ex: "2026")

const BASE = 'https://v3.football.api-sports.io';

// Caché en memòria per serverless (persisteix mentre el lambda estigui calent)
const cache = new Map();
const TTL = {
  next: 5 * 60_000,       // 5 min — pròxim partit
  last: 5 * 60_000,       // 5 min — resultats recents
  standings: 15 * 60_000, // 15 min — classificació
  live: 30_000,           // 30s — partit en directe
};

async function apiFootball(path) {
  const key = process.env.APIFOOTBALL_KEY;
  if (!key) throw new Error('APIFOOTBALL_KEY not set');
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'x-apisports-key': key, 'Accept': 'application/json' },
  });
  if (!res.ok) throw new Error(`API-Football ${res.status}`);
  const data = await res.json();
  if (data.errors && Object.keys(data.errors).length > 0) {
    throw new Error(`API-Football errors: ${JSON.stringify(data.errors)}`);
  }
  return data.response;
}

function normalizeFixture(f) {
  return {
    id: `af-${f.fixture.id}`,
    competition: f.league.name,
    round: f.league.round,
    date: f.fixture.date,
    venue: f.fixture.venue?.name || '',
    status: f.fixture.status.short === 'FT' ? 'played'
          : ['1H','2H','HT','ET','P','LIVE','BT'].includes(f.fixture.status.short) ? 'live'
          : 'scheduled',
    home: {
      name: f.teams.home.name,
      shortName: f.teams.home.name.slice(0, 3).toUpperCase(),
      badge: f.teams.home.logo,
    },
    away: {
      name: f.teams.away.name,
      shortName: f.teams.away.name.slice(0, 3).toUpperCase(),
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

export default async function handler(req, res) {
  const type = (req.query?.type || 'next').toString();
  const leagueId = process.env.APIFOOTBALL_LEAGUE_ID;
  const teamId = process.env.APIFOOTBALL_TEAM_ID;
  const season = process.env.APIFOOTBALL_SEASON || String(new Date().getFullYear());

  if (!leagueId || !teamId) {
    return res.status(500).json({ error: 'APIFOOTBALL_LEAGUE_ID/APIFOOTBALL_TEAM_ID not set' });
  }

  const cacheKey = `${type}:${leagueId}:${teamId}:${season}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.at < TTL[type]) {
    res.setHeader('X-Cache', 'HIT');
    res.setHeader('Cache-Control', `s-maxage=${Math.floor(TTL[type] / 1000)}, stale-while-revalidate=60`);
    return res.status(200).json(cached.data);
  }

  try {
    let data;
    if (type === 'next') {
      const rows = await apiFootball(`/fixtures?team=${teamId}&league=${leagueId}&season=${season}&next=1`);
      data = rows[0] ? normalizeFixture(rows[0]) : null;
    } else if (type === 'last') {
      const rows = await apiFootball(`/fixtures?team=${teamId}&league=${leagueId}&season=${season}&last=5`);
      data = rows.map(normalizeFixture);
    } else if (type === 'live') {
      const rows = await apiFootball(`/fixtures?team=${teamId}&live=all`);
      data = rows[0] ? normalizeFixture(rows[0]) : null;
    } else if (type === 'standings') {
      const rows = await apiFootball(`/standings?league=${leagueId}&season=${season}`);
      const standings = rows[0]?.league?.standings?.[0] || [];
      data = standings.map(normalizeStanding);
    } else {
      return res.status(400).json({ error: 'invalid type' });
    }

    cache.set(cacheKey, { at: Date.now(), data });
    res.setHeader('X-Cache', 'MISS');
    res.setHeader('Cache-Control', `s-maxage=${Math.floor(TTL[type] / 1000)}, stale-while-revalidate=60`);
    return res.status(200).json(data);
  } catch (e) {
    if (cached) {
      res.setHeader('X-Cache', 'STALE');
      return res.status(200).json(cached.data);
    }
    return res.status(502).json({ error: e.message });
  }
}
