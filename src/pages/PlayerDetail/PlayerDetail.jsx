import { useParams, Link, Navigate } from 'react-router-dom';
import players from '../../data/players.json';
import club from '../../data/club.json';
import Badge from '../../components/ui/Badge/Badge.jsx';
import Seo from '../../components/ui/Seo/Seo.jsx';
import styles from './PlayerDetail.module.css';

export default function PlayerDetail() {
  const { slug } = useParams();
  const p = players.find(x => x.slug === slug);
  if (!p) return <Navigate to="/equip" replace />;

  const season = parseInt(String(club.season).slice(0, 4), 10) + 1;
  const age = season - p.birthYear;

  const teammates = players
    .filter(x => x.position === p.position && x.slug !== p.slug)
    .slice(0, 6);

  return (
    <main className={styles.page}>
      <Seo title={p.name} description={`${p.name} · Dorsal ${p.number} · ${p.position} del Reus FC Reddis temporada ${club.season}.`} />
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.photoBox}>
            <span className={styles.number}>{p.number}</span>
            <img src={p.photo} alt="" className={styles.photo} />
          </div>
          <div className={styles.info}>
            <Badge variant="primary">{p.position}</Badge>
            <h1 className={styles.name}>{p.name}</h1>
            <dl className={styles.stats}>
              <div><dt>Dorsal</dt><dd>#{p.number}</dd></div>
              <div><dt>Edat</dt><dd>{age} anys</dd></div>
              <div><dt>Any de naixement</dt><dd>{p.birthYear}</dd></div>
              <div><dt>Nacionalitat</dt><dd>{p.nationality}</dd></div>
              <div><dt>Temporada</dt><dd>{club.season}</dd></div>
            </dl>
            <Link to="/equip" className={styles.back}>← Torna a la plantilla</Link>
          </div>
        </div>
      </section>

      {teammates.length > 0 && (
        <section className={`container ${styles.related}`}>
          <h2 className={styles.relatedTitle}>Altres {p.position.toLowerCase()}s</h2>
          <div className={styles.relatedGrid}>
            {teammates.map(t => (
              <Link key={t.id} to={`/equip/${t.slug}`} className={styles.relatedCard}>
                <span className={styles.relatedNum}>{t.number}</span>
                <span className={styles.relatedName}>{t.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
