import { resultOutcome } from '../../../utils/dates.js';
import styles from './RecentForm.module.css';

const LABEL = { win: 'V', draw: 'E', loss: 'D' };
const CLASS = { win: styles.win, draw: styles.draw, loss: styles.loss };

// Últims N partits jugats, resultat visual amb pastilles V/E/D
export default function RecentForm({ matches, count = 5, label = 'Últims partits' }) {
  const played = matches
    .filter(m => m.status === 'played')
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, count);

  if (played.length === 0) return null;

  return (
    <div className={styles.wrap}>
      {label && <span className={styles.label}>{label}</span>}
      <ol className={styles.list} aria-label="Ratxa dels últims partits">
        {played.map(m => {
          const o = resultOutcome(m);
          if (!o) return null;
          return (
            <li key={m.id} className={`${styles.pill} ${CLASS[o]}`} title={`J${m.matchday} · ${m.home.shortName} ${m.homeScore}-${m.awayScore} ${m.away.shortName}`}>
              {LABEL[o]}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
