import styles from './SponsorGrid.module.css';

export default function SponsorGrid({ sponsors }) {
  return (
    <ul className={styles.grid}>
      {sponsors.map(s => (
        <li key={s.name} className={styles.item}>
          <a href={s.url} target="_blank" rel="noopener" title={s.name} className={styles.link}>
            <img src={s.logo} alt={s.name} loading="lazy" className={styles.logo} />
          </a>
        </li>
      ))}
    </ul>
  );
}
