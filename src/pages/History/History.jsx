import history from '../../data/history.json';
import Badge from '../../components/ui/Badge/Badge.jsx';
import styles from './History.module.css';

export default function History() {
  return (
    <main className={`container ${styles.page}`}>
      <header className={styles.head}>
        <Badge variant="primary">Club</Badge>
        <h1 className={styles.title}>Història</h1>
        <p className={styles.sub}>Un segle de futbol a Reus</p>
      </header>

      <ol className={styles.timeline}>
        {history.map((h, i) => (
          <li key={i} className={styles.item}>
            <div className={styles.year}>{h.year}</div>
            <div className={styles.content}>
              <h3 className={styles.itemTitle}>{h.title}</h3>
              <p className={styles.text}>{h.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </main>
  );
}
