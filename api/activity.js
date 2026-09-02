// Retorna els últims commits d'edició (admin + bot RFEF) del repo,
// parsejats a format amigable per mostrar al panell d'administració.

const FILE_LABELS = {
  'matches.json':    { icon: '⚽', label: 'Partits' },
  'standings.json':  { icon: '🏆', label: 'Classificació' },
  'news.json':       { icon: '📰', label: 'Notícies' },
  'players.json':    { icon: '👥', label: 'Plantilla' },
  'products.json':   { icon: '🛍️', label: 'Botiga' },
  'sponsors.json':   { icon: '🤝', label: 'Patrocinadors' },
  'club.json':       { icon: '🏟️', label: 'Info del club' },
  'board.json':      { icon: '👔', label: 'Directiva' },
  'history.json':    { icon: '📖', label: 'Història' },
  'navigation.js':   { icon: '🧭', label: 'Navegació' },
};

function humanFile(msg) {
  const m = msg.match(/update ([a-z0-9_-]+\.(?:json|js))/i);
  if (m) {
    const key = FILE_LABELS[m[1]];
    if (key) return key;
  }
  return { icon: '📝', label: msg.replace(/^(admin|chore|feat|fix|docs)(\(.*?\))?:\s*/i, '').slice(0, 60) };
}

function classify(commit) {
  const msg = commit.commit.message.split('\n')[0];
  const authorEmail = commit.commit.author?.email || '';
  const committerEmail = commit.commit.committer?.email || '';
  const authorName = commit.commit.author?.name || '';

  if (/^admin:/i.test(msg)) return { source: 'admin', who: authorEmail || authorName };
  if (authorName === 'rfcr-bot' || committerEmail.includes('bot@reusfcreddis')) return { source: 'bot', who: 'Actualització automàtica RFEF' };
  if (/actualització automàtica calendari RFEF/i.test(msg)) return { source: 'bot', who: 'Actualització automàtica RFEF' };
  return null;
}

export default async function handler(req, res) {
  const { GITHUB_TOKEN, GITHUB_REPO } = process.env;
  if (!GITHUB_REPO) return res.status(500).json({ error: 'GITHUB_REPO no configurat' });

  const url = `https://api.github.com/repos/${GITHUB_REPO}/commits?per_page=40`;
  const headers = {
    'Accept': 'application/vnd.github+json',
    'User-Agent': 'rfcr-activity',
    ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
  };

  try {
    const r = await fetch(url, { headers });
    if (!r.ok) return res.status(502).json({ error: `GitHub ${r.status}` });
    const commits = await r.json();

    const events = [];
    for (const c of commits) {
      const kind = classify(c);
      if (!kind) continue;
      const firstLine = c.commit.message.split('\n')[0];
      const file = humanFile(firstLine);
      events.push({
        sha: c.sha.slice(0, 7),
        when: c.commit.author?.date || c.commit.committer?.date,
        source: kind.source,
        who: kind.who,
        icon: file.icon,
        label: file.label,
      });
    }

    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ events });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
