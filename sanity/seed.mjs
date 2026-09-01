// Uploads local JSON data + images to Sanity.
// Usage:
//   1) npx sanity login
//   2) export SANITY_AUTH_TOKEN=<token amb permisos Editor>
//   3) VITE_SANITY_PROJECT_ID=xxx VITE_SANITY_DATASET=production node sanity/seed.mjs

import { createClient } from '@sanity/client';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const projectId = process.env.VITE_SANITY_PROJECT_ID;
const dataset = process.env.VITE_SANITY_DATASET || 'production';
const token = process.env.SANITY_AUTH_TOKEN;

if (!projectId || !token) {
  console.error('Falten VITE_SANITY_PROJECT_ID i/o SANITY_AUTH_TOKEN');
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: '2024-01-01', useCdn: false });

async function readJson(f) {
  return JSON.parse(await fs.readFile(path.join(root, 'src/data', f), 'utf8'));
}

async function uploadImage(relPath) {
  if (!relPath) return null;
  const full = path.join(root, 'public', relPath.replace(/^\//, ''));
  try {
    const buf = await fs.readFile(full);
    const asset = await client.assets.upload('image', buf, { filename: path.basename(full) });
    return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } };
  } catch (e) {
    console.warn('  · imatge no trobada:', relPath);
    return null;
  }
}

async function seedNews() {
  const items = await readJson('news.json');
  console.log(`▶ ${items.length} notícies`);
  for (const n of items) {
    const image = await uploadImage(n.image);
    const doc = {
      _type: 'news',
      _id: `news-${n.id}`,
      title: n.title,
      slug: { current: n.slug },
      excerpt: n.excerpt,
      body: (n.body || []).map(p => ({ _type: 'block', style: 'normal', children: [{ _type: 'span', text: p }] })),
      date: n.date,
      category: n.category,
      author: n.author,
      ...(image ? { image } : {}),
    };
    await client.createOrReplace(doc);
    console.log('  ✓', n.title.slice(0, 60));
  }
}

async function seedPlayers() {
  const items = await readJson('players.json');
  console.log(`▶ ${items.length} jugadors`);
  for (const p of items) {
    const photo = await uploadImage(p.photo);
    await client.createOrReplace({
      _type: 'player',
      _id: `player-${p.id}`,
      name: p.name,
      slug: { current: p.slug },
      number: p.number,
      position: p.position,
      birthYear: p.birthYear,
      nationality: p.nationality,
      ...(photo ? { photo } : {}),
    });
    console.log('  ✓', p.name);
  }
}

async function seedProducts() {
  const items = await readJson('products.json');
  console.log(`▶ ${items.length} productes`);
  for (const p of items) {
    const image = await uploadImage(p.image);
    await client.createOrReplace({
      _type: 'product',
      _id: `product-${p.id}`,
      name: p.name,
      slug: { current: p.slug },
      price: p.price,
      category: p.category,
      description: p.description,
      ...(image ? { image } : {}),
    });
    console.log('  ✓', p.name);
  }
}

async function seedSponsors() {
  const items = await readJson('sponsors.json');
  console.log(`▶ ${items.length} patrocinadors`);
  for (const s of items) {
    const logo = await uploadImage(s.logo);
    await client.createOrReplace({
      _type: 'sponsor',
      _id: `sponsor-${s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      name: s.name,
      url: s.url,
      tier: s.tier,
      ...(logo ? { logo } : {}),
    });
    console.log('  ✓', s.name);
  }
}

async function seedBoard() {
  const items = await readJson('board.json');
  console.log(`▶ ${items.length} membres directiva`);
  for (const [i, m] of items.entries()) {
    await client.createOrReplace({
      _type: 'boardMember',
      _id: `board-${i}`,
      name: m.name,
      role: m.role,
      order: i,
    });
  }
}

async function seedHistory() {
  const items = await readJson('history.json');
  console.log(`▶ ${items.length} entrades històriques`);
  for (const [i, h] of items.entries()) {
    await client.createOrReplace({
      _type: 'historyEntry',
      _id: `history-${i}`,
      year: h.year,
      title: h.title,
      text: h.text,
      order: i,
    });
  }
}

async function main() {
  console.log('Seeding Sanity…');
  await seedNews();
  await seedPlayers();
  await seedProducts();
  await seedSponsors();
  await seedBoard();
  await seedHistory();
  console.log('✅ Fet.');
}

main().catch(e => { console.error(e); process.exit(1); });
