import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './PlayerCarousel.module.css';

const CAT_LABEL = {
  Porter: 'PORTERS',
  Defensa: 'DEFENSES',
  Migcampista: 'MIGCAMPISTES',
  Davanter: 'ATACANTS',
};

function formatBirth(iso, year) {
  if (iso) {
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
  }
  return year ? String(year) : '—';
}

export default function PlayerCarousel({ position, players }) {
  const [i, setI] = useState(0);
  const p = players[i];
  const prev = players[(i - 1 + players.length) % players.length];
  const go = (dir) => setI((i + dir + players.length) % players.length);

  return (
    <div className={styles.wrap}>
      <div className={styles.stage}>
        <img
          src={prev.photo}
          alt=""
          className={styles.ghost}
          aria-hidden="true"
        />

        <div className={styles.eyebrow} aria-hidden="true">{CAT_LABEL[position] || position}</div>

        <div className={styles.photoWrap}>
          <img
            key={p.id}
            src={p.photo}
            alt={p.name}
            className={styles.photo}
          />
          <span className={styles.number} aria-hidden="true">{p.number}</span>
        </div>

        <div className={styles.info}>
          <Link to={`/equip/${p.slug}`} className={styles.name}>
            {p.shortName || p.name}
          </Link>
          <dl className={styles.stats}>
            <div><dt>Posició</dt><dd>{p.positionDetail || p.position}</dd></div>
            {p.height && <div><dt>Alçada</dt><dd>{p.height} cm</dd></div>}
            {p.weight && <div><dt>Pes</dt><dd>{p.weight} Kg</dd></div>}
            {p.birthplace && <div><dt>Nascut a</dt><dd>{p.birthplace}</dd></div>}
            <div><dt>Data de naixement</dt><dd>{formatBirth(p.fullBirthdate, p.birthYear)}</dd></div>
            {p.foot && <div><dt>Cama</dt><dd>{p.foot}</dd></div>}
          </dl>
        </div>
      </div>

      <div className={styles.controls}>
        <button
          className={styles.ctrl}
          onClick={() => go(-1)}
          aria-label="Anterior"
          disabled={players.length < 2}
        >‹</button>
        <span className={styles.counter}>
          {String(i + 1).padStart(1, '0')} / {players.length}
        </span>
        <button
          className={styles.ctrl}
          onClick={() => go(1)}
          aria-label="Següent"
          disabled={players.length < 2}
        >›</button>
      </div>
    </div>
  );
}
