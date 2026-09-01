import { Link } from 'react-router-dom';
import club from '../../data/club.json';
import matches from '../../data/matches.json';
import standings from '../../data/standings.json';
import products from '../../data/products.json';
import sponsors from '../../data/sponsors.json';
import { ctas } from '../../data/navigation.js';

import Button from '../../components/ui/Button/Button.jsx';
import SectionHeader from '../../components/ui/SectionHeader/SectionHeader.jsx';
import Badge from '../../components/ui/Badge/Badge.jsx';
import NextMatch from '../../components/match/NextMatch/NextMatch.jsx';
import MatchCard from '../../components/match/MatchCard/MatchCard.jsx';
import LeagueTable from '../../components/match/LeagueTable/LeagueTable.jsx';
import SponsorGrid from '../../components/sponsors/SponsorGrid/SponsorGrid.jsx';
import Seo from '../../components/ui/Seo/Seo.jsx';
import { formatDateShort, formatTime } from '../../utils/dates.js';

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

const FEATURE_TILES = [
  { to: '/equip',      label: 'Equip',      img: '/assets/hero/aficio.webp' },
  { to: '/aficio',     label: 'Afició',     img: '/assets/hero/aficio.webp' },
  { to: '/actualitat', label: 'Actualitat', img: '/assets/news/copa-del-rey.webp' },
  { to: '/estadi',     label: 'Estadi',     img: '/assets/hero/stadium.webp' },
  { to: '/historia',   label: 'Història',   img: '/assets/hero/aficio.webp' },
];

export default function Home() {
  const now = Date.now();
  const nextMatch = matches.find(m => m.status === 'scheduled' && new Date(m.date).getTime() >= now)
    || matches.find(m => m.status === 'scheduled');
  const recentResults = matches.filter(m => m.status === 'played').slice(-3).reverse();
  const upcoming = matches.filter(m => m.status === 'scheduled' && new Date(m.date).getTime() >= now).slice(0, 4);
  const featuredProducts = products.slice(0, 4);

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
            <p className={styles.heroSub}>Orgullosos dels colors, temporada {club.season}.</p>
          </div>
          <div className={styles.heroMatch}>
            <NextMatch match={nextMatch} />
          </div>
        </div>
      </section>

      {/* COM ESTEM */}
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

      {/* CALENDARI PRÒXIMS PARTITS + ENTRADES */}
      <section className={`${styles.section} ${styles.sectionSurface}`}>
        <div className="container">
          <SectionHeader
            eyebrow="Pròxims partits"
            title="Calendari"
            action={<Button as={Link} to="/calendari" variant="outline" size="sm">Veure calendari</Button>}
          />
          {upcoming.length === 0 ? (
            <p className={styles.empty}>Encara no hi ha partits programats.</p>
          ) : (
            <div className={styles.calRow}>
              {upcoming.map(m => {
                const d = new Date(m.date);
                const dateLabel = d.toLocaleDateString('ca-ES', { weekday: 'long', day: 'numeric', month: 'short' });
                const timeLabel = m.time || (d.getHours() ? d.toTimeString().slice(0, 5) : '—:—');
                return (
                  <article key={m.id} className={styles.calCard}>
                    <header className={styles.calHead}>
                      <span className={styles.calRound}>{m.round || 'Jornada'}</span>
                      <span className={styles.calComp} title={m.competition} aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4 5v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V5l-8-3z"/></svg>
                      </span>
                    </header>

                    <div className={styles.calTeams}>
                      <img src={m.home.badge} alt={m.home.name} className={styles.calBadge} />
                      <span className={styles.calVs}>VS</span>
                      <img src={m.away.badge} alt={m.away.name} className={styles.calBadge} />
                    </div>

                    <p className={styles.calNames}>
                      {m.home.name}<br/>{m.away.name}
                    </p>

                    <div className={styles.calMeta}>
                      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>{dateLabel}</span>
                      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>{timeLabel}</span>
                    </div>
                    <p className={styles.calVenue}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      {m.venue}
                    </p>

                    {m.ticketsUrl ? (
                      <a href={m.ticketsUrl} target="_blank" rel="noopener noreferrer" className={styles.calCta}>
                        Entrades
                      </a>
                    ) : (
                      <button className={styles.calCtaDisabled} disabled>Entrades</button>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* TILES SECCIONS PRINCIPALS */}
      <section className={styles.tilesSection}>
        <div className="container">
          <div className={styles.tilesGrid}>
            {FEATURE_TILES.map(t => (
              <Link key={t.to} to={t.to} className={styles.featTile}>
                <div className={styles.featImgWrap}>
                  <img src={t.img} alt="" className={styles.featImg} loading="lazy" />
                </div>
                <div className={styles.featCap}>
                  <span className={styles.featLabel}>{t.label}</span>
                  <span className={styles.featMore}>Veure més</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BOTIGA */}
      <section className={`container ${styles.section}`}>
        <SectionHeader
          eyebrow="Botiga oficial"
          title="Vesteix els colors"
          action={<Button as={Link} to="/botiga" variant="outline" size="sm">Anar a la botiga</Button>}
        />
        <div className={styles.shopGrid}>
          {featuredProducts.map(p => (
            <Link key={p.id} to={`/botiga/${p.slug}`} className={styles.shopCard}>
              <div className={styles.shopImgWrap}>
                <img src={p.image} alt="" className={styles.shopImg} loading="lazy" />
              </div>
              <div className={styles.shopBody}>
                <h3>{p.name}</h3>
                <span className={styles.shopPrice}>{p.price.toFixed(2)} €</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* PATROCINADORS */}
      <section className={`container ${styles.section}`}>
        <SectionHeader eyebrow="Amb el suport de" title="Patrocinadors" />
        <SponsorGrid sponsors={sponsors} />
      </section>
    </>
  );
}
