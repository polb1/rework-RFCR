import board from '../../data/board.json';
import Badge from '../../components/ui/Badge/Badge.jsx';
import SectionHeader from '../../components/ui/SectionHeader/SectionHeader.jsx';
import styles from './Board.module.css';

export default function Board() {
  const president = board.find(m => m.role === 'President');
  const rest = board.filter(m => m.role !== 'President');

  return (
    <main className={`container ${styles.page}`}>
      <header className={styles.head}>
        <Badge variant="primary">Club</Badge>
        <h1 className={styles.title}>Directiva</h1>
        <p className={styles.sub}>Junta directiva i àrees del club</p>
      </header>

      {president && (
        <section className={styles.section}>
          <SectionHeader eyebrow="Presidència" title={president.name} />
          <p className={styles.pres}>
            {president.name} lidera el projecte roig-i-negre com a president del Reus FC Reddis, treballant per consolidar el creixement esportiu i social del club.
          </p>
        </section>
      )}

      <section className={styles.section}>
        <SectionHeader eyebrow="Estructura" title="Junta i àrees" />
        <ul className={styles.grid}>
          {rest.map((m, i) => (
            <li key={i} className={styles.card}>
              <span className={styles.role}>{m.role}</span>
              <span className={styles.name}>{m.name}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
