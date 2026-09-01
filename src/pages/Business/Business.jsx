import Badge from '../../components/ui/Badge/Badge.jsx';
import SectionHeader from '../../components/ui/SectionHeader/SectionHeader.jsx';
import styles from './Business.module.css';

const BENEFITS = [
  { title: 'Visibilitat local', text: 'Presència al Municipal, xarxes socials i comunicacions oficials del club davant milers d\'aficionats.' },
  { title: 'Networking', text: 'Accés a la xarxa d\'empreses Roig i Negra i esdeveniments exclusius per a patrocinadors.' },
  { title: 'Responsabilitat social', text: 'Vincula la teva marca a un projecte esportiu i social arrelat a la ciutat de Reus.' },
  { title: 'Experiències VIP', text: 'Palcs, entrades preferents i experiències per als teus clients i equip.' },
];

export default function Business() {
  return (
    <main className={`container ${styles.page}`}>
      <header className={styles.head}>
        <Badge variant="primary">Empresa</Badge>
        <h1 className={styles.title}>Empresa Roig i Negra</h1>
        <p className={styles.sub}>El club obre les portes a les empreses del territori que volen créixer amb nosaltres</p>
      </header>

      <SectionHeader eyebrow="Per què" title="Beneficis de patrocinar el Reus FC Reddis" />
      <div className={styles.grid}>
        {BENEFITS.map(b => (
          <article key={b.title} className={styles.card}>
            <h3 className={styles.cardTitle}>{b.title}</h3>
            <p>{b.text}</p>
          </article>
        ))}
      </div>

      <section className={styles.contact}>
        <SectionHeader eyebrow="Comercial" title="Parlem-ne" />
        <p>Contacta amb l'àrea comercial per rebre una proposta personalitzada adaptada als objectius de la teva empresa.</p>
        <p className={styles.mail}><a href="mailto:comercial@reusfcreddis.cat">comercial@reusfcreddis.cat</a></p>
      </section>
    </main>
  );
}
