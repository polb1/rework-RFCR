// Log d'accessos al panell d'administració.
// POST: registra un intent d'accés (permès o denegat) a data/access-log.json del repo.
// GET:  retorna els últims 100 intents (públic — cap dada sensible més enllà del correu).

const LOG_PATH = 'src/data/access-log.json';
const MAX_ENTRIES = 500;

export default async function handler(req, res) {
  const { GITHUB_TOKEN, GITHUB_REPO, GITHUB_BRANCH = 'main', GOOGLE_CLIENT_ID, ADMIN_EMAIL } = process.env;
  const missing = [];
  if (!GITHUB_TOKEN) missing.push('GITHUB_TOKEN');
  if (!GITHUB_REPO) missing.push('GITHUB_REPO');
  if (missing.length) {
    console.error('[api/access] Env vars missing:', missing);
    return res.status(500).json({ error: 'Config incompleta', missing });
  }

  try {
    if (req.method === 'GET') return await handleGet(res, GITHUB_TOKEN, GITHUB_REPO, GITHUB_BRANCH);
    if (req.method === 'POST') return await handlePost(req, res, { GITHUB_TOKEN, GITHUB_REPO, GITHUB_BRANCH, GOOGLE_CLIENT_ID, ADMIN_EMAIL });
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('[api/access] handler crash:', err);
    return res.status(500).json({ error: err.message });
  }
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

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') { try { return JSON.parse(req.body); } catch { return {}; } }
  return await new Promise((resolve) => {
    let raw = '';
    req.on('data', (c) => (raw += c));
    req.on('end', () => { try { resolve(JSON.parse(raw)); } catch { resolve({}); } });
    req.on('error', () => resolve({}));
  });
}

async function handlePost(req, res, { GITHUB_TOKEN, GITHUB_REPO, GITHUB_BRANCH, GOOGLE_CLIENT_ID, ADMIN_EMAIL }) {
  const body = await readBody(req);
  const { token, kind } = body;
  console.log('[api/access] POST received, has token:', !!token, 'kind:', kind);
  if (!token) return res.status(400).json({ error: 'Missing token' });

  // Validem que el token és realment de Google
  let claims;
  try {
    const tr = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(token)}`);
    const txt = await tr.text();
    if (!tr.ok) {
      console.error('[api/access] Google tokeninfo failed', tr.status, txt.slice(0, 200));
      return res.status(401).json({ error: 'Google token invàlid', google_status: tr.status, google_body: txt.slice(0, 200) });
    }
    claims = JSON.parse(txt);
  } catch (e) {
    console.error('[api/access] Google validation crash', e);
    return res.status(500).json({ error: 'Google validation crash', detail: e.message });
  }
  if (GOOGLE_CLIENT_ID && claims.aud !== GOOGLE_CLIENT_ID) {
    console.error('[api/access] Aud mismatch. Expected', GOOGLE_CLIENT_ID, 'got', claims.aud);
    return res.status(401).json({ error: 'Aud incorrecte', expected: GOOGLE_CLIENT_ID, got: claims.aud });
  }

  const allowed = (ADMIN_EMAIL || '').split(',').map(e => e.trim().toLowerCase()).includes((claims.email || '').toLowerCase());

  const entry = {
    email: claims.email || 'desconegut',
    name: claims.name || null,
    picture: claims.picture || null,
    allowed,
    kind: kind || 'login-attempt',
    ip: req.headers['x-forwarded-for']?.split(',')[0]?.trim() || null,
    ua: req.headers['user-agent'] || null,
    at: new Date().toISOString(),
  };

  try {
    await appendEntry(entry, GITHUB_TOKEN, GITHUB_REPO, GITHUB_BRANCH);
    console.log('[api/access] entry appended for', entry.email, 'allowed=', allowed);
  } catch (err) {
    console.error('[api/access] appendEntry failed:', err.message, err.stack);
    return res.status(500).json({ error: 'appendEntry failed', detail: err.message });
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
