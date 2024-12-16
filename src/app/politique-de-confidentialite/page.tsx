import React from "react";
import styles from "./page.module.scss";
import NoScript from "../components/noscript/NoScript";

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
          tdscoaching s’engage à ce que la collecte et le traitement de vos
          données, effectués à partir du site tdscoaching.fr, soient conformes
          au règlement général sur la protection des données (RGPD) et à la loi
          Informatique et Libertés.
        </p>
        <p className={styles.pdc__p}>
          Si vous rencontrez des difficultés dans l’exercice de vos droits, vous
          pouvez nous contacter à l’adresse suivante :
          le-delegue-a-la-protection-des-donnees-personnelles[at]finances.gouv.fr
        </p>
        <p className={styles.pdc__p}>
          En cas de non-conformité relative au traitement de vos données, vous
          avez le droit d&apos;introduire une réclamation auprès de l’autorité
          de contrôle, la CNIL, 3, Place de Fontenoy TSA 80715 75334 PARIS Cedex
          07.
        </p>
        <h2 className={styles.pdc__h2}>Cookies</h2>
        <p className={styles.pdc__p}>
          Si vous avez un compte et que vous vous connectez sur le site, un
          cookie temporaire sera créé afin de persister votre état de connexion.
          Ce cookie sera automatiquement détruit lorsque vous vous déconnectez
          du site.
        </p>
        <h2 className={styles.pdc__h2}>Durées de stockage de vos données</h2>
        <p className={styles.pdc__p}>
          Pour les utilisateurs et utilisatrices qui s’enregistrent sur le site,
          nous stockons également les données personnelles indiquées dans leur
          profil. Tous les utilisateurs et utilisatrices peuvent voir, modifier
          ou supprimer leurs informations personnelles à tout moment. Seul le
          gestionnaire du site peut aussi voir et modifier ces informations.
        </p>
        <h2 className={styles.pdc__h2}>
          Les droits que vous avez sur vos données
        </h2>
        <p className={styles.pdc__p}>
          Si vous avez un compte, vous pouvez demander la suppression des
          données personnelles vous concernant. Cela ne prend pas en compte les
          données stockées à des fins administratives, légales ou pour des
          raisons de sécurité.
        </p>
        <p className={styles.pdc__p}>
          Si vous avez un compte et que vous souhaitez supprimer vos
          informations vous pouvez le faire automatiquement depuis votre compte
          en cliquant sur le bouton supprimé.
        </p>
        <h2 className={styles.pdc__h2}>
          Transmission de vos données personnelles
        </h2>
        <p className={styles.pdc__p}>
          Vos données ne sont pas partagées avec un tiers.
        </p>
        <h2 className={styles.pdc__h2}>Informations supplémentaires</h2>
        <h3 className={styles.pdc__h3}>
          Procédures mises en œuvre en cas de fuite de données
        </h3>
        <p className={styles.pdc__p}>
          Conformément à la procédure prévue par le règlement général sur la
          protection des données en cas de fuite ou d’anomalie concernant les
          données personnelles en notre possession, nous vous avertirons de la
          nature des données ayant fuitées et la nature du risque qui peut être
          engendrée, si cela peut entamer vos droits et libertés (données
          sensibles) dans un délai maximal de 72 heures après constat du
          problème.
        </p>
      </main>
    </>
  );
};

export default page;
