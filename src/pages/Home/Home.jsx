import styles from './Home.module.css';

export default function Home() {
  return (
    <main className={`container ${styles.home}`}>
      <h1 className={styles.title}>Reus FC Reddis</h1>
      <p className={styles.tagline}>Web oficial — en construcció.</p>
    </main>
  );
}
