import { useEffect, useState } from 'react';
import Badge from '../../ui/Badge/Badge.jsx';
import { formatDateLong, formatTime, diffParts } from '../../../utils/dates.js';
import styles from './NextMatch.module.css';

export default function NextMatch({ match }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!match) return null;
  const cd = diffParts(match.date, now);
  const ticketsUrl = match.ticketsUrl || 'https://reusfcreddis.compralaentrada.com/eventos/';

  return (
    <article className={styles.card}>
      <header className={styles.head}>
        <Badge variant="primary">{match.competition}</Badge>
        <Badge variant="dark">Jornada {match.matchday}</Badge>
        <Badge variant="accent">{match.isHome ? 'A casa' : 'A fora'}</Badge>
      </header>

      <div className={styles.vs}>
        <Team team={match.home} />
        <div className={styles.vsCenter}>
          <span className={styles.vsLabel}>VS</span>
          <span className={styles.time}>{formatTime(match.date)}</span>
        </div>
        <Team team={match.away} />
      </div>

      <p className={styles.meta}>
        <span>{formatDateLong(match.date)}</span>
        <span aria-hidden="true"> · </span>
        <span>{match.venue}</span>
      </p>

      <ul className={styles.countdown} aria-label="Compte enrere">
        <Unit value={cd.days} label="dies" />
        <Unit value={cd.hours} label="hores" />
        <Unit value={cd.minutes} label="min" />
        <Unit value={cd.seconds} label="seg" />
      </ul>

      <a href={ticketsUrl} target="_blank" rel="noopener" className={styles.cta}>
        Compra la teva entrada
      </a>
    </article>
  );
}

function Team({ team }) {
  return (
    <div className={styles.team}>
      <img src={team.badge} alt={`Escut ${team.name}`} className={styles.badge} loading="lazy" />
      <span className={styles.teamName}>{team.name}</span>
    </div>
  );
}

function Unit({ value, label }) {
  return (
    <li>
      <strong>{String(value).padStart(2, '0')}</strong>
      <span>{label}</span>
    </li>
  );
}
