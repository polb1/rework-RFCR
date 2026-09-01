import { Link } from 'react-router-dom';
import club from '../../data/club.json';
import matches from '../../data/matches.json';
import standings from '../../data/standings.json';
import news from '../../data/news.json';
import sponsors from '../../data/sponsors.json';

import Button from '../../components/ui/Button/Button.jsx';
import SectionHeader from '../../components/ui/SectionHeader/SectionHeader.jsx';
import NextMatch from '../../components/match/NextMatch/NextMatch.jsx';
import MatchCard from '../../components/match/MatchCard/MatchCard.jsx';
import LeagueTable from '../../components/match/LeagueTable/LeagueTable.jsx';
import NewsCard from '../../components/news/NewsCard/NewsCard.jsx';
import SponsorGrid from '../../components/sponsors/SponsorGrid/SponsorGrid.jsx';
import Seo from '../../components/ui/Seo/Seo.jsx';

import styles from './Home.module.css';

const HOME_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'SportsTeam',
  name: 'Reus FC Reddis',
  sport: 'Football',
  memberOf: { '@type': 'SportsOrganization', name: 'Segona Federació' },
  location: { '@type': 'Place', name: 'Estadi Municipal de Reus', address: 'Reus, Catalunya' },
  url: 'https://www.reusfcreddis.cat/',
  logo: '/assets/badges/rfcr.webp',
};

export default function Home() {
  const now = Date.now();
  const nextMatch = matches.find(m => m.status === 'scheduled' && new Date(m.date).getTime() >= now)
    || matches.find(m => m.status === 'scheduled');
  const recentResults = matches.filter(m => m.status === 'played').slice(-3).reverse();
  const latestNews = news.slice(0, 3);

  return (
    <>
      <Seo jsonLd={HOME_JSONLD} />
      <section className={styles.hero} style={{ backgroundImage: `url(${club.heroImages.stadium})` }}>
        <div className={styles.heroOverlay} />
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroText}>
            <img src="/assets/badges/rfcr.webp" alt="" className={styles.heroBadge} />
            <span className={styles.eyebrow}>{club.competition} · {club.group}</span>
            <h1 className={styles.heroTitle}>Reus <span>FC</span> Reddis</h1>
            <p className={styles.heroSub}>
              Orgullosos dels colors, temporada {club.season}.
            </p>
          </div>
          <div className={styles.heroMatch}>
            <NextMatch match={nextMatch} />
          </div>
        </div>
      </section>

      <section className={`container ${styles.section}`}>
        <div className={styles.twoCol}>
          <div>
            <SectionHeader
              eyebrow="Últims resultats"
              title="Com estem"
              action={<Button as={Link} to="/resultats" variant="outline" size="sm">Tots els resultats</Button>}
            />
            <div className={styles.results}>
              {recentResults.map(m => <MatchCard key={m.id} match={m} />)}
            </div>
          </div>
          <div>
            <SectionHeader
              eyebrow="Classificació"
              title={club.group}
              action={<Button as={Link} to="/classificacio" variant="outline" size="sm">Taula completa</Button>}
            />
            <LeagueTable rows={standings} compact />
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionDark}`}>
        <div className="container">
          <SectionHeader
            eyebrow="Actualitat"
            title="Últimes notícies"
            action={<Button as={Link} to="/actualitat" variant="outline" size="sm">Veure totes</Button>}
          />
          <div className={styles.newsGrid}>
            {latestNews.map(n => <NewsCard key={n.id} item={n} />)}
          </div>
        </div>
      </section>

      <section className={`container ${styles.section}`}>
        <div className={styles.ctaGrid}>
          <Link to="/equip" className={styles.tile} style={{ backgroundImage: `url(${club.heroImages.aficio})` }}>
            <div className={styles.tileOverlay} />
            <div className={styles.tileText}>
              <span className={styles.eyebrow}>Primer equip</span>
              <h3>Coneix la plantilla</h3>
            </div>
          </Link>
          <Link to="/botiga" className={`${styles.tile} ${styles.tileRed}`}>
            <div className={styles.tileText}>
              <span className={styles.eyebrow}>Botiga oficial</span>
              <h3>Vesteix els colors</h3>
            </div>
          </Link>
          <Link to="/aficio" className={styles.tile} style={{ backgroundImage: `url(${club.heroImages.aficio})` }}>
            <div className={styles.tileOverlay} />
            <div className={styles.tileText}>
              <span className={styles.eyebrow}>Afició</span>
              <h3>El 12è jugador</h3>
            </div>
          </Link>
        </div>
      </section>

      <section className={`container ${styles.section}`}>
        <SectionHeader eyebrow="Amb el suport de" title="Patrocinadors" />
        <SponsorGrid sponsors={sponsors} />
      </section>
    </>
  );
}
