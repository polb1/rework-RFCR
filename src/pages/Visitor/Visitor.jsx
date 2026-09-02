import { Link } from 'react-router-dom';
import data from '../../data/visitor.json';
import Badge from '../../components/ui/Badge/Badge.jsx';
import SectionHeader from '../../components/ui/SectionHeader/SectionHeader.jsx';
import Seo from '../../components/ui/Seo/Seo.jsx';
import club from '../../data/club.json';
import styles from './Visitor.module.css';

const KIND_ICON = {
  sleep: '🛏️',
  eat: '🍴',
  see: '🏛️',
};

function Card({ item, kind }) {
  const label = item.type || item.cuisine;

  const cardContent = (
    <>
      <div className={styles.imgWrap}>
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className={styles.img}
            loading="lazy"
            onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement.classList.add(styles.imgFallbackShow); }}
          />
        ) : null}
        <div className={styles.imgFallback} aria-hidden="true">{KIND_ICON[kind] || '📍'}</div>
      </div>
      <div className={styles.body}>
        <div className={styles.head}>
          <h3 className={styles.name}>{item.name}</h3>
          {label && <span className={styles.tag}>{label}</span>}
        </div>
        <p className={styles.area}>
          <svg className={styles.iconSm} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {item.area}
        </p>
        <p className={styles.note}>{item.note}</p>
        {item.mapUrl && (
          <span className={styles.mapCta}>
            <svg className={styles.iconSm} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 20l-6-3V4l6 3M9 20l6-3M9 20V7M15 17l6 3V7l-6-3M15 17V4"/></svg>
            Veure al mapa
          </span>
        )}
      </div>
    </>
  );

  return item.mapUrl ? (
    <a
      href={item.mapUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.card}
      aria-label={`Obrir ${item.name} a Google Maps`}
    >
      {cardContent}
    </a>
  ) : (
    <div className={styles.card}>{cardContent}</div>
  );
}

function CardList({ items, kind }) {
  return (
    <ul className={styles.list}>
      {items.map(it => (
        <li key={it.name}>
          <Card item={it} kind={kind} />
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
              {data.stadium.mapUrl && (
                <a href={data.stadium.mapUrl} target="_blank" rel="noopener noreferrer" className={styles.stadiumCta}>
                  Obrir a Google Maps →
                </a>
              )}
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
          <CardList items={data.sleep} kind="sleep" />
        </section>

        {/* ON DINAR */}
        <section className={styles.section}>
          <SectionHeader eyebrow="On dinar" title="Menjar i tapes" />
          <CardList items={data.eat} kind="eat" />
        </section>

        {/* QUÈ VEURE */}
        <section className={styles.section}>
          <SectionHeader eyebrow="Què veure" title="Reus imprescindible" />
          <CardList items={data.see} kind="see" />
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
