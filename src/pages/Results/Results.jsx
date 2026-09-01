import matches from '../../data/matches.json';
import club from '../../data/club.json';
import MatchCard from '../../components/match/MatchCard/MatchCard.jsx';
import Badge from '../../components/ui/Badge/Badge.jsx';
import { resultOutcome } from '../../utils/dates.js';
import styles from './Results.module.css';

export default function Results() {
  const played = matches
    .filter(m => m.status === 'played')
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const totals = played.reduce((acc, m) => {
    const o = resultOutcome(m);
    if (o) acc[o]++;
    return acc;
  }, { win: 0, draw: 0, loss: 0 });

  return (
    <main className={`container ${styles.page}`}>
      <header className={styles.head}>
        <Badge variant="primary">{club.competition} · {club.group}</Badge>
        <h1 className={styles.title}>Resultats</h1>
        <p className={styles.sub}>Temporada {club.season}</p>
      </header>

      <div className={styles.stats}>
        <Stat label="Jugats" value={played.length} />
        <Stat label="Victòries" value={totals.win} tone="win" />
        <Stat label="Empats" value={totals.draw} tone="draw" />
        <Stat label="Derrotes" value={totals.loss} tone="loss" />
      </div>

      {played.length === 0
        ? <p className={styles.empty}>Encara no hi ha resultats.</p>
        : <div className={styles.list}>{played.map(m => <MatchCard key={m.id} match={m} />)}</div>}
    </main>
  );
}

function Stat({ label, value, tone }) {
  return (
    <div className={`${styles.stat} ${tone ? styles[tone] : ''}`}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}
