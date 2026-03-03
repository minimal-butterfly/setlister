'use client';

import { useTheme, Theme } from './ThemeProvider';
import styles from './ThemeSwitcher.module.css';

const THEMES: Theme[] = ['techno', 'acid', 'trance'];

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className={styles.switcher}>
      {THEMES.map((t) => (
        <button
          key={t}
          onClick={() => setTheme(t)}
          className={`${styles.button} ${theme === t ? styles.active : ''}`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
