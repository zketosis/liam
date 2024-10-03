import Link from 'next/link';
import styles from './Footer.module.css';
import { LiamLogoMark, Github, X } from './logos';


export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.logoContainer}>
        <Link href="/" className={styles.logo}>
          <LiamLogoMark />
        </Link>
        <p className={styles.text}>
          &copy; 2024 Liam
        </p>
      </div>
      <div className={styles.linksContainer}>
        <Link href="/" className={styles.textLink}>
          {/* TODO: Add Privacy Policy link */}
          Privacy Policy
        </Link>
        <Link href="https://github.com/route06inc/liam" className={styles.snsLink} target="_blank">
          <Github />
        </Link>
        <Link href="https://x.com/liam_app" className={styles.snsLink} target="_blank">
          <X />
        </Link>
      </div>
    </footer>
  );
};
