import Button from '../../components/ui/Button/Button.jsx';
import Badge from '../../components/ui/Badge/Badge.jsx';
import Card from '../../components/ui/Card/Card.jsx';
import SectionHeader from '../../components/ui/SectionHeader/SectionHeader.jsx';
import styles from './UIKit.module.css';

export default function UIKit() {
  return (
    <main className={`container ${styles.page}`}>
      <h1 className={styles.pageTitle}>UI Kit — Reus FC Reddis</h1>

      <section className={styles.section}>
        <SectionHeader eyebrow="Components" title="Buttons" subtitle="Variants i mides." />
        <div className={styles.row}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="primary" disabled>Disabled</Button>
        </div>
        <div className={styles.row}>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      <section className={styles.section}>
        <SectionHeader eyebrow="Components" title="Badges" />
        <div className={styles.row}>
          <Badge>Neutral</Badge>
          <Badge variant="primary">Segona Federació</Badge>
          <Badge variant="dark">Jornada 5</Badge>
          <Badge variant="accent">Destacat</Badge>
          <Badge variant="win">V</Badge>
          <Badge variant="draw">E</Badge>
          <Badge variant="loss">D</Badge>
        </div>
      </section>

      <section className={styles.section}>
        <SectionHeader
          eyebrow="Components"
          title="Cards"
          subtitle="Shell reutilitzable per notícies, partits, jugadors…"
          action={<Button variant="outline" size="sm">Veure més</Button>}
        />
        <div className={styles.grid}>
          <Card>
            <Badge variant="primary">Notícia</Badge>
            <h3 style={{ marginTop: '.75rem', fontSize: '1.25rem' }}>Card base</h3>
            <p style={{ marginTop: '.5rem', color: 'var(--color-text-muted)' }}>
              Contingut arbitrari dins de la card.
            </p>
          </Card>
          <Card elevated>
            <Badge variant="dark">Elevated</Badge>
            <h3 style={{ marginTop: '.75rem', fontSize: '1.25rem' }}>Card elevada</h3>
            <p style={{ marginTop: '.5rem', color: 'var(--color-text-muted)' }}>
              Ombra + hover, per grids de partits o productes.
            </p>
          </Card>
        </div>
      </section>
    </main>
  );
}
