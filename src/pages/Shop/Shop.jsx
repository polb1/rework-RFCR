import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import products from '../../data/products.json';
import Badge from '../../components/ui/Badge/Badge.jsx';
import SectionHeader from '../../components/ui/SectionHeader/SectionHeader.jsx';
import Seo from '../../components/ui/Seo/Seo.jsx';
import styles from './Shop.module.css';

const CATEGORY_LABELS = {
  all: 'Tots',
  equipacio: 'Equipacions',
  roba: 'Roba',
  accessoris: 'Accessoris',
  infantil: 'Infantil',
};

function ProductCard({ p }) {
  return (
    <Link to={`/botiga/${p.slug}`} className={styles.card}>
      <div className={styles.imgWrap}>
        <img src={p.image} alt="" className={styles.img} loading="lazy" />
      </div>
      <div className={styles.body}>
        <span className={styles.cat}>{CATEGORY_LABELS[p.category]}</span>
        <h3 className={styles.name}>{p.name}</h3>
        <span className={styles.price}>{p.price.toFixed(2)} €</span>
      </div>
    </Link>
  );
}

export default function Shop() {
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('name');

  const categories = useMemo(() => {
    const set = new Set(products.map(p => p.category));
    return ['all', ...Array.from(set)];
  }, []);

  const filtered = useMemo(() => {
    let list = products;
    if (category !== 'all') list = list.filter(p => p.category === category);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q));
    }
    const sorted = [...list];
    if (sort === 'priceAsc') sorted.sort((a, b) => a.price - b.price);
    else if (sort === 'priceDesc') sorted.sort((a, b) => b.price - a.price);
    else sorted.sort((a, b) => a.name.localeCompare(b.name, 'ca'));
    return sorted;
  }, [category, query, sort]);

  return (
    <main className={`container ${styles.page}`}>
      <Seo title="Botiga oficial" description="Equipacions, roba i accessoris oficials del Reus FC Reddis." />
      <header className={styles.head}>
        <Badge variant="primary">Botiga</Badge>
        <h1 className={styles.title}>Botiga oficial</h1>
        <p className={styles.sub}>Equipacions, roba i accessoris del Reus FC Reddis</p>
      </header>

      <div className={styles.toolbar}>
        <div className={styles.filters} role="tablist" aria-label="Categoria">
          {categories.map(c => (
            <button
              key={c}
              role="tab"
              aria-selected={category === c}
              className={`${styles.filter} ${category === c ? styles.active : ''}`}
              onClick={() => setCategory(c)}
            >{CATEGORY_LABELS[c]}</button>
          ))}
        </div>
        <div className={styles.controls}>
          <input
            className={styles.search}
            type="search"
            placeholder="Cerca…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            aria-label="Cerca de productes"
          />
          <select
            className={styles.sort}
            value={sort}
            onChange={e => setSort(e.target.value)}
            aria-label="Ordenar"
          >
            <option value="name">Nom (A-Z)</option>
            <option value="priceAsc">Preu ↑</option>
            <option value="priceDesc">Preu ↓</option>
          </select>
        </div>
      </div>

      <SectionHeader eyebrow="Productes" title={`${filtered.length} resultats`} />

      {filtered.length === 0 ? (
        <p className={styles.empty}>No hi ha productes que coincideixin.</p>
      ) : (
        <div className={styles.grid}>
          {filtered.map(p => <ProductCard key={p.id} p={p} />)}
        </div>
      )}
    </main>
  );
}
