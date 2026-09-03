// Genera public/feed.xml (RSS 2.0) a partir de news.json.
// S'executa a `prebuild` conjuntament amb el sitemap.

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const BASE = 'https://reusfcreddis.polb.dev';

function escape(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

(async () => {
  const news = JSON.parse(await readFile(path.join(ROOT, 'src/data/news.json'), 'utf8'));
  const sorted = [...news].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 30);

  const items = sorted.map(n => `    <item>
      <title>${escape(n.title)}</title>
      <link>${BASE}/actualitat/${n.slug}</link>
      <guid isPermaLink="true">${BASE}/actualitat/${n.slug}</guid>
      <pubDate>${new Date(n.date).toUTCString()}</pubDate>
      <category>${escape(n.category || 'General')}</category>
      <description>${escape(n.excerpt || '')}</description>
      ${n.image ? `<enclosure url="${BASE}${n.image}" type="image/webp"/>` : ''}
    </item>`).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Reus FC Reddis · Actualitat</title>
    <link>${BASE}/actualitat</link>
    <atom:link href="${BASE}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Notícies oficials del Reus FC Reddis · Segona Federació Grup 2</description>
    <language>ca</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;
  await writeFile(path.join(ROOT, 'public', 'feed.xml'), xml);
  console.log(`feed.xml → ${sorted.length} items`);
})();
