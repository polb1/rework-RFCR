import club from '../../data/club.json';
import Badge from '../../components/ui/Badge/Badge.jsx';
import SectionHeader from '../../components/ui/SectionHeader/SectionHeader.jsx';
import styles from './Stadium.module.css';

export default function Stadium() {
  const s = club.stadium;
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <img src={s.photo} alt="" className={styles.heroImg} />
        <div className={styles.heroOverlay} />
        <div className={`container ${styles.heroInner}`}>
          <Badge variant="primary">Estadi</Badge>
          <h1 className={styles.title}>{s.name}</h1>
          <p className={styles.sub}>{s.city} · {s.capacity.toLocaleString('ca-ES')} espectadors</p>
        </div>
      </section>

      <section className={`container ${styles.stats}`}>
        <div><dt>Capacitat</dt><dd>{s.capacity.toLocaleString('ca-ES')}</dd></div>
        <div><dt>Superfície</dt><dd>Gespa natural</dd></div>
        <div><dt>Il·luminació</dt><dd>LED homologada</dd></div>
        <div><dt>Ciutat</dt><dd>{s.city}</dd></div>
      </section>

      <section className={`container ${styles.body}`}>
        <SectionHeader eyebrow="Casa del Reus" title="El Municipal" />
        <p>
          L'<strong>Estadi Municipal de Reus</strong> és la casa del Reus FC Reddis i un dels equipaments esportius més emblemàtics de la ciutat. Amb capacitat per a {s.capacity.toLocaleString('ca-ES')} espectadors, acull tots els partits com a local del primer equip a Segona Federació.
        </p>
        <p>
          L'estadi és propietat municipal i comparteix ubicació amb altres equipaments esportius de la ciutat. La proximitat amb el centre urbà i la bona connexió amb transport públic el converteixen en un espai fàcilment accessible tant per a l'aficionat local com per als visitants.
        </p>
        <p>
          En dies de partit, l'ambient roig-i-negre omple el Municipal amb el suport incondicional de la Grada d'Animació, que empeny el primer equip en tots els compromisos de lliga i Copa del Rei.
        </p>
      </section>
    </main>
  );
}
