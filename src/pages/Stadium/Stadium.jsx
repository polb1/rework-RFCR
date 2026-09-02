import club from '../../data/club.json';
import Badge from '../../components/ui/Badge/Badge.jsx';
import SectionHeader from '../../components/ui/SectionHeader/SectionHeader.jsx';
import Seo from '../../components/ui/Seo/Seo.jsx';
import styles from './Stadium.module.css';

export default function Stadium() {
  const s = club.stadium;
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.address)}`;
  const embedUrl = `https://www.google.com/maps?q=${encodeURIComponent(s.address)}&output=embed`;

  return (
    <main className={styles.page}>
      <Seo title="Estadi Municipal de Reus" description={`Informació de l'${s.name}: capacitat, ubicació, com arribar-hi i com és el dia de partit.`} />

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

      <section className={`container ${styles.locationSection}`}>
        <SectionHeader eyebrow="Ubicació" title="Com arribar al Municipal" />
        <div className={styles.locationGrid}>
          <div className={styles.locationInfo}>
            <div className={styles.infoBlock}>
              <h4>📍 Adreça</h4>
              <p>{s.address}</p>
            </div>
            <div className={styles.infoBlock}>
              <h4>🚗 En cotxe</h4>
              <p>Sortida 37 de l'AP-7 direcció Reus. Aparcament gratuït al voltant del recinte esportiu.</p>
            </div>
            <div className={styles.infoBlock}>
              <h4>🚌 Transport públic</h4>
              <p>Línia urbana Reus Transport parada Estadi Municipal. Estació de Rodalies (R14, R15, R16) a 15 min a peu.</p>
            </div>
            <div className={styles.infoBlock}>
              <h4>🅿️ Aparcament</h4>
              <p>Zones lliures al carrer Recasens i Mercadé i al Camí de Mont-roig. Aforament ampli en dies de partit.</p>
            </div>
            <a href={mapUrl} target="_blank" rel="noopener noreferrer" className={styles.mapCta}>
              Obrir a Google Maps →
            </a>
          </div>
          <div className={styles.locationMap}>
            <iframe
              title="Mapa Estadi Municipal de Reus"
              src={embedUrl}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <section className={`container ${styles.body}`}>
        <SectionHeader eyebrow="Casa del Reus" title="El Municipal" />
        <p>
          L'<strong>Estadi Municipal de Reus</strong> és la casa del Reus FC Reddis i un dels equipaments esportius més emblemàtics de la ciutat. Amb capacitat per a {s.capacity.toLocaleString('ca-ES')} espectadors, acull tots els partits com a local del primer equip a Segona Federació.
        </p>
        <p>
          El recinte, propietat municipal, es troba al carrer de Recasens i Mercadé, a la zona esportiva de Reus, i comparteix ubicació amb altres equipaments de la ciutat. La proximitat amb el centre urbà i la bona connexió amb transport públic el converteixen en un espai fàcilment accessible tant per a l'aficionat local com per als visitants.
        </p>
        <p>
          En dies de partit, l'ambient roig-i-negre omple el Municipal amb el suport incondicional de la <strong>Grada d'Animació</strong>, que empeny el primer equip en tots els compromisos de lliga i Copa del Rei. La graderia coberta permet gaudir del futbol amb qualsevol condició meteorològica.
        </p>
      </section>

      <section className={`container ${styles.matchdaySection}`}>
        <SectionHeader eyebrow="Dia de partit" title="Què has de saber" />
        <ul className={styles.matchdayList}>
          <li><strong>Portes obertes:</strong> 1 hora abans del xiulet inicial.</li>
          <li><strong>Entrades:</strong> es venen online al portal oficial i a taquilla el mateix dia.</li>
          <li><strong>Bar del Municipal:</strong> obert durant tot el partit amb menjar i beguda a preus populars.</li>
          <li><strong>Botiga oficial:</strong> disponible a l'entrada del recinte.</li>
          <li><strong>Animació:</strong> la Grada d'Animació és a la zona sud del Municipal.</li>
          <li><strong>Accessibilitat:</strong> l'estadi disposa d'accessos i seients adaptats per persones amb mobilitat reduïda.</li>
        </ul>
      </section>
    </main>
  );
}
