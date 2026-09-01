import { useParams, Link, Navigate } from 'react-router-dom';
import { useNews, useNewsItem } from '../../lib/useNews.js';
import Badge from '../../components/ui/Badge/Badge.jsx';
import NewsCard from '../../components/news/NewsCard/NewsCard.jsx';
import SectionHeader from '../../components/ui/SectionHeader/SectionHeader.jsx';
import Seo from '../../components/ui/Seo/Seo.jsx';
import { formatDateLong } from '../../utils/dates.js';
import styles from './NewsDetail.module.css';

export default function NewsDetail() {
  const { slug } = useParams();
  const { item, loading, error } = useNewsItem(slug);
  const { data: allNews } = useNews();

  if (loading) return <main className="container" style={{ padding: '4rem 0' }}><p>Carregant…</p></main>;
  if (!item && !loading && error === null) return <Navigate to="/actualitat" replace />;
  if (!item) return <Navigate to="/actualitat" replace />;

  const related = allNews
    .filter(n => n.slug !== slug && n.category === item.category)
    .slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: item.title,
    image: [item.image],
    datePublished: item.date,
    author: { '@type': 'Organization', name: item.author },
    publisher: { '@type': 'Organization', name: 'Reus FC Reddis' },
    articleSection: item.category,
  };

  return (
    <main className={styles.page}>
      <Seo title={item.title} description={item.excerpt} image={item.image} jsonLd={jsonLd} />
      <article>
        <div className={styles.hero}>
          <img src={item.image} alt="" className={styles.heroImg} />
          <div className={styles.heroOverlay} />
          <div className={`container ${styles.heroContent}`}>
            <Badge variant="primary">{item.category}</Badge>
            <h1 className={styles.title}>{item.title}</h1>
            <div className={styles.meta}>
              <time dateTime={item.date}>{formatDateLong(item.date)}</time>
              <span aria-hidden="true">·</span>
              <span>{item.author}</span>
            </div>
          </div>
        </div>

        <div className={`container ${styles.body}`}>
          <p className={styles.lead}>{item.excerpt}</p>
          {item.body?.map((p, i) => <p key={i} className={styles.para}>{p}</p>)}

          <div className={styles.back}>
            <Link to="/actualitat" className={styles.backLink}>← Torna a Actualitat</Link>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className={`container ${styles.related}`}>
          <SectionHeader eyebrow="Relacionades" title="Continua llegint" />
          <div className={styles.relatedGrid}>
            {related.map(n => <NewsCard key={n.id} item={n} />)}
          </div>
        </section>
      )}
    </main>
  );
}
