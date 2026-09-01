import Badge from '../../ui/Badge/Badge.jsx';
import { formatDateShort, formatTime, resultOutcome } from '../../../utils/dates.js';
import styles from './MatchCard.module.css';

const OUTCOME_LABEL = { win: 'V', draw: 'E', loss: 'D' };

export default function MatchCard({ match }) {
  const outcome = resultOutcome(match);
  const played = match.status === 'played';

  return (
    <article className={styles.card}>
      <div className={styles.head}>
        <span className={styles.matchday}>J{match.matchday}</span>
        <span className={styles.date}>{formatDateShort(match.date)}</span>
        {played && outcome && <Badge variant={outcome}>{OUTCOME_LABEL[outcome]}</Badge>}
      </div>

      <div className={styles.row}>
        <Side team={match.home} />
        <div className={styles.score}>
          {played
            ? <span>{match.homeScore} <em>–</em> {match.awayScore}</span>
            : <span className={styles.time}>{formatTime(match.date)}</span>}
        </div>
        <Side team={match.away} align="right" />
      </div>
    </article>
  );
}

function Side({ team, align = 'left' }) {
  return (
    <div className={`${styles.side} ${align === 'right' ? styles.right : ''}`}>
      <img src={team.badge} alt="" className={styles.badge} loading="lazy" />
      <span className={styles.name}>{team.shortName}</span>
    </div>
  );
}
