import { Link } from 'react-router-dom';
import players from '../../data/players.json';
import staff from '../../data/staff.json';
import club from '../../data/club.json';
import SectionHeader from '../../components/ui/SectionHeader/SectionHeader.jsx';
import Badge from '../../components/ui/Badge/Badge.jsx';
import Seo from '../../components/ui/Seo/Seo.jsx';
import CircularGallery from '../../components/gallery/CircularGallery.jsx';
import styles from './Team.module.css';

const POSITIONS = ['Porter', 'Defensa', 'Migcampista', 'Davanter'];
const POSITION_LABELS = {
  Porter: 'Porters',
  Defensa: 'Defenses',
  Migcampista: 'Migcampistes',
  Davanter: 'Davanters',
};

function PlayerCard({ p, season }) {
  const age = season - p.birthYear;
  return (
    <Link to={`/equip/${p.slug}`} className={styles.card}>
      <div className={styles.photoWrap}>
        <span className={styles.number}>{p.number}</span>
        <img src={p.photo} alt="" className={styles.photo} loading="lazy" />
      </div>
      <div className={styles.body}>
        <h3 className={styles.name}>{p.name}</h3>
        <div className={styles.meta}>
          <span>{p.position}</span>
          <span aria-hidden="true">·</span>
          <span>{age} anys</span>
          <span aria-hidden="true">·</span>
          <span>{p.nationality}</span>
        </div>
      </div>
    </Link>
  );
}

export default function Team() {
  const season = parseInt(String(club.season).slice(0, 4), 10) + 1;

  return (
    <>
      <Seo title="Primer Equip" description={`Plantilla del Reus FC Reddis temporada ${club.season}: ${players.length} jugadors i cos tècnic dirigit per ${staff.coach.name}.`} />

      <div className={`container ${styles.head}`}>
        <Badge variant="primary">{club.competition} · {club.group}</Badge>
        <h1 className={styles.title}>Primer Equip</h1>
        <p className={styles.sub}>Temporada {club.season} · {players.length} jugadors</p>
      </div>

      <section className={styles.gallerySection} aria-label="Galeria de la plantilla">
        <CircularGallery
          items={players.map(p => ({ image: p.photo, text: `${p.number} · ${p.name}` }))}
          bend={2.5}
          textColor="#ffffff"
          borderRadius={0.06}
          font="bold 22px system-ui, sans-serif"
          scrollEase={0.03}
          scrollSpeed={2.2}
        />
        <p className={styles.galleryHint}>Arrossega o gira la roda per navegar per la plantilla</p>
      </section>

      <main className={`container ${styles.groupsWrap}`}>
        <section className={styles.coachRow}>
          <SectionHeader eyebrow="Cos tècnic" title="Entrenador" />
          <div className={styles.coachCard}>
            <img src={staff.coach.photo} alt="" className={styles.coachPhoto} />
            <div>
              <h3 className={styles.coachName}>{staff.coach.name}</h3>
              <p className={styles.coachRole}>{staff.coach.role}</p>
            </div>
          </div>
        </section>

        {POSITIONS.map(pos => {
          const group = players.filter(p => p.position === pos);
          if (group.length === 0) return null;
          return (
            <section key={pos} className={styles.section}>
              <SectionHeader eyebrow={pos} title={`${POSITION_LABELS[pos]} (${group.length})`} />
              <div className={styles.grid}>
                {group.map(p => <PlayerCard key={p.id} p={p} season={season} />)}
              </div>
            </section>
          );
        })}
      </main>
    </>
  );
}
