import styles from './LeagueTable.module.css';

export default function LeagueTable({ rows, compact = false }) {
  return (
    <div className={styles.wrapper}>
      <table className={`${styles.table} ${compact ? styles.compact : ''}`}>
        <thead>
          <tr>
            <th className={styles.narrow}>#</th>
            <th className={styles.team}>Equip</th>
            <th>PJ</th>
            {!compact && <><th>G</th><th>E</th><th>P</th><th>GF</th><th>GC</th></>}
            <th>Pts</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.position} className={r.isSelf ? styles.self : ''}>
              <td className={styles.narrow}>{r.position}</td>
              <td className={styles.team}>{r.team}</td>
              <td>{r.played}</td>
              {!compact && <><td>{r.wins}</td><td>{r.draws}</td><td>{r.losses}</td><td>{r.gf}</td><td>{r.ga}</td></>}
              <td className={styles.points}>{r.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
