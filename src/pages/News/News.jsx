import { useMemo, useState } from 'react';
import { useNews } from '../../lib/useNews.js';
import SectionHeader from '../../components/ui/SectionHeader/SectionHeader.jsx';
import NewsCard from '../../components/news/NewsCard/NewsCard.jsx';
import Badge from '../../components/ui/Badge/Badge.jsx';
import Seo from '../../components/ui/Seo/Seo.jsx';
import styles from './News.module.css';

export default function News() {
  const [category, setCategory] = useState('all');
  const { data: news, loading } = useNews();

  const categories = useMemo(() => {
    const set = new Set(news.map(n => n.category));
    return ['all', ...Array.from(set)];
  }, [news]);

  const sorted = useMemo(
    () => [...news].sort((a, b) => new Date(b.date) - new Date(a.date)),
    [news]
  );

  const filtered = category === 'all'
    ? sorted
    : sorted.filter(n => n.category === category);

  return (
    <main className={`container ${styles.page}`}>
      <Seo title="Actualitat" description="Última hora, notícies i actualitat del Reus FC Reddis." />
      <header className={styles.head}>
        <Badge variant="primary">Notícies</Badge>
        <h1 className={styles.title}>Actualitat</h1>
        <p className={styles.sub}>Última hora del Reus FC Reddis</p>
      </header>

      <div className={styles.filters} role="tablist" aria-label="Filtre per categoria">
        {categories.map(cat => (
          <button
            key={cat}
            role="tab"
            aria-selected={category === cat}
            className={`${styles.filter} ${category === cat ? styles.filterActive : ''}`}
            onClick={() => setCategory(cat)}
          >
            {cat === 'all' ? 'Totes' : cat}
          </button>
        ))}
      </div>

      <SectionHeader eyebrow="Notícies" title={`${filtered.length} publicacions`} />

      {loading ? (
        <p className={styles.empty}>Carregant notícies…</p>
      ) : filtered.length === 0 ? (
        <p className={styles.empty}>No hi ha notícies d'aquesta categoria.</p>
      ) : (
        <div className={styles.grid}>
          {filtered.map(item => <NewsCard key={item.id} item={item} />)}
        </div>
      )}
    </main>
  );
}
