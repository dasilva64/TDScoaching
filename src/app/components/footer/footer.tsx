import Link from "next/link";
import styles from "./footer.module.scss";
import GoTop from "../goTop/goTop";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <section>
        <h2 className={styles.footer__h2}>Plan du site</h2>
        <ul
          className={`${styles.footer__ul} ${styles.footer__ul__lineHeightMin}`}
        >
          <li className={`${styles.footer__li} ${styles.footer__li__plan}`}>
            <Link className={`${styles.footer__a} modalOpen`} href="/">
              Accueil
            </Link>
          </li>
          <li className={`${styles.footer__li} ${styles.footer__li__plan}`}>
            <Link
              className={`${styles.footer__a} modalOpen`}
              href="/qui-suis-je"
            >
              Qui suis-je ?
            </Link>
          </li>
          <li className={`${styles.footer__li} ${styles.footer__li__plan}`}>
            <Link
              className={`${styles.footer__a} modalOpen`}
              href="/coaching-de-vie"
            >
              Coaching de vie
            </Link>
          </li>
          <li className={`${styles.footer__li} ${styles.footer__li__plan}`}>
            <Link className={`${styles.footer__a} modalOpen`} href="/tarif">
              Tarifs et modalité
            </Link>
          </li>
          <li className={`${styles.footer__li} ${styles.footer__li__plan}`}>
            <Link
              className={`${styles.footer__a} modalOpen`}
              href="/assets/pdf/Code-deontologie-ICF-France.pdf"
              target="_blank"
            >
              Code de déontologie
            </Link>
          </li>

          <li className={`${styles.footer__li} ${styles.footer__li__plan}`}>
            <Link className={`${styles.footer__a} modalOpen`} href="/contact">
              Contact
            </Link>
          </li>
          <li className={`${styles.footer__li} ${styles.footer__li__plan}`}>
            <Link
              className={`${styles.footer__a} modalOpen`}
              href="/politique-de-confidentialite"
            >
              Politique de confidentialité
            </Link>
          </li>
          <li className={`${styles.footer__li} ${styles.footer__li__plan}`}>
            <Link
              className={`${styles.footer__a} modalOpen`}
              href="/conditions-generales-utilisations"
            >
              Conditions générales d&apos;utilisations
            </Link>
          </li>
          {/*  <li className={`${styles.footer__li} ${styles.footer__li__plan}`}>
            <Link
              className={`${styles.footer__a} modalOpen`}
              href="/conditions-generales-de-vente"
            >
              Conditions générales de vente
            </Link>
          </li> */}
          <li className={`${styles.footer__li} ${styles.footer__li__plan}`}>
            <Link
              className={`${styles.footer__a} modalOpen`}
              href="/mentions-legales"
            >
              Mentions légales
            </Link>
          </li>
        </ul>
      </section>
      <section>
        <h2 className={styles.footer__h2}>Nous retrouver</h2>
        <ul className={`${styles.footer__ul}`}>
          <li className={`${styles.footer__li} ${styles.footer__li__contact}`}>
            Mail :&nbsp;
            <Link
              className={`${styles.footer__a} modalOpen`}
              href="mailto:contact@tdscoaching.fr"
            >
              {" "}
              contact@tdscoaching.fr
            </Link>
          </li>
          <li className={`${styles.footer__li} ${styles.footer__li__contact}`}>
            Tel :&nbsp;
            <Link
              className={`${styles.footer__a} modalOpen`}
              href="tel:+33781673125"
            >
              {" "}
              07 81 67 31 25
            </Link>
          </li>
          <li className={`${styles.footer__li} ${styles.footer__li__contact}`}>
            Horaire : 8h - 20h du lundi au vendredi
          </li>
          <li className={`${styles.footer__li} ${styles.footer__li__contact}`}>
            <p className={styles.footer__strong}>Bordeaux</p>,&nbsp;
            <p className={styles.footer__strong}>Chambery</p>,&nbsp;
            <p className={styles.footer__strong}>Lyon</p>
          </li>
        </ul>
        <GoTop />
      </section>
    </footer>
  );
};

export default Footer;
