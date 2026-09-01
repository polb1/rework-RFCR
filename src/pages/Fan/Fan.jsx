import { Link } from 'react-router-dom';
import club from '../../data/club.json';
import { social, ctas } from '../../data/navigation.js';
import Badge from '../../components/ui/Badge/Badge.jsx';
import SectionHeader from '../../components/ui/SectionHeader/SectionHeader.jsx';
import styles from './Fan.module.css';

export default function Fan() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <img src={club.heroImages.aficio} alt="" className={styles.heroImg} />
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
          L'afició del <strong>Reus FC Reddis</strong> és el motor que fa gran aquest projecte. Cada dissabte omplim el Municipal amb passió, respecte i esperit reusenc. Aquí trobaràs tot el que necessites per formar part de la família roig-i-negra.
        </p>
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
