import matches from '../../data/matches.json';
import club from '../../data/club.json';
import SectionHeader from '../../components/ui/SectionHeader/SectionHeader.jsx';
import MatchCard from '../../components/match/MatchCard/MatchCard.jsx';
import Badge from '../../components/ui/Badge/Badge.jsx';
import styles from './Calendar.module.css';

export default function Calendar() {
  const sorted = [...matches].sort((a, b) => new Date(a.date) - new Date(b.date));
  const upcoming = sorted.filter(m => m.status !== 'played');
  const played = sorted.filter(m => m.status === 'played').reverse();

  return (
    <main className={`container ${styles.page}`}>
      <header className={styles.head}>
        <Badge variant="primary">{club.competition} · {club.group}</Badge>
        <h1 className={styles.title}>Calendari</h1>
        <p className={styles.sub}>Temporada {club.season}</p>
      </header>

      <section>
        <SectionHeader eyebrow="Pendents" title={`Pròxims partits (${upcoming.length})`} />
        {upcoming.length === 0
          ? <p className={styles.empty}>No hi ha partits programats.</p>
          : <div className={styles.list}>{upcoming.map(m => <MatchCard key={m.id} match={m} />)}</div>}
      </section>

      <section className={styles.section}>
        <SectionHeader eyebrow="Jugats" title={`Resultats (${played.length})`} />
        {played.length === 0
          ? <p className={styles.empty}>Encara no hi ha resultats.</p>
          : <div className={styles.list}>{played.map(m => <MatchCard key={m.id} match={m} />)}</div>}
      </section>
    </main>
  );
}
