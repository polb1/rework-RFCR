// Vercel Serverless Function
// POST { token, file, content }
// Verifies Google ID token, checks email whitelist, commits JSON to GitHub.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token, file, content } = req.body || {};
  if (!token || !file || content === undefined) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  if (!/^[a-z0-9_-]+\.json$/i.test(file)) {
    return res.status(400).json({ error: 'Invalid filename' });
  }

  const {
    GOOGLE_CLIENT_ID,
    ADMIN_EMAIL,
    GITHUB_TOKEN,
    GITHUB_REPO,           // "owner/repo"
    GITHUB_BRANCH = 'main',
  } = process.env;

  if (!GOOGLE_CLIENT_ID || !ADMIN_EMAIL || !GITHUB_TOKEN || !GITHUB_REPO) {
    return res.status(500).json({ error: 'Server not configured' });
  }

  // 1) Verify Google ID token
  let claims;
  try {
    const r = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(token)}`);
    if (!r.ok) throw new Error('Google tokeninfo failed');
    claims = await r.json();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid Google token' });
  }
  if (claims.aud !== GOOGLE_CLIENT_ID) return res.status(401).json({ error: 'Wrong audience' });
  if (claims.email_verified !== 'true' && claims.email_verified !== true) return res.status(401).json({ error: 'Email not verified' });
  const allowed = ADMIN_EMAIL.split(',').map(e => e.trim().toLowerCase());
  if (!allowed.includes((claims.email || '').toLowerCase())) return res.status(403).json({ error: 'Not authorized' });

  // 2) Commit to GitHub
  const path = `src/data/${file}`;
  const apiBase = `https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`;
  const headers = {
    'Authorization': `Bearer ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github+json',
    'User-Agent': 'rfcr-admin',
  };

  // Get current sha (if exists)
  let sha;
  const cur = await fetch(`${apiBase}?ref=${GITHUB_BRANCH}`, { headers });
  if (cur.ok) {
    const j = await cur.json();
    sha = j.sha;
  } else if (cur.status !== 404) {
    return res.status(500).json({ error: `GitHub get failed (${cur.status})` });
  }

  const body = {
    message: `admin: update ${file} (${claims.email})`,
    content: Buffer.from(JSON.stringify(content, null, 2) + '\n', 'utf8').toString('base64'),
    branch: GITHUB_BRANCH,
    committer: { name: 'RFCR Admin', email: claims.email },
    ...(sha ? { sha } : {}),
  };
  const put = await fetch(apiBase, { method: 'PUT', headers, body: JSON.stringify(body) });
  if (!put.ok) {
    const t = await put.text();
    return res.status(500).json({ error: `GitHub put failed: ${t.slice(0, 200)}` });
  }
  const result = await put.json();
  return res.status(200).json({ ok: true, commit: result.commit?.sha });
}
