import Link from 'next/link'
import Image from "next/image";
import styles from './Header.module.css';

export const Header = () => {
    return (
      <header className={styles.header}>
        <Link href="/">
          <h1 className={styles.h1}>
            <Image
              src="./images/logo.svg"
              alt="Liam"
              width={98}
              height={30}
              className={styles.image}
              quality={100}
            />
          </h1>
        </Link>
      </header>
    );
  };
