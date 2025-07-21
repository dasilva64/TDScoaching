import "server-only";

import styles from "./header.module.scss";
import LinkNav from "./ui/LinkNav";
import Image from "../image/Image";
import Link from "next/link";
import Content from "./display/Content";
import FlashMessage from "./ui/flashMessage/FlashMessage";
import BtnNav from "./ui/BtnNav";

const Header = async () => {
  return (
    <>
      <header id="header" className={styles.header}>
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
            <li className={styles.header__li}>
              <LinkNav name="Blog" path="/blog" />
            </li>
            <li className={styles.header__li}>
              <BtnNav name="RDV gratuit" />
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
