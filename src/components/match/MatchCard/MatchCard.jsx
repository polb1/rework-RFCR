import Badge from '../../ui/Badge/Badge.jsx';
import { formatDateShort, formatTime, resultOutcome } from '../../../utils/dates.js';
import styles from './MatchCard.module.css';

const OUTCOME_LABEL = { win: 'V', draw: 'E', loss: 'D' };

export default function MatchCard({ match }) {
  const outcome = resultOutcome(match);
  const played = match.status === 'played';
  const mapUrl = match.venue
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(match.venue + ', Espanya')}`
    : null;

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

      {match.venue && (
        <div className={styles.foot}>
          <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          {mapUrl ? (
            <a href={mapUrl} target="_blank" rel="noopener noreferrer" className={styles.venueLink}>
              {match.venue}
            </a>
          ) : (
            <span>{match.venue}</span>
          )}
          {!played && match.ticketsUrl && (
            <a href={match.ticketsUrl} target="_blank" rel="noopener noreferrer" className={styles.ticketsBtn}>
              🎟 Entrades
            </a>
          )}
        </div>
      )}
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
