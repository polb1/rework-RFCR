import players from '../../data/players.json';
import staff from '../../data/staff.json';
import club from '../../data/club.json';
import SectionHeader from '../../components/ui/SectionHeader/SectionHeader.jsx';
import Badge from '../../components/ui/Badge/Badge.jsx';
import Seo from '../../components/ui/Seo/Seo.jsx';
import CircularGallery from '../../components/gallery/CircularGallery.jsx';
import PlayerCarousel from '../../components/team/PlayerCarousel/PlayerCarousel.jsx';
import styles from './Team.module.css';

const POSITIONS = ['Porter', 'Defensa', 'Migcampista', 'Davanter'];
const POSITION_LABELS = {
  Porter: 'Porters',
  Defensa: 'Defenses',
  Migcampista: 'Migcampistes',
  Davanter: 'Atacants',
};

const FALLBACK_PHOTO = '/assets/players/placeholder.svg';

function CoachCard({ coach }) {
  const handleError = (e) => { e.currentTarget.src = FALLBACK_PHOTO; };
  return (
    <article className={styles.coachHero}>
      <div className={styles.coachPhotoWrap}>
        <img
          src={coach.photo || FALLBACK_PHOTO}
          alt={coach.fullName || coach.name}
          onError={handleError}
          className={styles.coachHeroPhoto}
        />
        <span className={styles.coachOverlay} aria-hidden="true">
          <span className={styles.coachRoleTag}>{coach.role}</span>
        </span>
      </div>
      <div className={styles.coachBody}>
        <span className={styles.coachEyebrow}>Cos tècnic · Entrenador</span>
        <h2 className={styles.coachName}>{coach.name}</h2>
        {coach.fullName && coach.fullName !== coach.name && (
          <p className={styles.coachFullName}>{coach.fullName}</p>
        )}
        <div className={styles.coachMeta}>
          {coach.birthplace && <span>📍 {coach.birthplace}</span>}
          {coach.birthYear && <span>🎂 {coach.birthYear}</span>}
          {coach.nationality && <span>🏳️ {coach.nationality}</span>}
        </div>

        {coach.bio && (
          <div className={styles.coachBio}>
            {coach.bio.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        )}

        {coach.highlights && (
          <dl className={styles.coachStats}>
            {coach.highlights.map((h, i) => (
              <div key={i}>
                <dt>{h.label}</dt>
                <dd>{h.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </article>
  );
}

export default function Team() {
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
        {/* COS TÈCNIC — hero de l'entrenador */}
        <section className={styles.coachSection}>
          <SectionHeader eyebrow="Cos tècnic" title="L'entrenador" />
          <CoachCard coach={staff.coach} />
        </section>

        {POSITIONS.map(pos => {
          const group = players.filter(p => p.position === pos);
          if (group.length === 0) return null;
          return (
            <section key={pos} className={styles.section}>
              <SectionHeader eyebrow={pos} title={`${POSITION_LABELS[pos]} (${group.length})`} />
              <PlayerCarousel position={pos} players={group} />
            </section>
          );
        })}
      </main>
    </>
  );
}
