import { useState } from 'react';
import history from '../../data/history.json';
import Badge from '../../components/ui/Badge/Badge.jsx';
import Lightbox from '../../components/ui/Lightbox/Lightbox.jsx';
import styles from './History.module.css';

export default function History() {
  const [lightbox, setLightbox] = useState(null);

  return (
    <main className={`container ${styles.page}`}>
      <Lightbox src={lightbox} onClose={() => setLightbox(null)} />

      <header className={styles.head}>
        <Badge variant="primary">Club</Badge>
        <h1 className={styles.title}>Història</h1>
        <p className={styles.sub}>Un segle de futbol a Reus</p>
      </header>

      <ol className={styles.entries}>
        {history.map((h, i) => (
          <li key={i} className={styles.entry}>
            <div className={styles.marker} aria-hidden="true">
              <span className={styles.dot} />
              <span className={styles.line} />
            </div>
            <div className={styles.content}>
              <span className={styles.year}>{h.year}</span>
              <h3 className={styles.entryTitle}>{h.title}</h3>
              <p className={styles.text}>{h.text}</p>
              {h.image && (
                <button type="button" className={styles.entryImgWrap} onClick={() => setLightbox(h.image)} aria-label={`Ampliar imatge ${h.year}`}>
                  <img src={h.image} alt="" loading="lazy" className={styles.entryImg} />
                  <span className={styles.entryZoom} aria-hidden="true">🔍</span>
                </button>
              )}
            </div>
          </li>
        ))}
      </ol>
    </main>
  );
}
