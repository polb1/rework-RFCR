import styles from './SponsorGrid.module.css';

// Ticker horitzontal de logos amb loop sense costures i pausa al hover.
// Duplica la llista per fer el loop infinit sense salt visual.
export default function SponsorGrid({ sponsors }) {
  const items = sponsors.map((s, i) => (
    <li key={s.name + i} className={styles.item}>
      <a href={s.url} target="_blank" rel="noopener" title={s.name} className={styles.link}>
        <img src={s.logo} alt={s.name} loading="lazy" className={styles.logo} />
      </a>
    </li>
  ));

  return (
    <div className={styles.viewport} role="region" aria-label="Patrocinadors">
      <ul className={styles.track} aria-hidden="false">
        {items}
      </ul>
      <ul className={styles.track} aria-hidden="true">
        {items}
      </ul>
    </div>
  );
}
