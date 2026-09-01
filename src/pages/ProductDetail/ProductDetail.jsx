import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import products from '../../data/products.json';
import Badge from '../../components/ui/Badge/Badge.jsx';
import SectionHeader from '../../components/ui/SectionHeader/SectionHeader.jsx';
import Seo from '../../components/ui/Seo/Seo.jsx';
import styles from './ProductDetail.module.css';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function ProductDetail() {
  const { slug } = useParams();
  const p = products.find(x => x.slug === slug);
  const [size, setSize] = useState('M');
  const [qty, setQty] = useState(1);

  if (!p) return <Navigate to="/botiga" replace />;

  const related = products.filter(x => x.category === p.category && x.slug !== p.slug).slice(0, 4);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    image: [p.image],
    description: p.description,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      price: p.price,
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <main className={`container ${styles.page}`}>
      <Seo title={p.name} description={p.description} image={p.image} jsonLd={jsonLd} />
      <nav className={styles.crumbs}>
        <Link to="/botiga">Botiga</Link>
        <span aria-hidden="true">/</span>
        <span>{p.name}</span>
      </nav>

      <div className={styles.layout}>
        <div className={styles.gallery}>
          <img src={p.image} alt={p.name} className={styles.img} />
        </div>

        <div className={styles.info}>
          <Badge variant="primary">{p.category}</Badge>
          <h1 className={styles.title}>{p.name}</h1>
          <p className={styles.price}>{p.price.toFixed(2)} €</p>
          <p className={styles.desc}>{p.description}</p>

          <div className={styles.field}>
            <span className={styles.label}>Talla</span>
            <div className={styles.sizes} role="radiogroup" aria-label="Talla">
              {SIZES.map(s => (
                <button
                  key={s}
                  role="radio"
                  aria-checked={size === s}
                  className={`${styles.size} ${size === s ? styles.sizeActive : ''}`}
                  onClick={() => setSize(s)}
                >{s}</button>
              ))}
            </div>
          </div>

          <div className={styles.field}>
            <span className={styles.label}>Quantitat</span>
            <div className={styles.qty}>
              <button onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Menys">−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(q => q + 1)} aria-label="Més">+</button>
            </div>
          </div>

          <button className={styles.cta}>Afegir a la cistella</button>
          <p className={styles.hint}>Botiga demo · sense pagament real.</p>
        </div>
      </div>

      {related.length > 0 && (
        <section className={styles.related}>
          <SectionHeader eyebrow="També t'agradarà" title="Productes relacionats" />
          <div className={styles.relatedGrid}>
            {related.map(r => (
              <Link key={r.id} to={`/botiga/${r.slug}`} className={styles.relCard}>
                <img src={r.image} alt="" className={styles.relImg} loading="lazy" />
                <div className={styles.relBody}>
                  <span className={styles.relName}>{r.name}</span>
                  <span className={styles.relPrice}>{r.price.toFixed(2)} €</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
