import React from "react";
import styles from "./page.module.scss";
import NoScript from "../components/noscript/NoScript";
import Footer from "../components/footer/footer";
import Link from "next/link";

export const metadata = {
  title: "Politique de confidentialité - tdscoaching",
  description:
    "Politique de confidentialité du site tdscoaching.fr pour informer les utilisateurs sur les intervenants de sa réalisation et de son suivi.",
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
      <NoScript />

      <main className={styles.pdc}>
        <h1 className={styles.pdc__h1}>Politique de confidentialité</h1>

        <p className={styles.pdc__p}>
          TDS Coaching s’engage à ce que la collecte et le traitement de vos données, effectués à partir du site{" "}
          <Link className={styles.pdc__link} href="https://tdscoaching.fr">
            tdscoaching.fr
          </Link>, soient conformes au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés.
        </p>

        <p className={styles.pdc__p}>
          Pour toute question relative à vos données personnelles ou à l’exercice de vos droits, vous pouvez nous contacter à l’adresse suivante :{" "}
          <Link className={styles.pdc__link} href="mailto:thomas.dss@protonmail.com">
            thomas.dss@protonmail.com
          </Link>
        </p>

        <p className={styles.pdc__p}>
          En cas de non-conformité relative au traitement de vos données, vous avez le droit d&apos;introduire une réclamation auprès de l’autorité de contrôle, la CNIL, 3 Place de Fontenoy TSA 80715 75334 PARIS Cedex 07 –{" "}
          <Link className={styles.pdc__link} href="https://www.cnil.fr">
            www.cnil.fr
          </Link>
        </p>

        <h2 className={styles.pdc__h2}>Cookies</h2>
        <p className={styles.pdc__p}>
          Le site utilise plusieurs types de cookies :
        </p>
        <ul className={styles.pdc__p}>
          <li>
            <strong>Cookie de session (Iron Session)</strong> : Ce cookie est permanent pendant la durée de la session. Il permet de maintenir l’état de connexion de l’utilisateur, même s’il n’est pas connecté, et est également utilisé pour la protection CSRF.
          </li>
          <li>
            <strong>Cookies Stripe</strong> : Lors de l’enregistrement d’une carte bancaire ou du paiement via Stripe, des cookies techniques peuvent être déposés par Stripe pour assurer la sécurité et le bon fonctionnement du paiement. Pour plus d’informations, consulter la politique de confidentialité de Stripe :{" "}
            <Link className={styles.pdc__link} href="https://stripe.com/fr/privacy">
              https://stripe.com/fr/privacy
            </Link>
          </li>
        </ul>

        <h2 className={styles.pdc__h2}>Durées de stockage de vos données</h2>
        <p className={styles.pdc__p}>
          Pour les utilisateurs et utilisatrices qui s’enregistrent sur le site, nous stockons également les données personnelles indiquées dans leur profil. Tous les utilisateurs et utilisatrices peuvent voir, modifier ou supprimer leurs informations personnelles à tout moment. Seul le gestionnaire du site peut aussi voir et modifier ces informations.
        </p>

        <h2 className={styles.pdc__h2}>Les droits que vous avez sur vos données</h2>
        <p className={styles.pdc__p}>
          Conformément au RGPD, vous disposez des droits suivants : accès, rectification, suppression, limitation, opposition et portabilité.
        </p>
        <p className={styles.pdc__p}>
          Si vous avez un compte, vous pouvez demander la suppression des données personnelles vous concernant. Cela ne prend pas en compte les données stockées à des fins administratives, légales ou pour des raisons de sécurité.
        </p>
        <p className={styles.pdc__p}>
          Vous pouvez supprimer vos informations automatiquement depuis votre compte en cliquant sur le bouton “Supprimer mon compte”.
        </p>

        <h2 className={styles.pdc__h2}>Transmission de vos données personnelles</h2>
        <p className={styles.pdc__p}>
          Vos données ne sont pas partagées avec des tiers. Elles sont utilisées exclusivement dans le cadre de la relation client et du bon fonctionnement du site.
        </p>

        <h2 className={styles.pdc__h2}>Informations supplémentaires</h2>
        <h3 className={styles.pdc__h3}>Procédures mises en œuvre en cas de fuite de données</h3>
        <p className={styles.pdc__p}>
          Conformément à la procédure prévue par le RGPD, en cas de fuite ou d’anomalie concernant les données personnelles en notre possession, nous vous avertirons de la nature des données concernées et du risque potentiel, si cela peut entamer vos droits et libertés (données sensibles), dans un délai maximal de 72 heures après constat du problème.
        </p>
      </main>

      <Footer />
    </>
  );
};

export default page;
