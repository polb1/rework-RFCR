// Log d'accessos al panell d'administració.
// POST: registra un accés d'un administrador a src/data/access-log.json del repo.
// GET:  retorna els últims 100 accessos (només per a administradors).
// El repo és públic: mai guardem dades de persones que no són admins (ni IP ni navegador).

const LOG_PATH = 'src/data/access-log.json';
const MAX_ENTRIES = 500;

export default async function handler(req, res) {
  const { GITHUB_TOKEN, GITHUB_REPO, GITHUB_BRANCH = 'main', GOOGLE_CLIENT_ID, ADMIN_EMAIL } = process.env;
  if (!GITHUB_TOKEN || !GITHUB_REPO || !GOOGLE_CLIENT_ID || !ADMIN_EMAIL) {
    console.error('[api/access] Server not configured');
    return res.status(500).json({ error: 'Server not configured' });
  }
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.method === 'POST' ? await readBody(req) : {};
    const token = req.method === 'GET'
      ? (req.headers.authorization || '').replace(/^Bearer\s+/i, '')
      : body.token;
    const admin = await verifyAdmin(token, GOOGLE_CLIENT_ID, ADMIN_EMAIL);
    if (!admin) return res.status(403).json({ error: 'Not authorized' });

    if (req.method === 'GET') return await handleGet(res, GITHUB_TOKEN, GITHUB_REPO, GITHUB_BRANCH);

    await appendEntry({
      email: admin.email,
      name: admin.name || null,
      picture: admin.picture || null,
      allowed: true,
      kind: body.kind || 'login',
      at: new Date().toISOString(),
    }, GITHUB_TOKEN, GITHUB_REPO, GITHUB_BRANCH);
    return res.status(200).json({ ok: true, allowed: true });
  } catch (err) {
    console.error('[api/access] handler crash:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}

// Retorna les claims del token si és d'un admin; si no, null.
async function verifyAdmin(token, clientId, adminEmail) {
  if (!token) return null;
  const r = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(token)}`);
  if (!r.ok) return null;
  const claims = await r.json();
  if (claims.aud !== clientId) return null;
  if (claims.email_verified !== 'true' && claims.email_verified !== true) return null;
  const allowed = adminEmail.split(',').map(e => e.trim().toLowerCase());
  return allowed.includes((claims.email || '').toLowerCase()) ? claims : null;
}

async function handleGet(res, token, repo, branch) {
  const url = `https://api.github.com/repos/${repo}/contents/${LOG_PATH}?ref=${branch}`;
  const r = await fetch(url, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'User-Agent': 'rfcr-access' },
  });
  res.setHeader('Cache-Control', 'no-store');
  if (!r.ok) return res.status(200).json({ entries: [] });
  const j = await r.json();
  let entries;
  try { entries = JSON.parse(Buffer.from(j.content, 'base64').toString('utf8')); } catch { entries = []; }
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
      message: `chore(access): entra ${entry.email}`,
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
