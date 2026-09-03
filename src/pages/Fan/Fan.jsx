import { useState } from 'react';
import { Link } from 'react-router-dom';
import club from '../../data/club.json';
import { social, ctas } from '../../data/navigation.js';
import Badge from '../../components/ui/Badge/Badge.jsx';
import SectionHeader from '../../components/ui/SectionHeader/SectionHeader.jsx';
import Seo from '../../components/ui/Seo/Seo.jsx';
import Lightbox from '../../components/ui/Lightbox/Lightbox.jsx';
import styles from './Fan.module.css';

const AWAY_TRIPS = [
  {
    date: '2026-05-11',
    opponent: 'Terrassa FC',
    city: 'Terrassa',
    venue: 'Estadi Olímpic de Terrassa',
    fans: '≈1.200',
    highlight: 'El millor desplaçament de la història del futbol reusenc.',
    detail: 'Prop de 1.200 aficionats van omplir el sector visitant per assegurar el playoff d\'ascens. Les 400 entrades oficials es van esgotar en menys de 24h. El club va organitzar un desplaçament en autocar a 20€.',
    image: '/assets/aficio/desplacament-terrasa.jpg',
    source: 'https://www.diarimes.com/ca/esports/260504/millor-desplacament-historia-reus_218370.html'
  },
  {
    date: '2026-04-27',
    opponent: 'UE Sant Andreu',
    city: 'Barcelona',
    venue: 'Camp Municipal Narcís Sala',
    fans: '≈400',
    highlight: 'Massiu desplaçament en un partit clau per l\'ascens.',
    detail: 'Més de 400 aficionats roig-i-negres es van desplaçar a Barcelona per acompanyar l\'equip en el partit contra el Sant Andreu, un dels rivals directes per la promoció.',
    image: '/assets/aficio/desplacament-sant-andreu.jpg',
    source: null
  },
  {
    date: '2026-03-15',
    opponent: 'CD Ourense',
    city: 'Ourense',
    venue: 'Estadio O Couto',
    fans: '≈150',
    highlight: 'Desplaçament de llarga distància per un partit histric.',
    detail: 'L\'afició roig-i-negra va viatjar fins a Galícia per acompanyar l\'equip al partit contra el CD Ourense. Un desplaçament emotiu que demostra el compromís dels seguidors.',
    image: '/assets/aficio/desplacament-ourense.jpg',
    source: null
  },
  {
    date: '2026-02-08',
    opponent: 'Atlético Baleares',
    city: 'Palma',
    venue: 'Estadi Balear',
    fans: '≈180',
    highlight: 'Vaig cap a les Illes: la primera expedició en vaixell.',
    detail: 'Un grup important d\'aficionats va organitzar un desplaçament combinat amb vaixell i avió per acompanyar el Reus a l\'Estadi Balear davant l\'Atlético Baleares.',
    image: '/assets/aficio/deplacament-atletico-baleares.jpg',
    source: null
  },
  {
    date: '2025-11-30',
    opponent: 'Atlètic Lleida',
    city: 'Lleida',
    venue: 'Camp d\'Esports',
    fans: '≈300',
    highlight: 'Desplaçament tarragoní massiu al camp lleidatà.',
    detail: 'Un derbi català carregat d\'expectació on l\'afició del Reus va tenyir de roig-i-negre una zona del Camp d\'Esports.',
    image: '/assets/aficio/desplacament-atletic-lleida.jpg',
    source: null
  },
  {
    date: '2025-10-19',
    opponent: 'UE Olot',
    city: 'Olot',
    venue: 'Estadi Municipal d\'Olot',
    fans: '≈220',
    highlight: 'La família roig-i-negra visita la Garrotxa.',
    detail: 'Els aficionats del Reus van omplir el sector visitant al camp de l\'UE Olot, en un desplaçament que demostra la mobilització constant de l\'afició pels camps de Catalunya.',
    image: '/assets/aficio/desplacament-olot.jpg',
    source: null
  },
  {
    date: '2025-11-15',
    opponent: 'CE Manresa',
    city: 'Manresa',
    venue: 'Estadi del Congost',
    fans: '≈250',
    highlight: 'Un dels desplaçaments habituals de la temporada.',
    detail: 'L\'afició reusenca respon setmana rere setmana als partits fora de casa a Catalunya, especialment en ciutats properes com Manresa i Terrassa.',
    image: '/assets/aficio/desplacament-terrasaV2.jpg',
    source: null
  }
];

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('ca-ES', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function Fan() {
  const [lightbox, setLightbox] = useState(null);
  return (
    <main className={styles.page}>
      <Lightbox src={lightbox} onClose={() => setLightbox(null)} />
      <Seo title="Afició" description="La força que empeny el Reus FC Reddis: comunitat, desplaçaments massius i suport incondicional." />

      <section className={styles.hero}>
        <img src="/assets/hero/aficio2.jpg" alt="" className={styles.heroImg} />
        <div className={styles.heroOverlay} />
        <div className={`container ${styles.heroInner}`}>
          <Badge variant="primary">Afició</Badge>
          <h1 className={styles.title}>Orgullosos dels colors fins a morir</h1>
          <p className={styles.sub}>La força que empeny el Reus FC Reddis</p>
        </div>
      </section>

      <section className={`container ${styles.intro}`}>
        <SectionHeader eyebrow="Comunitat" title="La nostra gent" />
        <p>
          L'afició del <strong>Reus FC Reddis</strong> és el motor que fa gran aquest projecte. Cada dissabte omplim el Municipal amb passió, respecte i esperit reusenc. La família roig-i-negra creix any rere any i s'ha convertit en un dels pilars fonamentals del club.
        </p>
      </section>

      <section className={`container ${styles.gallerySection}`}>
        <SectionHeader eyebrow="Ambient" title="La marea roig-i-negra" />
        <div className={styles.gallery}>
          {['/assets/hero/aficio3.jpg', '/assets/hero/aficio4.jpg', '/assets/hero/aficio5.jpg', '/assets/hero/aficio6.jpg', '/assets/hero/aficio7.jpg', '/assets/hero/aficio8.jpg'].map((src, i) => (
            <button key={i} type="button" className={styles.galleryItem} onClick={() => setLightbox(src)} aria-label="Ampliar imatge">
              <img src={src} alt="" loading="lazy" />
              <span className={styles.galleryZoom} aria-hidden="true">🔍</span>
            </button>
          ))}
        </div>
      </section>

      <section className={`container ${styles.tripsSection}`}>
        <SectionHeader
          eyebrow="Desplaçaments històrics"
          title="Ens sentim visitants a tot arreu"
        />
        <p className={styles.tripsIntro}>
          Els desplaçaments dels aficionats del Reus FC Reddis són una de les senyes d'identitat del club. Des de l'ascens a Tercera Federació, els partits fora de casa a Catalunya sempre tenen presència roig-i-negra a la grada visitant.
        </p>
        <div className={styles.tripsList}>
          {AWAY_TRIPS.map((t, i) => (
            <article key={i} className={styles.tripCard}>
              {t.image && (
                <button type="button" className={styles.tripImgWrap} onClick={() => setLightbox(t.image)} aria-label={`Ampliar imatge desplaçament ${t.opponent}`}>
                  <img src={t.image} alt="" loading="lazy" className={styles.tripImg} />
                  <span className={styles.tripFansBadge}>👥 {t.fans}</span>
                </button>
              )}
              <div className={styles.tripBody}>
                <div className={styles.tripHead}>
                  <span className={styles.tripBadge}>vs {t.opponent}</span>
                  <time className={styles.tripDate}>{formatDate(t.date)}</time>
                </div>
                <h3 className={styles.tripTitle}>{t.highlight}</h3>
                <p className={styles.tripVenue}>📍 {t.venue} · {t.city}</p>
                <p className={styles.tripDetail}>{t.detail}</p>
                {t.source && (
                  <a href={t.source} target="_blank" rel="noopener noreferrer" className={styles.tripSource}>
                    Llegir notícia →
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={`container ${styles.tiles}`}>
        <Link to="/fes-te-soci" className={styles.tile}>
          <span className={styles.tileEyebrow}>Socis</span>
          <h3 className={styles.tileTitle}>Fes-te soci</h3>
          <p>Assegura't el teu seient tota la temporada amb tots els avantatges del club.</p>
          <span className={styles.tileCta}>Vull ser soci →</span>
        </Link>

        <a href={ctas.tickets.href} target="_blank" rel="noopener noreferrer" className={styles.tile}>
          <span className={styles.tileEyebrow}>Entrades</span>
          <h3 className={styles.tileTitle}>Compra la teva entrada</h3>
          <p>Venda oficial d'entrades per als partits del primer equip al Municipal.</p>
          <span className={styles.tileCta}>Comprar entrades →</span>
        </a>

        <Link to="/estadi" className={styles.tile}>
          <span className={styles.tileEyebrow}>Estadi</span>
          <h3 className={styles.tileTitle}>Municipal de Reus</h3>
          <p>Informació de l'estadi, com arribar-hi i on aparcar en dies de partit.</p>
          <span className={styles.tileCta}>Descobreix →</span>
        </Link>

        <Link to="/benvingut-visitant" className={styles.tile}>
          <span className={styles.tileEyebrow}>Visitants</span>
          <h3 className={styles.tileTitle}>Benvingut a Reus</h3>
          <p>Guia pràctica per l'aficionat visitant: on dormir, on dinar i què veure a la ciutat.</p>
          <span className={styles.tileCta}>Veure la guia →</span>
        </Link>
      </section>

      <section className={`container ${styles.social}`}>
        <SectionHeader eyebrow="Xarxes" title="Segueix-nos" />
        <ul className={styles.socialList}>
          {social.map(s => (
            <li key={s.name}>
              <a href={s.href} target="_blank" rel="noopener noreferrer">{s.name}</a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
