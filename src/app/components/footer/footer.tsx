import Link from "next/link";
import styles from "./footer.module.scss";
import GoTop from "../goTop/goTop";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footer__container}>
        <div>
          <h2 className={styles.footer__h2}>Plan du site</h2>
          <ul className={styles.footer__ul}>
            <li className={styles.footer__li}>
              <Link className={styles.footer__a} href="/">
                Accueil
              </Link>
            </li>
            <li className={styles.footer__li}>
              <Link className={styles.footer__a} href="/qui-suis-je">
                Qui suis-je ?
              </Link>
            </li>
            <li className={styles.footer__li}>
              <Link className={styles.footer__a} href="/">
                Coaching de vie
              </Link>
              <ul className={styles.footer__ul}>
                <li className={styles.footer__li}>
                  <Link
                    className={styles.footer__a}
                    href="/coaching-de-vie/vie-familiale"
                  >
                    Vie familiale
                  </Link>
                </li>
                <li className={styles.footer__li}>
                  <Link
                    className={styles.footer__a}
                    href="/coaching-de-vie/vie-de-couple"
                  >
                    Vie de couple
                  </Link>
                </li>
                <li className={styles.footer__li}>
                  <Link
                    className={styles.footer__a}
                    href="/coaching-de-vie/vie-professionnelle"
                  >
                    Vie professionnelle
                  </Link>
                </li>
              </ul>
            </li>
            <li className={styles.footer__li}>
              <span className={styles.footer__a}>Mes prestations</span>
              <ul className={styles.footer__ul}>
                <li className={styles.footer__li}>
                  <Link className={styles.footer__a} href="/modalite">
                    {" "}
                    Modalités du coaching
                  </Link>
                </li>
                <li className={styles.footer__li}>
                  <Link className={styles.footer__a} href="/tarif">
                    Tarif / Durée
                  </Link>
                </li>
                <li className={styles.footer__li}>
                  <Link
                    className={styles.footer__a}
                    href="/code-de-deontologie"
                  >
                    Code de déontologie
                  </Link>
                </li>
              </ul>
            </li>
            <li className={styles.footer__li}>
              <Link className={styles.footer__a} href="/contact">
                Contact
              </Link>
            </li>
            <li className={styles.footer__li}>
              <Link className={styles.footer__a} href="/">
                Politique de confidentialité
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className={styles.footer__h2}>Nous retrouver</h2>
          <ul
            className={`${styles.footer__ul} ${styles.footer__ul__lineHeight}`}
          >
            <li className={styles.footer__li}>
              Mail :{" "}
              <Link
                className={styles.footer__a}
                href="mailto:contact@tds-coachingdevie.fr"
              >
                contact@tds-coachingdevie.fr
              </Link>
            </li>
            <li className={styles.footer__li}>
              Tel :{" "}
              <Link className={styles.footer__a} href="tel:+33781673125">
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
        </div>
      </div>
    </footer>
  );
};

export default Footer;
