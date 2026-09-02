import standings from '../../data/standings.json';
import club from '../../data/club.json';
import LeagueTable from '../../components/match/LeagueTable/LeagueTable.jsx';
import Badge from '../../components/ui/Badge/Badge.jsx';
import { useLive } from '../../hooks/useLive.js';
import { mergeStandings } from '../../data/rfefTeamMap.js';
import styles from './Standings.module.css';

export default function Standings() {
  const live = useLive('/api/rfef');
  const rows = live.data?.standings?.length
    ? mergeStandings(live.data.standings, standings)
    : standings;
  const jornada = live.data?.jornada;
  const updated = live.updatedAt ? new Date(live.updatedAt).toLocaleString('ca-ES', { dateStyle: 'medium', timeStyle: 'short' }) : null;

  return (
    <main className={`container ${styles.page}`}>
      <header className={styles.head}>
        <Badge variant="primary">{club.competition} · {club.group}</Badge>
        <h1 className={styles.title}>Classificació</h1>
        <p className={styles.sub}>
          Temporada {club.season}
          {jornada && <> · Jornada {jornada}</>}
        </p>
      </header>

      <LeagueTable rows={rows} />

      <p className={styles.legend}>
        <span>PJ</span> Partits jugats · <span>G</span> Guanyats · <span>E</span> Empatats · <span>P</span> Perduts ·
        <span> GF</span> Gols a favor · <span>GC</span> Gols en contra · <span>Pts</span> Punts
      </p>

      <p className={styles.source}>
        {live.source === 'live'
          ? <>🟢 Dades oficials RFEF · actualitzat {updated}</>
          : live.error
            ? <>⚪ Dades locals (RFEF no disponible)</>
            : <>⚪ Dades locals</>}
      </p>
    </main>
  );
}
