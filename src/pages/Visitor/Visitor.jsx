import { Link } from 'react-router-dom';
import data from '../../data/visitor.json';
import Badge from '../../components/ui/Badge/Badge.jsx';
import SectionHeader from '../../components/ui/SectionHeader/SectionHeader.jsx';
import Seo from '../../components/ui/Seo/Seo.jsx';
import club from '../../data/club.json';
import styles from './Visitor.module.css';

function CardList({ items, kind }) {
  return (
    <ul className={styles.list}>
      {items.map(it => (
        <li key={it.name} className={styles.card}>
          <div className={styles.cardHead}>
            <h3>{it.name}</h3>
            <span className={styles.tag}>{it.type || it.cuisine}</span>
          </div>
          <p className={styles.area}>📍 {it.area}</p>
          <p className={styles.note}>{it.note}</p>
        </li>
      ))}
    </ul>
  );
}

export default function Visitor() {
  return (
    <>
      <Seo
        title="Benvingut, visitant"
        description="Guia pràctica per a l'aficionat que ve a Reus: on dormir, on dinar, què veure i com arribar al Municipal."
      />

      <section className={styles.hero} style={{ backgroundImage: `url(${club.heroImages.stadium})` }}>
        <div className={styles.heroOverlay} />
        <div className={`container ${styles.heroInner}`}>
          <Badge variant="primary">{data.hero.eyebrow}</Badge>
          <h1 className={styles.heroTitle}>{data.hero.title}</h1>
          <p className={styles.heroSub}>{data.hero.sub}</p>
        </div>
      </section>

      <div className={`container ${styles.page}`}>
        <section className={styles.introBlock}>
          {data.intro.map((p, i) => <p key={i}>{p}</p>)}
        </section>

        {/* ESTADI */}
        <section className={styles.section}>
          <SectionHeader eyebrow="Estadi" title={data.stadium.name} />
          <div className={styles.stadiumGrid}>
            <div className={styles.stadiumInfo}>
              <p><strong>📍 Adreça:</strong> {data.stadium.address}</p>
              <p><strong>🚗 Com arribar:</strong> {data.stadium.howToArrive}</p>
              <p><strong>🅿️ Aparcament:</strong> {data.stadium.parking}</p>
              <p><strong>👥 Aforament:</strong> {data.stadium.capacity.toLocaleString('ca-ES')} espectadors</p>
            </div>
            <div className={styles.stadiumMap}>
              <iframe
                title="Mapa de l'Estadi Municipal de Reus"
                src={`https://www.google.com/maps?q=${encodeURIComponent(data.stadium.address)}&output=embed`}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>

        {/* ON DORMIR */}
        <section className={styles.section}>
          <SectionHeader eyebrow="On dormir" title="Allotjaments a Reus" />
          <CardList items={data.sleep} />
        </section>

        {/* ON DINAR */}
        <section className={styles.section}>
          <SectionHeader eyebrow="On dinar" title="Menjar i tapes" />
          <CardList items={data.eat} />
        </section>

        {/* QUÈ VEURE */}
        <section className={styles.section}>
          <SectionHeader eyebrow="Què veure" title="Reus imprescindible" />
          <CardList items={data.see} />
        </section>

        {/* VERMUT */}
        <section className={`${styles.section} ${styles.vermut}`}>
          <SectionHeader eyebrow="Tradició" title={data.vermut.title} />
          <p className={styles.vermutText}>{data.vermut.text}</p>
        </section>

        {/* CONSELLS PRÀCTICS */}
        <section className={styles.section}>
          <SectionHeader eyebrow="Info pràctica" title="Consells ràpids" />
          <ul className={styles.tips}>
            {data.tips.map(t => (
              <li key={t.title} className={styles.tipCard}>
                <h4>{t.title}</h4>
                <p>{t.text}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* LINKS EXTERNS */}
        <section className={styles.section}>
          <SectionHeader eyebrow="Més informació" title="Enllaços oficials" />
          <div className={styles.externals}>
            {data.externalLinks.map(l => (
              <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className={styles.extLink}>
                {l.label} ↗
              </a>
            ))}
          </div>
        </section>

        <section className={styles.footBlock}>
          <p>Bona estada a Reus. Ens veiem al Municipal! 🔴⚫</p>
          <Link to="/calendari" className={styles.footCta}>Veure el calendari de partits →</Link>
        </section>
      </div>
    </>
  );
}
