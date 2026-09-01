import Badge from '../../components/ui/Badge/Badge.jsx';
import SectionHeader from '../../components/ui/SectionHeader/SectionHeader.jsx';
import styles from './Member.module.css';

const TIERS = [
  { name: 'Adult general', price: 180, perks: ['Seient tota la temporada', 'Descompte a la botiga', 'Prioritat Copa del Rei'] },
  { name: 'Jove (fins a 25)', price: 120, perks: ['Seient tota la temporada', 'Preu reduït', 'Prioritat Copa del Rei'] },
  { name: 'Infantil', price: 60, perks: ['Seient tota la temporada', 'Kit d\'aficionat', 'Activitats exclusives'] },
  { name: 'Jubilat', price: 100, perks: ['Seient tota la temporada', 'Preu reduït', 'Prioritat Copa del Rei'] },
];

export default function Member() {
  return (
    <main className={`container ${styles.page}`}>
      <header className={styles.head}>
        <Badge variant="primary">Socis</Badge>
        <h1 className={styles.title}>Fes-te Soci</h1>
        <p className={styles.sub}>Forma part de la família roig-i-negra i viu totes les emocions al Municipal</p>
      </header>

      <SectionHeader eyebrow="Modalitats" title="Tria la teva quota" />
      <div className={styles.grid}>
        {TIERS.map(t => (
          <article key={t.name} className={styles.card}>
            <h3 className={styles.name}>{t.name}</h3>
            <p className={styles.price}><span>{t.price}€</span> / temporada</p>
            <ul className={styles.perks}>
              {t.perks.map(p => <li key={p}>{p}</li>)}
            </ul>
            <button className={styles.cta}>Ho vull</button>
          </article>
        ))}
      </div>

      <p className={styles.hint}>La renovació i alta de socis es gestiona a través de l'àrea social del club. Contacta a <a href="mailto:social@reusfcreddis.cat">social@reusfcreddis.cat</a>.</p>
    </main>
  );
}
