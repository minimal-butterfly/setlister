import Link from 'next/link';
import styles from './Navigation.module.css';

export default function Navigation() {
  return (
    <nav className={styles.nav}>
      <ul className={styles.list}>
        <li>
          <Link href="/search" className={styles.link}>Search</Link>
        </li>
        <li>
          <Link href="/record-collection" className={styles.link}>Collection</Link>
        </li>
        <li>
          <Link href="/setlists" className={styles.link}>Setlists</Link>
        </li>
      </ul>
    </nav>
  );
}
