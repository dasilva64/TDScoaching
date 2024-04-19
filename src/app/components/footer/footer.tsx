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
          <li className={styles.footer__li}>
            <Link className={`${styles.footer__a} modalOpen`} href="/">
              Accueil
            </Link>
          </li>
          <li className={styles.footer__li}>
            <Link
              className={`${styles.footer__a} modalOpen`}
              href="/qui-suis-je"
            >
              Qui suis-je ?
            </Link>
          </li>
          <li className={styles.footer__li}>
            <Link
              className={`${styles.footer__a} modalOpen`}
              href="/coaching-de-vie"
            >
              Coaching de vie
            </Link>
          </li>
          <li className={styles.footer__li}>
            <Link className={`${styles.footer__a} modalOpen`} href="/tarif">
              Tarifs et modalité
            </Link>
          </li>
          <li className={styles.footer__li}>
            <Link
              className={`${styles.footer__a} modalOpen`}
              href="/assets/pdf/Code-deontologie-ICF-France.pdf"
              target="_blank"
            >
              Code de déontologie
            </Link>
          </li>

          <li className={styles.footer__li}>
            <Link className={`${styles.footer__a} modalOpen`} href="/contact">
              Contact
            </Link>
          </li>
          <li className={styles.footer__li}>
            <Link
              className={`${styles.footer__a} modalOpen`}
              href="/politique-de-confidentialite"
            >
              Politique de confidentialité
            </Link>
          </li>
          <li className={styles.footer__li}>
            <Link
              className={`${styles.footer__a} modalOpen`}
              href="/conditions-generales-utilisations"
            >
              Conditions générales d&apos;utilisations
            </Link>
          </li>
          <li className={styles.footer__li}>
            <Link
              className={`${styles.footer__a} modalOpen`}
              href="/mentions-legales"
            >
              Mentions légales
            </Link>
          </li>
          {/* <li className={styles.footer__li}>
              <Link className={styles.footer__a} href="/">
                Politique de confidentialité
              </Link>
            </li> */}
        </ul>
      </section>
      <section>
        <h2 className={styles.footer__h2}>Nous retrouver</h2>
        <ul className={`${styles.footer__ul} ${styles.footer__ul__lineHeight}`}>
          <li className={styles.footer__li}>
            Mail :{" "}
            <Link
              className={`${styles.footer__a} modalOpen`}
              href="mailto:contact@tds-coachingdevie.fr"
            >
              contact@tds-coachingdevie.fr
            </Link>
          </li>
          <li className={styles.footer__li}>
            Tel :{" "}
            <Link
              className={`${styles.footer__a} modalOpen`}
              href="tel:+33781673125"
            >
              {" "}
              07 81 67 31 25
            </Link>
          </li>
          <li className={styles.footer__li}>
            Horaire : 8h - 20h du lundi au vendredi
          </li>
          <li className={styles.footer__li}>
            <strong className={styles.footer__strong}>Bordeaux</strong>,{" "}
            <strong className={styles.footer__strong}>Chambery</strong>,{" "}
            <strong className={styles.footer__strong}>Lyon</strong>
          </li>
        </ul>
        <GoTop />
      </section>
    </footer>
  );
};

export default Footer;
