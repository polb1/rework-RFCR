import standings from '../../data/standings.json';
import club from '../../data/club.json';
import LeagueTable from '../../components/match/LeagueTable/LeagueTable.jsx';
import Badge from '../../components/ui/Badge/Badge.jsx';
import styles from './Standings.module.css';

export default function Standings() {
  return (
    <main className={`container ${styles.page}`}>
      <header className={styles.head}>
        <Badge variant="primary">{club.competition} · {club.group}</Badge>
        <h1 className={styles.title}>Classificació</h1>
        <p className={styles.sub}>Temporada {club.season}</p>
      </header>

      <LeagueTable rows={standings} />

      <p className={styles.legend}>
        <span>PJ</span> Partits jugats · <span>G</span> Guanyats · <span>E</span> Empatats · <span>P</span> Perduts ·
        <span> GF</span> Gols a favor · <span>GC</span> Gols en contra · <span>Pts</span> Punts
      </p>
    </main>
  );
}
