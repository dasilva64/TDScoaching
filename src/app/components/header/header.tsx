import "server-only";

import styles from "./header.module.scss";
import LinkNav from "./ui/LinkNav";
import Image from "next/image";
import Link from "next/link";
import Content from "./display/Content";
import FlashMessage from "./ui/FlashMessage";

const Header = async () => {
  return (
    <>
      <header className={styles.header}>
        <figure className={styles.header__figure}>
          <Link className="link modalOpen" href="/" tabIndex={0}>
            <Image
              className={styles.header__logo}
              width={0}
              height={0}
              sizes="100vw"
              src="/assets/logo/logo3.webp"
              alt="logo tdss coaching"
              priority={true}
            />
          </Link>
          <figcaption className={styles.header__figcaption}>
            Coach de vie
          </figcaption>
        </figure>
        <nav className={`${styles.header__nav}`}>
          <ul className={`${styles.header__ul}`}>
            <li className={styles.header__li}>
              <LinkNav name="Accueil" path="/" />
            </li>
            <li className={styles.header__li}>
              <LinkNav name="Qui suis-je ?" path="/qui-suis-je" />
            </li>
            <li className={`${styles.header__li}`}>
              <LinkNav name="Coaching de vie" path="/coaching-de-vie" />
            </li>
            <li className={styles.header__li}>
              <LinkNav name="Tarifs et modalité" path="/tarif" />
            </li>
            <li className={styles.header__li}>
              <LinkNav name="Contact" path="/contact" />
            </li>
          </ul>
        </nav>
        <Content />
      </header>
      <FlashMessage />
    </>
  );
};

export default Header;
