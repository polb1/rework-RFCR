// Log d'accessos al panell d'administració.
// POST: registra un intent d'accés (permès o denegat) a data/access-log.json del repo.
// GET:  retorna els últims 100 intents (públic — cap dada sensible més enllà del correu).

const LOG_PATH = 'src/data/access-log.json';
const MAX_ENTRIES = 500;

export default async function handler(req, res) {
  const { GITHUB_TOKEN, GITHUB_REPO, GITHUB_BRANCH = 'main', GOOGLE_CLIENT_ID, ADMIN_EMAIL } = process.env;
  if (!GITHUB_TOKEN || !GITHUB_REPO) return res.status(500).json({ error: 'Config incompleta' });

  if (req.method === 'GET') return handleGet(res, GITHUB_TOKEN, GITHUB_REPO, GITHUB_BRANCH);
  if (req.method === 'POST') return handlePost(req, res, { GITHUB_TOKEN, GITHUB_REPO, GITHUB_BRANCH, GOOGLE_CLIENT_ID, ADMIN_EMAIL });
  return res.status(405).json({ error: 'Method not allowed' });
}

async function handleGet(res, token, repo, branch) {
  const url = `https://api.github.com/repos/${repo}/contents/${LOG_PATH}?ref=${branch}`;
  const r = await fetch(url, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'User-Agent': 'rfcr-access' },
  });
  if (!r.ok) return res.status(200).json({ entries: [] });
  const j = await r.json();
  const content = Buffer.from(j.content, 'base64').toString('utf8');
  let entries;
  try { entries = JSON.parse(content); } catch { entries = []; }
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({ entries: entries.slice(-100).reverse() });
}

async function handlePost(req, res, { GITHUB_TOKEN, GITHUB_REPO, GITHUB_BRANCH, GOOGLE_CLIENT_ID, ADMIN_EMAIL }) {
  const { token } = req.body || {};
  if (!token) return res.status(400).json({ error: 'Missing token' });

  // Validem que el token és realment de Google (evita spam per l'endpoint)
  let claims;
  try {
    const tr = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(token)}`);
    if (!tr.ok) throw new Error('bad token');
    claims = await tr.json();
  } catch {
    return res.status(401).json({ error: 'Google token invàlid' });
  }
  if (GOOGLE_CLIENT_ID && claims.aud !== GOOGLE_CLIENT_ID) return res.status(401).json({ error: 'Aud incorrecte' });

  const allowed = (ADMIN_EMAIL || '').split(',').map(e => e.trim().toLowerCase()).includes((claims.email || '').toLowerCase());

  const entry = {
    email: claims.email || 'desconegut',
    name: claims.name || null,
    picture: claims.picture || null,
    allowed,
    ip: req.headers['x-forwarded-for']?.split(',')[0]?.trim() || null,
    ua: req.headers['user-agent'] || null,
    at: new Date().toISOString(),
  };

  try {
    await appendEntry(entry, GITHUB_TOKEN, GITHUB_REPO, GITHUB_BRANCH);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }

  return res.status(200).json({ ok: true, allowed });
}

async function appendEntry(entry, token, repo, branch) {
  const url = `https://api.github.com/repos/${repo}/contents/${LOG_PATH}`;
  const headers = { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'User-Agent': 'rfcr-access' };

  // Retry 1 cop si hi ha SHA conflict
  for (let attempt = 0; attempt < 2; attempt++) {
    const cur = await fetch(`${url}?ref=${branch}`, { headers });
    let entries = [], sha;
    if (cur.ok) {
      const j = await cur.json();
      sha = j.sha;
      try { entries = JSON.parse(Buffer.from(j.content, 'base64').toString('utf8')); } catch {}
    } else if (cur.status !== 404) {
      throw new Error(`GitHub GET ${cur.status}`);
    }
    entries.push(entry);
    if (entries.length > MAX_ENTRIES) entries = entries.slice(-MAX_ENTRIES);

    const body = {
      message: `chore(access): ${entry.allowed ? 'entra' : 'denegat'} ${entry.email}`,
      content: Buffer.from(JSON.stringify(entries, null, 2) + '\n', 'utf8').toString('base64'),
      branch,
      committer: { name: 'RFCR Access', email: 'access-bot@reusfcreddis' },
      ...(sha ? { sha } : {}),
    };
    const put = await fetch(url, { method: 'PUT', headers, body: JSON.stringify(body) });
    if (put.ok) return;
    if (put.status === 409 && attempt === 0) continue; // conflict, retry
    const text = await put.text();
    throw new Error(`GitHub PUT ${put.status}: ${text.slice(0, 200)}`);
  }
}
