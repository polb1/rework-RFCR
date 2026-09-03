import styles from './InstagramTeaser.module.css';

// Bloc "segueix-nos a Instagram" — zero dependències, zero embed pesat.
// Mostra un mosaic visual amb tiles clickables (obren l'IG a nova pestanya).
// Substituïbles per posts reals quan tinguem accés a l'API oficial.

const TILES = [
  '/assets/hero/aficio.webp',
  '/assets/news/costenic-2026-27.webp',
  '/assets/news/samarreta-gaudi.jpeg',
  '/assets/hero/stadium.jpg',
  '/assets/news/copa-del-rey.webp',
  '/assets/news/kosner.webp',
];

const IG_URL = 'https://instagram.com/reusfcr/';

export default function InstagramTeaser() {
  return (
    <section className={styles.section} aria-labelledby="ig-heading">
      <div className={`container ${styles.inner}`}>
        <div className={styles.head}>
          <span className={styles.eyebrow}>Xarxes socials</span>
          <h2 id="ig-heading" className={styles.title}>Segueix-nos a Instagram</h2>
          <p className={styles.sub}>Les millors imatges del dia a dia del club, entrenaments i partits.</p>
          <a href={IG_URL} target="_blank" rel="noopener noreferrer" className={styles.handle}>
            @reusfcr →
          </a>
        </div>
        <div className={styles.grid}>
          {TILES.map((src, i) => (
            <a key={i} href={IG_URL} target="_blank" rel="noopener noreferrer" className={styles.tile} aria-label="Obrir Instagram del Reus FC Reddis">
              <img src={src} alt="" loading="lazy" />
              <span className={styles.overlay} aria-hidden="true">📷</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
