import Link from 'next/link';
import ThemeSwitcher from './ThemeSwitcher';
import styles from './Navigation.module.css';

export default function Navigation() {
  return (
    <nav className={styles.nav}>
      <ul className={styles.list}>
        <li>
          <Link href="/record-collection" className={styles.link}>Record Collection</Link>
        </li>
        <li>
          <Link href="/setlists" className={styles.link}>Setlists</Link>
        </li>
      </ul>
      <ThemeSwitcher />
    </nav>
  );
}
