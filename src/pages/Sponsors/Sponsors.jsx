import sponsors from '../../data/sponsors.json';
import Badge from '../../components/ui/Badge/Badge.jsx';
import SectionHeader from '../../components/ui/SectionHeader/SectionHeader.jsx';
import styles from './Sponsors.module.css';

const TIERS = [
  { key: 'principal', label: 'Patrocinadors principals' },
  { key: 'or',        label: 'Patrocinadors or' },
  { key: 'plata',     label: 'Patrocinadors plata' },
  { key: 'colab',     label: 'Col·laboradors' },
];

function SponsorItem({ s }) {
  const content = (
    <>
      <img src={s.logo} alt={s.name} className={styles.logo} loading="lazy" />
      <span className={styles.name}>{s.name}</span>
    </>
  );
  return s.url && s.url !== '#' ? (
    <a href={s.url} target="_blank" rel="noopener noreferrer" className={styles.card}>{content}</a>
  ) : (
    <div className={styles.card}>{content}</div>
  );
}

export default function Sponsors() {
  return (
    <main className={`container ${styles.page}`}>
      <header className={styles.head}>
        <Badge variant="primary">Club</Badge>
        <h1 className={styles.title}>Patrocinadors</h1>
        <p className={styles.sub}>Empreses que fan possible el projecte roig-i-negre</p>
      </header>

      {TIERS.map(tier => {
        const list = sponsors.filter(s => s.tier === tier.key);
        if (list.length === 0) return null;
        return (
          <section key={tier.key} className={styles.section}>
            <SectionHeader eyebrow={tier.label} title={`${list.length} entitats`} />
            <div className={styles.grid}>
              {list.map((s, i) => <SponsorItem key={i} s={s} />)}
            </div>
          </section>
        );
      })}
    </main>
  );
}
