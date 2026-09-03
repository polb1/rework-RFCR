import { useParams, Link } from 'react-router-dom';
import matches from '../../data/matches.json';
import club from '../../data/club.json';
import Badge from '../../components/ui/Badge/Badge.jsx';
import Button from '../../components/ui/Button/Button.jsx';
import Seo from '../../components/ui/Seo/Seo.jsx';
import { formatDateLong, formatTime, diffParts, resultOutcome } from '../../utils/dates.js';
import { useEffect, useState } from 'react';
import styles from './MatchDetail.module.css';

export default function MatchDetail() {
  const { id } = useParams();
  const match = matches.find(m => m.id === id);

  if (!match) {
    return (
      <main className={`container ${styles.notFound}`}>
        <h1>Partit no trobat</h1>
        <p>El partit amb id <code>{id}</code> no existeix.</p>
        <Button as={Link} to="/calendari" variant="primary">Veure calendari</Button>
      </main>
    );
  }

  const played = match.status === 'played';
  const outcome = resultOutcome(match);
  const outcomeLabel = { win: 'Victòria', draw: 'Empat', loss: 'Derrota' }[outcome];
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(match.venue + ', Espanya')}`;
  const rival = match.isHome ? match.away : match.home;

  // Head-to-head bàsic amb partits jugats contra el mateix rival
  const h2h = matches.filter(m =>
    m.id !== match.id &&
    m.status === 'played' &&
    (m.home.name === rival.name || m.away.name === rival.name)
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: `${match.home.name} vs ${match.away.name}`,
    startDate: match.date,
    eventStatus: played ? 'https://schema.org/EventScheduled' : 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: match.venue,
      address: match.venue,
    },
    homeTeam: { '@type': 'SportsTeam', name: match.home.name },
    awayTeam: { '@type': 'SportsTeam', name: match.away.name },
    ...(played ? {
      awayScore: match.awayScore,
      homeScore: match.homeScore,
    } : {}),
    ...(match.ticketsUrl ? {
      offers: {
        '@type': 'Offer',
        url: match.ticketsUrl,
        availability: 'https://schema.org/InStock',
      },
    } : {}),
  };

  return (
    <>
      <Seo
        title={`${match.home.shortName} vs ${match.away.shortName} · Jornada ${match.matchday}`}
        description={`${club.competition} · Jornada ${match.matchday} · ${match.home.name} contra ${match.away.name} al ${match.venue}.`}
        jsonLd={jsonLd}
      />

      <main>
        <section className={styles.hero}>
          <div className={`container ${styles.heroInner}`}>
            <nav className={styles.crumbs} aria-label="Ubicació">
              <Link to="/">Inici</Link>
              <span aria-hidden="true"> / </span>
              <Link to="/calendari">Calendari</Link>
              <span aria-hidden="true"> / </span>
              <span>Jornada {match.matchday}</span>
            </nav>

            <header className={styles.head}>
              <Badge variant="primary">{match.competition}</Badge>
              <Badge variant="dark">Jornada {match.matchday}</Badge>
              <Badge variant="accent">{match.isHome ? 'A casa' : 'A fora'}</Badge>
              {played && outcome && <Badge variant={outcome}>{outcomeLabel}</Badge>}
              {!played && <LiveBadge date={match.date} />}
            </header>

            <div className={styles.vs}>
              <TeamSide team={match.home} />
              <div className={styles.center}>
                {played ? (
                  <>
                    <span className={styles.score}>{match.homeScore}</span>
                    <span className={styles.dash}>–</span>
                    <span className={styles.score}>{match.awayScore}</span>
                  </>
                ) : (
                  <>
                    <span className={styles.time}>{formatTime(match.date)}</span>
                    <span className={styles.vsLabel}>VS</span>
                  </>
                )}
              </div>
              <TeamSide team={match.away} />
            </div>

            <p className={styles.meta}>
              📅 {formatDateLong(match.date)}
            </p>
            <p className={styles.meta}>
              📍 <a href={mapUrl} target="_blank" rel="noopener noreferrer" className={styles.venueLink}>{match.venue}</a>
            </p>

            {!played && match.ticketsUrl && (
              <a href={match.ticketsUrl} target="_blank" rel="noopener noreferrer" className={styles.ticketsCta}>
                🎟 Compra la teva entrada
              </a>
            )}

            {!played && <Countdown date={match.date} />}
          </div>
        </section>

        {h2h.length > 0 && (
          <section className={`container ${styles.section}`}>
            <h2>Historial contra {rival.name}</h2>
            <ul className={styles.h2hList}>
              {h2h.map(m => (
                <li key={m.id} className={styles.h2hItem}>
                  <Link to={`/partit/${m.id}`}>
                    <span>{m.home.shortName}</span>
                    <strong>{m.homeScore} – {m.awayScore}</strong>
                    <span>{m.away.shortName}</span>
                    <em>J{m.matchday}</em>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </>
  );
}

function TeamSide({ team }) {
  return (
    <div className={styles.side}>
      <img src={team.badge} alt="" className={styles.badge} />
      <span className={styles.teamName}>{team.name}</span>
    </div>
  );
}

function LiveBadge({ date }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);
  const start = new Date(date).getTime();
  const isLive = now >= start && now < start + 2 * 60 * 60 * 1000;
  if (!isLive) return null;
  return <span className={styles.live}>🔴 EN VIU</span>;
}

function Countdown({ date }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const cd = diffParts(date, now);
  if (cd.total === 0) return null;
  return (
    <ul className={styles.countdown} aria-label="Compte enrere">
      {[
        ['dies', cd.days],
        ['hores', cd.hours],
        ['min', cd.minutes],
        ['seg', cd.seconds],
      ].map(([label, val]) => (
        <li key={label}>
          <strong>{String(val).padStart(2, '0')}</strong>
          <span>{label}</span>
        </li>
      ))}
    </ul>
  );
}
