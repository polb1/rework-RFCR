// Genera public/sitemap.xml a partir de les rutes estàtiques + dades dinàmiques.
// S'executa a `prebuild` (afegit a package.json).

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'public', 'sitemap.xml');
const BASE = 'https://reusfcreddis.polb.dev';

const STATIC_ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/actualitat', priority: '0.9', changefreq: 'daily' },
  { path: '/calendari', priority: '0.9', changefreq: 'weekly' },
  { path: '/resultats', priority: '0.9', changefreq: 'weekly' },
  { path: '/classificacio', priority: '0.9', changefreq: 'weekly' },
  { path: '/equip', priority: '0.8', changefreq: 'monthly' },
  { path: '/estadi', priority: '0.6', changefreq: 'yearly' },
  { path: '/historia', priority: '0.5', changefreq: 'yearly' },
  { path: '/directiva', priority: '0.5', changefreq: 'yearly' },
  { path: '/patrocinadors', priority: '0.6', changefreq: 'monthly' },
  { path: '/contacte', priority: '0.7', changefreq: 'yearly' },
  { path: '/botiga', priority: '0.8', changefreq: 'weekly' },
  { path: '/aficio', priority: '0.6', changefreq: 'monthly' },
  { path: '/benvingut-visitant', priority: '0.5', changefreq: 'monthly' },
  { path: '/fes-te-soci', priority: '0.9', changefreq: 'monthly' },
  { path: '/empresa-roig-i-negra', priority: '0.6', changefreq: 'yearly' },
  { path: '/avis-legal', priority: '0.2', changefreq: 'yearly' },
  { path: '/politica-de-privadesa', priority: '0.2', changefreq: 'yearly' },
  { path: '/politica-de-cookies', priority: '0.2', changefreq: 'yearly' },
  { path: '/condicions-de-venda', priority: '0.2', changefreq: 'yearly' },
];

const today = new Date().toISOString().slice(0, 10);

async function loadJson(p) {
  return JSON.parse(await readFile(path.join(ROOT, 'src/data', p), 'utf8'));
}

function url(loc, lastmod = today, priority = '0.5', changefreq = 'monthly') {
  return `  <url>
    <loc>${BASE}${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

(async () => {
  const [news, players, matches, products] = await Promise.all([
    loadJson('news.json'),
    loadJson('players.json'),
    loadJson('matches.json'),
    loadJson('products.json'),
  ]);

  const entries = [
    ...STATIC_ROUTES.map(r => url(r.path, today, r.priority, r.changefreq)),
    ...news.map(n => url(`/actualitat/${n.slug}`, n.date, '0.7', 'monthly')),
    ...players.map(p => url(`/equip/${p.slug}`, today, '0.6', 'monthly')),
    ...matches.map(m => url(`/partit/${m.id}`, m.date.slice(0, 10), '0.7', 'weekly')),
    ...products.map(p => url(`/botiga/${p.slug}`, today, '0.5', 'monthly')),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`;
  await writeFile(OUT, xml);
  console.log(`sitemap.xml → ${entries.length} URLs`);
})();
