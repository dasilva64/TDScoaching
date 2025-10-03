import React from "react";
import styles from "./page.module.scss";
import Footer from "../components/footer/footer";
import Link from "next/link";

export const metadata = {
  title: "Mentions légales - tdscoaching",
  description:
    "Mentions légales du site tdscoaching.fr pour informer les utilisateurs sur les intervenants de sa réalisation et de son suivi.",
  icons: {
    icon: "https://www.tdscoaching.fr/assets/logo/logo3.webp",
  },
  author: "Thierry Da Silva",
  robots: "noindex, nofollow",
  other: {
    "google-site-verification": "F921bU_1dl5iiaUL_B8FTJjSxG5GYYTBOyaGEHp964Q",
  },
};

const page = () => {
  return (
    <>
      <main className={styles.ml}>
        <h1 className={styles.ml__h1}>Mentions légales</h1>
        <p className={styles.ml__p}>En vigueur au 22/01/2024</p>

        <h2 className={styles.ml__h2}>Présentation du site</h2>
        <p className={styles.ml__p}>
          En vertu de l&apos;article 6 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l&apos;économie numérique, il est précisé aux utilisateurs du site{" "}
          <Link className={styles.ml__link} href="https://tdscoaching.fr">
            tdscoaching.fr
          </Link>{" "}
          l&apos;identité des différents intervenants dans le cadre de sa réalisation et de son suivi :
        </p>

        <p className={styles.ml__p}>
          <strong>Propriétaire</strong> : Thierry DA SILVA SEABRA – TDS Direct Services – Micro-entreprise – SIRET : 843931304 – 5 rue Jean Zubietta, 33400 Talence
        </p>
        <p className={styles.ml__p}>
          <strong>Créateur</strong> : Thierry DA SILVA SEABRA – TDS Direct Services
        </p>
        <p className={styles.ml__p}>
          <strong>Responsable publication</strong> : Thierry DA SILVA SEABRA – TDS Direct Services
        </p>
        <p className={styles.ml__p}>
          Le responsable publication est une personne physique.
        </p>
        <p className={styles.ml__p}>
          <strong>Webmaster</strong> : Thomas DA SILVA SEABRA –{" "}
          <Link className={styles.ml__link} href="mailto:thomas.dss@protonmail.com">
            thomas.dss@protonmail.com
          </Link>
        </p>
        <p className={styles.ml__p}>
          <strong>Hébergeur</strong> : Vercel Inc – 440 N Barranca Ave #4133 – Covina, CA 91723 –{" "}
          <Link className={styles.ml__link} href="https://vercel.com">
            https://vercel.com
          </Link>
        </p>

        <h2 className={styles.ml__h2}>Conditions d’utilisation</h2>
        <p className={styles.ml__p}>
          L’utilisation du site{" "}
          <Link className={styles.ml__link} href="https://tdscoaching.fr">
            tdscoaching.fr
          </Link>{" "}
          implique l’acceptation pleine et entière de la{" "}
          <Link className={styles.ml__link} href="/politique-de-confidentialite">
            Politique de confidentialité
          </Link>{" "}
          disponibles sur le site.
        </p>
      </main>
      <Footer />
    </>
  );
};

export default page;
