import styles from './Setlists.module.css';

export default function Setlists() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Setlists</h1>
        <p className={styles.body}>Your setlists will be displayed here.</p>
      </main>
    </div>
  );
}
