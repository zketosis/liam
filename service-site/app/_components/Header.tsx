
import Link from 'next/link'
import styles from './Header.module.css';

export const Header = () => {
    return (
      <header className={styles.header}>
        <h1 className={styles.h1}>
        <Link href="/">LOGO</Link>
        </h1>
      </header>
    );
  };
