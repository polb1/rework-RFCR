import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="container" style={{ padding: '6rem 1rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '3rem', color: 'var(--color-primary)' }}>404</h1>
      <p style={{ marginTop: '1rem', color: 'var(--color-text-muted)' }}>Aquesta pàgina no existeix.</p>
      <Link to="/" style={{ display: 'inline-block', marginTop: '1.5rem', color: 'var(--color-primary)' }}>Torna a l'inici</Link>
    </main>
  );
}
