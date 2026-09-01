import club from '../../data/club.json';
import { social } from '../../data/navigation.js';
import Badge from '../../components/ui/Badge/Badge.jsx';
import SectionHeader from '../../components/ui/SectionHeader/SectionHeader.jsx';
import styles from './Contact.module.css';

export default function Contact() {
  return (
    <main className={`container ${styles.page}`}>
      <header className={styles.head}>
        <Badge variant="primary">Contacte</Badge>
        <h1 className={styles.title}>Contacta amb el club</h1>
        <p className={styles.sub}>Estem a la teva disposició per a qualsevol consulta</p>
      </header>

      <div className={styles.layout}>
        <section className={styles.info}>
          <SectionHeader eyebrow="Adreça" title={club.stadium.name} />
          <address className={styles.address}>
            {club.stadium.name}<br/>
            {club.stadium.city}, Catalunya
          </address>

          <SectionHeader eyebrow="Contacte" title="Canals oficials" />
          <ul className={styles.channels}>
            <li><span>Correu general</span><a href="mailto:info@reusfcreddis.cat">info@reusfcreddis.cat</a></li>
            <li><span>Àrea social</span><a href="mailto:social@reusfcreddis.cat">social@reusfcreddis.cat</a></li>
            <li><span>Àrea comercial</span><a href="mailto:comercial@reusfcreddis.cat">comercial@reusfcreddis.cat</a></li>
            <li><span>Premsa</span><a href="mailto:premsa@reusfcreddis.cat">premsa@reusfcreddis.cat</a></li>
          </ul>

          <SectionHeader eyebrow="Segueix-nos" title="Xarxes socials" />
          <ul className={styles.social}>
            {social.map(s => (
              <li key={s.name}><a href={s.href} target="_blank" rel="noopener noreferrer">{s.name}</a></li>
            ))}
          </ul>
        </section>

        <form className={styles.form} onSubmit={e => e.preventDefault()}>
          <SectionHeader eyebrow="Escriu-nos" title="Formulari de contacte" />
          <label className={styles.field}>
            <span>Nom</span>
            <input type="text" name="name" required />
          </label>
          <label className={styles.field}>
            <span>Correu electrònic</span>
            <input type="email" name="email" required />
          </label>
          <label className={styles.field}>
            <span>Assumpte</span>
            <input type="text" name="subject" required />
          </label>
          <label className={styles.field}>
            <span>Missatge</span>
            <textarea name="message" rows="5" required />
          </label>
          <button type="submit" className={styles.submit}>Envia</button>
          <p className={styles.hint}>Aquest formulari és una demostració. Cap dada s'envia enlloc.</p>
        </form>
      </div>
    </main>
  );
}
