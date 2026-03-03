import Link from 'next/link';
import ThemeSwitcher from './ThemeSwitcher';

export default function Navigation() {
  return (
    <nav>
      <ul>
        <li>
          <Link href="/record-collection">Record Collection</Link>
        </li>
        <li>
          <Link href="/setlists">Setlists</Link>
        </li>
      </ul>
      <ThemeSwitcher />
    </nav>
  );
}
